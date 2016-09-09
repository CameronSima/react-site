var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var fs = require('fs')
var path = require('path')
var moniker = require('moniker')
var multer = require('multer')
var async = require('async')
var asyncEach = require('async-each')
var _ = require('lodash')

var Comment = mongoose.model('Comment')
var Thread = mongoose.model('Thread')
var User = mongoose.model('User')

module.exports = function (passport) {

  // Additional middleware which will set headers that we need on each request.
  router.use(function (req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.

    //res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    //res.header('Access-Control-Allow-Origin', 'http://localhost:3001')

    // allow request from both the dev server and through the express
    // server port.
    var allowedOrigins = ['http://localhost:3000', 'http://localhost:3001']
    var origin = req.headers.origin
    if (allowedOrigins.indexOf(origin) > -1) {
      res.header('Access-Control-Allow-Origin', origin)
    }

    res.header('Content-Type', 'application/json')
    res.header('Access-Control-Allow-Credentials', true)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache')
    next()
  })

  // helper functions

  var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    console.log(req.user)
    return next()
  } else {
    res.json('not logged in')
    return next()
    //res.redirect('http://localhost:3001/signup')
  }
}

var isInArray = function (item, array) {
  return array.indexOf(item) > -1
}

var remove = function (item, array) {
  return _.filter(array, function(element) {
    return element != item
  })
}

var getRandomUsername = function () {
  return moniker.choose().split('-').join(' ')
}

var threadQuery = function (field, value) {
  var query = Thread.find({
    field: value 
  })
  return query
}

  // Configuration for multer image uploading middleware
  var storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, __dirname + '/../src/assets/user_images/')
    },
    filename: function(req, file, callback) {
      callback(null, file.originalname + '-' + Date.now())
    }
  })

  var upload = multer({
    storage: storage
  }).single('userPhoto')

