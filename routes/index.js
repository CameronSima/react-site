var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var fs = require('fs')
var path = require('path')
var moniker = require('moniker')
var async = require('async')

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
    console.log('authenticated')
    return next()
  } else {
    console.log('not authenticated')
    //res.redirect('http://localhost:3001/signup')
  }
}

var hasntVoted = function (user, array) {
  console.log(array.length)
  console.log('************')
  console.log(array)
  console.log(user._id)

  if (array.indexOf(user._id) === -1) {
    console.log('hast voted')
    return true
  } else {
    return false
  }
  
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
// routes

  router.post('/api/login', function (req, res, next) {
    passport.authenticate('login', function (err, user, info) {
      if (err)
        return res.json(err)
      if (!user)
        return
      res.json(user)
    })(req, res, next)
  })

  router.get('/api/logout', function (req, res) {
    req.logout()
    res.redirect('/')
  })

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

  // Get all comments, testing only
  router.get('/api/comments', function (req, res, next) {
    Comment.find(function (err, posts) {
      if (err) { return next(err); }
        res.json(posts)
    })
  })

  router.post('/api/comments', function (req, res, next) {
    var comment = new Comment(req.body)
    //console.log(comment)
    comment.save(function (err, post) {
      if (err) { return next(err); }
      res.json(comment)
    })
  })

  // Get a single thread
  router.get('/api/thread', function (req, res, next) {
    req.body.populate('comments', function (err, post) {
      if (err) {
        return next(err);
      }
      res.json(post)
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

  // Get logged-in user's User object, populate feed and friends fields,
  // and build json response
  // router.get('/api/frontpage:feedType*?', isAuthenticated, function (req, res, next) {
  //   console.log(req.params.feedType)
  //   User
  //   .findOne({ '_id': req.user._id })
  //   .populate('feed')
  //   .populate('friends')
  //   .exec(function (err, userData) {
  //     console.log(userData.username)
  //     if (err) {
  //       console.log(err)
  //     } else {

  //       // change content of feed depending on user selection (written by, written about)
  //       if (req.params.feedType === 'isaid') {

  //         //filter out threads not authored by the user; a db call is not required
  //         var _isaid = userData.feed.filter(function(thread) {
  //           return thread.author.real = req.user.username
  //         })
  //         userData.feed = _isaid
  //       } else if (req.params.feedType === 'theysaid') {

  //         // get threads where the user is the victim from db; they're not 
  //         // included in a user document
  //         threadQuery('victim', req.username)
  //         .exec(function (err, theySaid) {
  //           if (err) {
  //             console.log(err)
  //           } else {
  //             userData.feed = theySaid
  //           }
  //         })
  //       }

  //       // remove some of the data, such as passwords, etc.
  //       // that the client shouldn't recieve about his friends;
  //       // here we replace the author user object containing _id,
  //       // real username, and pseudonym, with simply either the username
  //       // or pseudonym, depending on whether the author chose to remain
  //       // anonymous or not. This is done to prevent users from seeing
  //       // authors' real identity by using tools such as Firebug, etc.

  //       userData.feed.forEach((thread) => {
  //         if (thread.anonymous === true) {
  //           thread.author[0] = thread.author[0].pseudonym
  //         } else {
  //           thread.author[0] = thread.author[0].real
  //         }
  //       })
  //       res.jsonp(userData)
  //     }
  //   })
  // })

  // Get logged-in user Object, populate feed and friends arrays, and build
  // json response. This route is designed to flexibly accomodate a url
  // parameter for feed type (authored, subject, all). Each of these parameters
  // will also have their own endpoint for maximum flexibility.

  router.get('/api/frontpage/:feedType*?', isAuthenticated, function (req, res, next) {

    var theySaidThreads, iSaidThreads

    console.log(req.params.feedType)

    async.parallel([
      function(callback) {
        User.findOne({ '_id': req.user._id })
          .populate('feed')
          .populate('friends')
          .exec(function (err, userData) {
            if (err) {
              callback(err)
            } else {
            console.log("user found" + userData.username)
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
        var userData = results[0]

        // will return either an array or undefined
        var theySaidThreads = results[1]

        if (req.params.feedType === 'isaid') {
          // filter out threads not authored by the user
          iSaidThreads = userData.feed.filter(function (thread) {
            return thread.author.real = req.user.username
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
         userData.feed.forEach(function(thread) {
          if (thread.anonymous === true) {
            thread.author[0] = thread.author[0].pseudonym
          } else {
            thread.author[0] = thread.author[0].real
          }
        })
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
            var ids = user.facebookFriends.map(function(user) {
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

      // Create the new thread document and return it
      req.body.author = {}
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
        }
      })

      // Isolate ids
      var includedIds = req.body.included.map(function (included) {
        return included.id
      })
      // Fan out thread id to included users
      includedIds.push(req.user.facebookId)
      User.find({
        'facebookId': {$in: includedIds}
      }, function(err, users) {
        users.forEach((user) => {
          user.feed.push(thread._id)
          user.save((err, user) => {
            if (err) {
              console.log(err)
            }
          })
        })
      })
      return next()
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

   router.post('/api/upvote', isAuthenticated, function (req, res, next) {
      Thread.findOne({
        _id: req.body.thread_id},
        function(err, thread) {
          if (hasntVoted(req.user, thread.proShitters)) {
          thread.proShitters.push(req.user._id)
          var index = thread.proShittees.indexOf(req.user._id)
          thread.proShittees.splice(index, 1)
          thread.likes += 1
          thread.save((err, thread) => {
            if (err) {
              console.log(err)
            }
          })
        } else {
          return
        }
      })
  })


  router.post('/api/downvote', isAuthenticated, function (req, res, next) {
      Thread.findOne({
        _id: req.body.thread_id},
        function(err, thread) {
          if (hasntVoted(req.user, thread.proShittees)) {
          thread.proShittees.push(req.user._id)
          var index = thread.proShitters.indexOf(req.user._id)
          thread.proShitters.splice(index, 1)
          thread.dislikes += 1
          thread.save((err, thread) => {
            if (err) {
              console.log(err)
            }
          })
        } else {
          return
        }
      })
  })

  return router
}