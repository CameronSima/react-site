var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var fs = require('fs')
var path = require('path')

var Comment = mongoose.model('Comment')
var Thread = mongoose.model('Thread')
var User = mongoose.model('User')

module.exports = function (passport) {
  // Additional middleware which will set headers that we need on each request.
  router.use(function (req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*')
    // res.setHeader('Content-Type', 'json')

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache')
    next()
  })

  var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    // console.log("LOGGED IN")
    return next()
  } else {
    // console.log("NOT LOGGED IN")
    res.redirect('/api/auth/facebook')
  }
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
        // that the client shouldn't recieve about his friends,
        // but for now just pass the whole fully-populated user object
        res.jsonp(userData)

      }
    })
  })

  // get logged in users' feed array, and return threads 
  router.get('/api/feed', isAuthenticated, function (req, res, next) {
    User.findOne({'_id': req.user._id }, function (err, user) {
      // To do: use populate() to return the whole user
      // object along with threads and friends, instead of just 
      // the threads
      Thread.find({
        '_id': { $in: user.feed }
      }).sort('-date').exec(function (err, threads) {
          console.log(threads)
          res.jsonp(threads)
      })
    })
  })
 
  // Get all threads; testing only
  router.get('/api/threads', function (req, res, next) {
    Thread.find(function (err, threads) {
      if (err) { return next(err); }
      res.json(threads)
    })
  })

  router.post('/api/threads', isAuthenticated, function (req, res, next) {
    console.log(req.body)
    var includedArr = req.body.included.split(', ')

    // Fan out thread id to included users
    process.nextTick(function () {
      User.update({ _id: {$in: includedArr}},
        { active: false },
        { multi: true },
        {$push: {'feed': req.body._id},
        function (err, data) {
          if (err) {
            console.log(err)
          }
        }})
    })

    // Create the new thread document and return it
    req.body.author = req.user.username
    var thread = new Thread(req.body)
    console.log(thread)
    thread.save(function (err, thread) {
      if (err) {
        console.log(err)
        return next(err)
      }
      res.json(thread)

    })
})

  // Return all users
  router.get('/api/users', function (req, res, next) {
  User.find(function (err, users) {
    if (err) { return next(err) }
      res.json(users)
  })
})
  return router
}
