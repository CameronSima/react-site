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
var Notification = mongoose.model('Notification')


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
      return next()
    } else {
      res.json('not logged in')
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

    // If the user wrote the comment and/or the thread and posted
    // anonymously, show his pseudonym instead of real name when
    // commenting. Also, add a 'byMe' field if the user is the
    // author to allow delete and edit actions.


  var anonymize = function(threads, user_id) {
    _.each(threads, function(thread) {
      if (thread.author[0].id.toString() == user_id) {

        thread.byMe = true
      } else {
        thread.byMe = false
      }
      if (thread.anonymous === true) {

        _.each(thread.comments, function(comment) {
          if (comment.author._id.toString() == user_id) {
            comment.byMe = true
          }
          if (thread.author[0].id.toString() == comment.author._id.toString()) {
            comment.author.username = thread.author[0].pseudonym
          }
        })
        thread.author[0] = thread.author[0].pseudonym
      } else {
        thread.author[0] = thread.author[0].real
      }
    })
  }

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

  // router.post('/api/signup', function (req, res, next) {
  //   passport.authenticate('signup', function (err, user, info) {
  //     if (err) {
  //       return res.json(err)
  //     }
  //     if (!user) {
  //       return
  //     }
  //     res.json(user)
  //   })(req, res, next)
  // })

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

  // post new comment
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
        //console.log(comment)

        comment.save(function(err, comment) {
        })
        callback(null, comment)
      },
      function(comment, callback) {
        // save comment to thread
        Thread.findOne({ _id: comment.thread })
        .exec(function(err, thread) {
        })
        // push comment to thread object, save the thread, then
        // return, populate and send it back to client to add to
        // feed.
        .then(function (thread) {
          thread.comments.push(comment._id)
          thread.save(function(err, updated) {
            if (err) {
              console.log(err)
            } else {
              updated.populate({
                path: 'comments',
                model: 'Comment',
                populate: { path: 'author',
                            model: 'User',
                            select: 'username' }
              }, function(err, populated) {
                if (err) {
                  console.log(err)
                } else {
                  callback(null, updated)
                }
              })
            }
          })
        })
      }
    ], function(err, result) {
        anonymize([result], req.user._id)
          res.json(result)
          
       })
  })


  // Get a single thread
  router.get('/api/thread/:id', isAuthenticated, function (req, res, next) {
    threadQuery('_id', req.params.id)

    .exec(function (err, thread) {
      if (err) {
        console.log(err)
      } else {
        //console.log(thread)
        res.json(thread)
      }
      return next()
    })
  })

  // get a particular thread from a supplied array. Also
  // update notification
  router.get('/api/threads/:id/:notifId', isAuthenticated, function (req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.notifId)
    console.log('get threads endpoint called')
    Notification.findOne({
      $and: [
        { _id: id },
        { 'user': req.user._id }
      ]
    })
    .exec(function(err, notification) {
      if (err) {
        console.log(err)
      }
      console.log(notification)
      notification.new = false
      notification.save(function(err, notif) {
        if (err) {
          console.log(err)
        }
        console.log(notif)
      })
     })

    Thread.find({
      $and: [
        { _id: { $in: req.params.id } },
        { 'included.id': req.user._id }
      ]
    })
    .populate({
      path: 'comments',
      model: 'Comment',
      populate: { path: 'author',
                  model: 'User',
                  select: 'username' }
    })
    .exec(function(err, threads) {
      anonymize(threads, req.user._id)
      res.json(threads)
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

  // get user's notifications
  router.get('/api/notifications/:numNotifs*?', isAuthenticated, function(req, res, next) {
    var limit = req.params.numNotifs || 15
    Notification.find({
      user: req.user._id
    })
    .sort({'date': -1})
    .limit(limit)
    .exec(function(err, notifications) {
      //console.log(notifications)
      res.json(notifications)
    })
  })

  router.get('/api/frontpage/:feedType/:limit*?', isAuthenticated, function (req, res, next) {
    console.time('feed')
    var numThreads = req.params.limit || 5
    var theySaidThreads, iSaidThreads, tagged
    async.parallel([
      function(callback) {
        Thread.find({ 
          $and: [
            { 'included.id': req.user._id },
            { 'deleted': false }]
        })
        .sort({ 'date': -1 })
        .limit(numThreads)
        .populate({
          path: 'comments',
          model: 'Comment',
          populate: { path: 'author',
                      model: 'User',
                      select: 'username' }
        })
        .exec(function(err, feed) {
          //anonymize(feed, req.user._id)
          callback(null, feed)
        })
      },
      function(callback) {
        User.findOne({ '_id': req.user._id })
          .populate({
            path: 'friends',
            model: 'User',
            select: '_id facebookName facebookProfilePic username'
          })
          .exec(function(err, friends) {
            callback(null, friends)
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
      var feed = results[0]
      var user = results[1]

      // will return either an array or undefined
      var theySaidThreads = results[2]

      if (req.params.feedType === 'isaid') {

        // filter out threads not authored by the user
        iSaidThreads = _.filter(feed, function(thread) {
          return thread.author.real = req.user.username
        })
      }

      if (req.params.feedType === 'tagged') {

        // filter out threads authored by the user
        // (return only those he's tagged in).
        tagged = _.filter(feed, function(thread) {
          return thread.author.real != req.user.username
        })
      }
      // if 'isaid' or 'theysaid' were supplied, set those threads
      // as the user's feed; else, use the users' default feed
      // (all threads he authored or was tagged in). iSaidThreads
      // and theySaidThreads will return either an array of
      // threads or an empty array.
       feed = iSaidThreads || theySaidThreads || feed

       user.feed = feed
       userObj = user.toObject()
       anonymize(userObj.feed, req.user._id)

      if (feed === []) {
        feed.push({text: "No threads found!",
                            _id: "no_results"})
      }
      res.json(userObj)
    })
  })

  // Get logged-in user Object, populate feed and friends arrays, and build
  // json response. This route is designed to flexibly accomodate a url
  // parameter for feed type (authored, subject, tagged, all). Each of these parameters
  // will also have their own endpoint for maximum flexibility.

  // router.get('/api/frontpage/:feedType/:limit*?', isAuthenticated, function (req, res, next) {
    
  //   console.time('feed')
  //   var theySaidThreads, iSaidThreads, tagged
  //   async.parallel([
  //     function(callback) {
  //       User.findOne({ '_id': req.user._id })
  //         .populate({
  //           path: 'friends',
  //           model: 'User',
  //           select: '_id facebookName facebookProfilePic username'
  //         })

  //         // populate feed and its subdocuments
  //         .populate({
  //           path: 'feed',
  //           model: 'Thread',
  //           populate: { path: 'comments',
  //                       model: 'Comment',
  //                       populate: { path: 'author',
  //                                   model: 'User',
  //                                   select: 'username' }}
  //         })
  //         .exec(function (err, userData) {
  //           if (err) {
  //             callback(err)
  //           } else {
  //             console.log(userData)
  //           callback(null, userData)
  //           }
  //         })
  //     },
  //     function(callback) {
  //       if (req.params.feedType === 'theysaid') {
  //         threadQuery('victim', req.user.username)
  //         .exec(function (err, theySaidThreads) {
  //           if (err) {
  //             callback(err)
  //           } else {
  //             callback(null, theySaidThreads)
  //           }
  //         })
  //       } else {
  //         callback(null, null)
  //       }
  //     },
  //   ],
  //     function(err, results) {
  //       if (err) {
  //         console.log(err)
  //       }
  //       var userData = results[0].toObject()

  //       // will return either an array or undefined
  //       var theySaidThreads = results[1]

  //       if (req.params.feedType === 'isaid') {

  //         // filter out threads not authored by the user
  //         iSaidThreads = _.filter(userData.feed, function(thread) {
  //           return thread.author.real = req.user.username
  //         })
  //       }

  //       if (req.params.feedType === 'tagged') {

  //         // filter out threads authored by the user
  //         // (return only those he's tagged in).
  //         tagged = _.filter(userData.feed, function(thread) {
  //           return thread.author.real != req.user.username
  //         })
  //       }
  //       // if 'isaid' or 'theysaid' were supplied, set those threads
  //       // as the user's feed; else, use the users' default feed
  //       // (all threads he authored or was tagged in). iSaidThreads
  //       // and theySaidThreads will return either an array of
  //       // threads or an empty array.
  //        userData.feed = iSaidThreads || theySaidThreads || userData.feed

  //        anonymize(userData.feed, req.user._id)

  //       if (userData.feed === []) {
  //         userData.feed.push({text: "No threads found!",
  //                             _id: "no_results"})
  //       }
  //       console.timeEnd('feed')
  //       res.json(userData)
  //     }
  //   )
  // })

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

      // update user's 'last posted' field
      User.findOneAndUpdate(
        req.user._id,
        { 'lastPosted': Date.now() }, 
        function (err, user) {
          if (err) {
            console.log(err)
          }
      })

      // Create the new thread document and return it
      req.body.author = {
        id: req.user._id,
        real: req.user.username,
        pseudonym: '_' + getRandomUsername(),
      }

      // add user's id before saving the thread so it's added
      // to his feed (looks like a duplicate of line 667 below
      // which adds it for testing purposes so user gets notifications
      // of his own submission)
      req.body.included.push(req.user._id)

      // turn anonymous entry into boolean
      if (req.body.anonymous === 'anonymous') {
        req.body.anonymous = true
      } else {
        req.body.anonymous = false
      }
      var thread = new Thread(req.body)
      thread.save(function (err, doc) {
        if (err) {
          console.log(err)
          return next(err)
        } else {
          // save 'Tagged' notification.
          // for testing, push to user
          //req.body.included.push({ id: req.user._id, name: 'Cameron Sima' })

          var notification = new Notification()
          console.log(req.body.included)

          async.each(req.body.included, function(user) {
            var authored = doc.author.id == user.id
            var notification = new Notification()
            notification.user = user.id
            notification.threadId = thread._id
            notification.getTextandType(req.body.author.real, authored)
            notification.save(function(err, not) {
              console.log('notification saved')
              console.log(not)
            })
          })
        }
        anonymize([doc], req.user._id)
        res.json(doc)
      })
  })

  // mark a thread deleted
  router.post('/api/threads/delete/:id', isAuthenticated, function(req, res, next) {
    Thread.findOneAndUpdate({
      $and: [
        { _id: req.params.id },
        { 'author.id': req.user._id }]
    },
      { deleted: true }
    )
    .exec(function(err, thread) {
      if (err) { 
        console.log(err) 
      } else {
        //console.log(thread)
        res.sendStatus(200)
      }  
    })
  })


  // upload user photos and save to filesystem; respond with imagename
  // so the client can add it to the thread object before submitting it
  router.post('/api/image', isAuthenticated, function(req, res, next) {
    upload(req, res, function(err) {
      if (err) {
        console.log(err)
        return res.end("error uploading file")
      } else {
        //console.log(req.file.filename)
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

  // get posts about or and by a friend if they've been shared with the user.
  // Exclude threads marked anonymous. Return 25 results if no limit has
  // been supplied.
  router.get('/api/user/by/:friend_id/:limit*?', isAuthenticated, function (req, res, next) {
    console.log('BY' + req.params.friend_id)
    var numThreads = ~~req.params.limit || 25
    Thread.find({
      $and: [
        { 'author.id': req.params.friend_id },
        { 'included.id': req.user._id },
        { 'anonymous': false }
      ]
    })
    .populate({
      path: 'comments',
      populate: { path: 'author',
                  model: 'User',
                  select: 'username' }

    })
    .limit(numThreads)
    .exec(function(err, threads) {
      if (err) {
        console.log(err)
      } else {
        anonymize(threads, req.user._id)
      res.json(threads)
      }
    })
  })

  router.get('/api/user/about/:friend_id/:limit*?', isAuthenticated, function (req, res, next) {
    var numThreads = ~~req.params.limit || 25
    Thread.find({
      $and: [
        { 'victim': req.params.friend_id },
        { 'included.id': req.user._id }
      ]
    })
    .limit(numThreads)
    .exec(function(err, threads) {
      if (err) {
        throw(err)
      } else {
        anonymize(threads, req.user._id)
      res.json(threads)
      }
    })
  })

  // return threads the specified user has commented on
  router.get('/api/user/talked/:friend_id/:limit*?', isAuthenticated, function (req, res, next) {
    var numThreads = ~~req.params.limit || 25
    Thread.find({
      $and: [
        { 'included.id': req.params.friend_id },
        { 'included.id': req.user._id },
        { 'anonymous': false }
      ]
    })
    .limit(numThreads)
    .populate({
      path: 'comments',
      model: 'Comment',
      select: 'author'
    })
    .exec(function(err, threads) {
      if (err) {
        throw(err)
      } else {
        
        // filter out threads the user hasn't commented on
        var response = _.filter(threads, function(thread) {
          _.each(thread.comments, function(comment) {
            return comment.author.toString() == req.params.friend_id
          })
        })
      }
      anonymize(response, req.user._id)
      res.json(response)
    })
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
          res.json(comment.likes)
        })
      }
    )
  })
  return router
}
