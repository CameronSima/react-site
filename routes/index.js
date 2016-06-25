var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var fs = require('fs')
var path = require('path')
var moniker = require('moniker')

var Comment = mongoose.model('Comment')
var Thread = mongoose.model('Thread')
var User = mongoose.model('User')

module.exports = function (passport) {
  // Additional middleware which will set headers that we need on each request.
  router.use(function (req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.header('Content-Type', 'json')
    res.header('Access-Control-Allow-Credentials', true)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache')
    next()
  })

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
  console.log(user._id)
  console.log('************')
  console.log(array)
  if (array.indexOf(user._id.toString()) === -1) {
    console.log('hast voted')
    return true
  } else {
    return false
  }
  
}

var getRandomUsername = function () {
  return moniker.choose().split('-').join(' ')
}

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
    console.log(comment)
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

  // Get logged-in user's User object, populate feed and friends fields,
  // and build json response
  router.get('/api/frontpage', isAuthenticated, function (req, res, next) {
    User
    .findOne({ '_id': req.user._id })
    .populate('feed')
    .populate('friends')
    .exec(function (err, userData) {
      if (err) {
        console.log(err)
      } else {
        // remove some of the data, such as passwords, etc.
        // that the client shouldn't recieve about his friends;
        // here we replace the author user object containing _id,
        // real username, and pseudonym, with simply either the username
        // or pseudonym, depending on whether the author chose to remain
        // anonymous or not. This is done to prevent users from seeing
        // authors' real identity by using tools such as Firebug, etc.

        userData.feed.forEach((thread) => {
          if (thread.anonymous === true) {
            thread.author[0] = thread.author[0].pseudonym
          } else {
            thread.author[0] = thread.author[0].real
          }
        })
        res.jsonp(userData)

      }
    })
  })

  // get list of all facebook friends so users can import them
  // into their friends list
  router.get('/api/importFriends', isAuthenticated, function (req, res, next) {
    User
    .findOne({'_id': req.user._id})
    .exec(function (err, user) {
      if (err) {
        console.log(err)
      } else {
        // console.log(user.facebookFriends)
        // console.log(typeof user.facebookFriends)
        res.jsonp(user.facebookFriends)
      }
    })
  })

  // Add facebook friend to friends list, return updated friends list
  router.post('/api/importFriends', isAuthenticated, function (req, res, next) {
    User.findOne({'facebookId': req.body.facebookId})
    .exec(function (err, facebookFriend) {
      if (err) {
        console.log(err)
      } else {
        var facebookFriendUserId = facebookFriend._id
      }
    })
    User.findByIdAndUpdate(
      req.user._id,
      {$push: {'friends': facebookFriendUserId}},
      {safe: true, upsert: true, new: true},
      function (err, user) {
        console.log(err)
        res.json(user.friends)
      })
  })

 
  // Get all threads; testing only
  router.get('/api/threads', function (req, res, next) {
    Thread.find(function (err, threads) {
      if (err) { return next(err); }
      console.log(threads)
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
      // Fan out thread id to included users
      req.body.included.push(req.user.facebookId)
      User.find({
        'facebookId': {$in: req.body.included}
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
    console.log(users)
  })
})

  router.post('/api/upvote', isAuthenticated, function (req, res, next) {
      Thread.findOne({
        _id: req.body.thread_id},
        function(err, thread) {
          if (hasntVoted(req.user, thread.proShitters)) {
          thread.proShitters.push(req.body.thread_id)
          thread.likes = thread.likes + 1
          thread.save((err, thread) => {
            if (err) {
              console.log(err)
            }
          })
        } else {
          return next()
        }
      }) 
  })

  router.post('/api/downvote', isAuthenticated, function (req, res, next) {
      Thread.findOne({
        _id: req.body.thread_id},
        function(err, thread) {
          if (hasntVoted(req.user, thread.proShittees)) {
          thread.proShittees.push(req.body.thread_id)
          thread.dislikes = thread.dislikes + 1
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