// Routes

  // router.post('/api/login', function (req, res, next) {
  //   passport.authenticate('login', function (err, user, info) {
  //     if (err)
  //       return res.json(err)
  //     if (!user)
  //       return
  //     res.json(user)
  //   })(req, res, next)
  // })

  // router.get('/api/logout', function (req, res) {
  //   req.logout()
  //   res.redirect('/')
  // })

  router.post('/api/signup', function (req, res, next) {
    passport.authenticate('signup', function (err, user, info) {
      if (err) {
        return res.json(err)
      }
      if (!user) {
        return
      }
      res.json(user)
    })(req, res, next)
  })

  router.get(
    '/api/auth/facebook',
    passport.authenticate('facebook', { authType: 'rerequest' })
  );
    
  router.get(
    '/api/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: 'http://localhost:3000',
        failureRedirect: 'http://localhost:3000/signup',
        session: true
    }), 
    function (req, res) {
      req.session.save(function (err) {
        if (err) {
          console.log(err)
        }
        res.send(session)
      })
    }
  );

  // Get thread comments
  router.get('/api/comments/:threadId', function (req, res, next) {
    Comment.find({
      thread: req.params.threadId
    })
    .exec(function (err, comments) {
      res.json(comments)
    })
  })

  router.post('/api/comments/', isAuthenticated, function (req, res, next) {
    async.waterfall([
      function(callback) {
        if (req.body.parent) {
          Comment.findOne({ _id: req.body.parent })
          .exec(function (err, parent) {
            if (err) {
              console.log(err)
            }
            callback(null, parent.ancestors)     
          })
        } else {
          callback(null, null)
        }
      },
      function(ancestors, callback) {
        var comment = new Comment(req.body)
        comment.author = req.user._id

        if (ancestors) {
          comment.ancestors = ancestors + '#' + comment.parent
        } else {
          comment.parent = 0
        }

        comment.save(function(err, comment) {
        })
        callback(null, comment)
      },
      function(comment, callback) {
        // save comment to thread
        Thread.findOne({ _id: comment.thread })
        .exec(function(err, thread) {
        })
        .then(function (thread) {
          thread.comments.push(comment._id)
          thread.save()
        })
        callback(null, null)
      }
    ], function(err, result) {
          res.status(200)
          return next()
       })
  })


  // Get a single thread
  router.get('/api/thread/:id', isAuthenticated, function (req, res, next) {
    threadQuery('_id', req.params.id)

    .exec(function (err, thread) {
      if (err) {
        console.log(err)
      } else {
        console.log(thread)
        res.json(thread)
      }
      return next()
    })
  })

  // return all threads the user is tagged in; (already supplied by frontpage route) 
  router.get('/api/tagged', isAuthenticated, function (req, res, next) {
    threadQuery('included', req.user.Id)
    .exec(function (err, feed) {
      if (err) {
         console.log(err)
      } else {
        //console.log(feed)
      }
    })
  })

  // return all threads the user has written
  router.get('/api/isaid', isAuthenticated, function (req, res, next) {
    threadQuery('author.real', req.username)
    .exec(function (err, feed) {
      if (err) {
        console.log(err)
      } else {
        //console.log(feed)
      }
    })
  })

  // return all threads written about the user
  router.get('/api/theysaid', isAuthenticated, function (req, res, next) {
    threadQuery('victim', req.username)
    .exec(function (err, feed) {
      if (err) {
        console.log(err)
      } else {
        //console.log(feed)
      }
    })
  })


  // Get logged-in user Object, populate feed and friends arrays, and build
  // json response. This route is designed to flexibly accomodate a url
  // parameter for feed type (authored, subject, tagged, all). Each of these parameters
  // will also have their own endpoint for maximum flexibility.

  router.get('/api/frontpage/:feedType*?', isAuthenticated, function (req, res, next) {
    console.time('feed')
    var theySaidThreads, iSaidThreads, tagged
    async.parallel([
      function(callback) {
        User.findOne({ '_id': req.user._id })
          .populate('friends')

          // populate feed and its subdocuments
          .populate({
            path: 'feed',
            populate: { path: 'comments',
                        model: 'Comment',
                        populate: { path: 'author',
                                    model: 'User',
                                    select: 'username' } }
          })
          .exec(function (err, userData) {
            if (err) {
              callback(err)
            } else {
            callback(null, userData)
            }
          })
      },
      function(callback) {
        if (req.params.feedType === 'theysaid') {
          threadQuery('victim', req.user.username)
          .exec(function (err, theySaidThreads) {
            if (err) {
              callback(err)
            } else {
              callback(null, theySaidThreads)
            }
          })
        } else {
          callback(null, null)
        }
      },
    ],
      function(err, results) {
        if (err) {
          console.log(err)
        }
        var userData = results[0].toObject()

        // will return either an array or undefined
        var theySaidThreads = results[1]

        if (req.params.feedType === 'isaid') {

          // filter out threads not authored by the user
          iSaidThreads = _.filter(userData.feed, function(thread) {
            return thread.author.real = req.user.username
          })
        }

        if (req.params.feedType === 'tagged') {

          // filter out threads authored by the user
          // (return only those he's tagged in).
          tagged = _.filter(userData.feed, function(thread) {
            return thread.author.real != req.user.username
          })
        }
        // if 'isaid' or 'theysaid' were supplied, set those threads
        // as the user's feed; else, use the users' default feed
        // (all threads he authored or was tagged in). iSaidThreads
        // and theySaidThreads will return either an array of
        // threads or an empty array.
         userData.feed = iSaidThreads || theySaidThreads || userData.feed


         // Finally, remove some of the data such as friends' passwords
         // that we don't want the client receive. Here, we replace
         // the author user object containing _id, username, and 
         // pseudonym with simply either the username or pseudonym
         // depending on whether the auther chose to remain anonymous
         // or not.

         _.each(userData.feed, function(thread) {
          if (thread.anonymous === true) {

            // If the user wrote the comment and the thread and posted
            // anonymously, show his pseudonym instead of real name when
            // commenting
            _.each(thread.comments, function(comment) {
              if (thread.author[0].id.toString() == comment.author._id.toString()) {
                comment.author.username = thread.author[0].pseudonym
              }
            })
            thread.author[0] = thread.author[0].pseudonym
          } else {
            thread.author[0] = thread.author[0].real
          }
        })
         //console.log(userData.feed)
        if (userData.feed === []) {
          userData.feed.push({text: "No threads found!",
                              _id: "no_results"})
        }
        console.timeEnd('feed')
        res.json(userData)
      }
    )
  })

  // return object of facebook friends and already added friends.
  // Both are needed to compare on client side to know if friend
  // has already been added.
  router.get('/api/importFriends', isAuthenticated, function (req, res, next) {
    async.parallel([
      // return array of user accounts based on facebook friends list
      function(callback) {
        User.findOne({'_id': req.user._id})
        .exec(function (err, user) {
          if (err) {
            callback(err)
          } else {
            var ids = _.map(user.facebookFriends, function(user) {
              return user.id
            })
            User.find({
              'facebookId': { $in: ids }
            }, function(err, users) {
              if (err) {
                callback(err)
              } else {
              callback(null, users)
              }
            })
          }
        })
      },
      // TODO: Make sure we get the friends' current facebook picture 
      // (currently not updating)
      // return already added to friends array
      function(callback) {
        User.findOne({'_id': req.user._id})
        .populate('friends')
        .exec(function (err, user) {
          if (err) {
            callback(err)
          } else {
            callback(null, user.friends)
          }
        })
      }
    ],
      function(err, results) {
        if (err) {
          console.log(err)
        }
        var data = { fbFriends: results[0], friends: results[1] }
        //console.log(data)
        return res.jsonp(data)
      }
      )
  })

  // Add facebook friend to friends list if not exists, return updated friends list
  router.post('/api/addFriend', isAuthenticated, function (req, res, next) {
    //console.log(req.body.id)
    var conditions = {
      _id: req.user.id,
      'friends': {$ne: req.body.id}
    }
    var update = {
      $addToSet: { friends: req.body.id}
    }
    User.findOneAndUpdate(conditions, update, function (err, user) {
      if (err) {
        console.log(err)
      } else {
        //console.log(user.friends)
      }
    })
  })

  router.post('/api/removeFriend', isAuthenticated, function (req, res, next) {
    //console.log(req.body.id)
    User.findByIdAndUpdate(
      req.user._id,
      {$pull: {'friends': req.body.id}},
      function (err, user) {
        if (err) {
          console.log(err)
        } else {
          //console.log(user.friends)
        }
      }
    )
  })

 
  // Get all threads; testing only
  router.get('/api/threads', function (req, res, next) {
    Thread.find(function (err, threads) {
      if (err) { return next(err); }
      //console.log(threads)
    })
  })

   // post new thread
  router.post('/api/threads', isAuthenticated, function (req, res, next) {
    console.log(req.body)

        // update user's 'last posted' field
        User.findOneAndUpdate(
          req.user._id,
          { 'lastPosted': Date.now() }, 
          function (err, user) {
            if (err) {
              console.log(err)
            }
              console.log(user.lastPosted)

        })

      // Create the new thread document and return it
      req.body.author = {}
      req.body.author.id = req.user._id
      req.body.author.real = req.user.username
      req.body.author.pseudonym = '_' + getRandomUsername()

      // turn anonymous entry into boolean
      if (req.body.anonymous === 'anonymous') {
        req.body.anonymous = true
      } else {
        req.body.anonymous = false
      }
      var thread = new Thread(req.body)
      thread.save(function (err, thread) {
        if (err) {
          console.log(err)
          return next(err)
        } else {
          res.json(thread)
        }
      })

      // Isolate ids
      var includedIds = _.map(req.body.included, function(included) {
        return included._id
      })
      // Fan out thread id to included users
      includedIds.push(req.user._id)
      User.find({
        _id: { $in: includedIds }
      }, function(err, users) {
        async.each(users, function(user, callback) {
          user.feed.push(thread._id)
          user.save()
          callback()
        })
      })
      // res.status(200)
      // return next()
  })

  // upload user photos and save to filesystem; respond with imagename
  // so the client can add it to the thread object before submitting it
  router.post('/api/image', isAuthenticated, function(req, res, next) {
    upload(req, res, function(err) {
      //console.log(req.body)
      if (err) {
        console.log(err)
        return res.end("error uploading file")
      } else {
        console.log(req.file.filename)
        res.json(req.file.filename)
      }
    })

  })


  // Return all users
  router.get('/api/users', function (req, res, next) {
  User.find(function (err, users) {
    if (err) { return next(err) }
      // res.json(users)
    //console.log(users)
    //console.log(users.length)
  })
})

  // get posts about and by a friend if they've been shared with the user
  router.get('/api/user/:friend_id', isAuthenticated, function (req, res, next) {

    async.parallel([
      function(callback) {
        Thread.find({ 'author.id': req.params.friend_id, 'included.id':  req.user._id })
        // User.findOne({ _id: req.params.friend_id })
        // .populate('feed')
        .exec(function(err, threads) {
          callback(null, threads)
        })
      },
      function(callback) {
        Thread.find({ victim: req.params.friend_id })
        .populate('included')
        .exec(function(threads) {
          callback(null, threads)
        })
      }
    ],
    function(err, results) {
      if (err) {
        throw(err)
      }
      var by = results[0] || []
      var about = results[1] || []
      var threads = by.concat(about)
      // var data =  _.filter(threads, function(thread) {
      //   _.each(thread.included, function(included) {
      //     if (included.id == req.user._id) {
      //       return true
      //     }
      //   })
      // })
      res.json(threads)
    }
    )
  })


  // Voting

  // for each of these routes, the user id is allowed in only
  // one of either array: if the user likes, be sure he isn't
  // also counted as a disliker, etc. 

  router.post('/api/upvote/thread/:id', isAuthenticated, function (req, res, next) {
    var id = req.user._id
    Thread.findOne({ '_id': req.params.id }, 
      function (err, thread) {
        if (isInArray(id, thread.proShitters)) {
          thread.proShitters.pull(id)
        } else {
          if (isInArray(id, thread.proShittees))
            thread.proShittees.pull(id)
            thread.proShitters.push(id)
        }
        thread.likes = thread.getLikesCount()
        thread.save(function (err, thread) {
          res.json(thread.getLikesCount())
        })
      }
    )
  })

  router.post('/api/downvote/thread/:id', isAuthenticated, function (req, res, next) {
    var id = req.user._id
    Thread.findOne({ '_id': req.params.id }, 
      function (err, thread) {
        if (isInArray(id, thread.proShittees)) {
          thread.proShittees.pull(id)
        } else {
          if (isInArray(id, thread.proShitters))
            thread.proShitters.pull(id)
            thread.proShittees.push(id)
        }
        thread.likes = thread.getLikesCount()
        thread.save(function (err, thread) {
          res.json(thread.getLikesCount())
        })
      }
    )
  })

  router.post('/api/upvote/comment/:id', isAuthenticated, function (req, res, next) {
    var id = req.user._id
    Comment.findOne({ '_id': req.params.id }, 
      function (err, comment) {
        if (isInArray(id, comment.proShitters)) {
          comment.proShitters.pull(id)
        } else {
          if (isInArray(id, comment.proShittees))
            comment.proShittees.pull(id)
            comment.proShitters.push(id)
        }
        comment.likes = comment.getLikesCount()
        comment.save(function (err, comment) {
          console.log(comment)
          res.json(comment.likes)
        })
      }
    )
  })

  router.post('/api/downvote/comment/:id', isAuthenticated, function (req, res, next) {
    var id = req.user._id
    Comment.findOne({ '_id': req.params.id }, 
      function (err, comment) {
        if (isInArray(id, comment.proShittees)) {
          comment.proShittees.pull(id)
        } else {
          if (isInArray(id, comment.proShitters))
            comment.proShitters.pull(id)
            comment.proShittees.push(id)
        }
        comment.likes = comment.getLikesCount()
        comment.save(function (err, comment) {
          console.log(comment)
          res.json(comment.likes)
        })
      }
    )
  })
  return router
}
