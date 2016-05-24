var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var fs = require('fs')
var path = require('path')

var Comment = mongoose.model('Comment')
var Thread = mongoose.model('Thread')
var User = mongoose.model('User')

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next()
  res.redirect('/')
}

module.exports = function (passport) {
  // Additional middleware which will set headers that we need on each request.
  router.use(function (req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*')

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache')
    next()
  })

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

  router.get('/api/auth/facebook', 
    passport.authenticate('facebook', { authType: 'rerequest' }),
    router.get('/api/auth/facebook/callback',
      passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/'
      }))
    )

  // add thread ids to user 
  router.get('/addthread/:threadid/:userid', function (req, res, next) {
    console.log(req.params.threadid)
    console.log(req.params.userid)
    User.findOne({ '_id': req.params.userid }, function (err, user) {
      user.feed.push(req.params.threadid)
      user.save(function (err) {
        if (err) {
          console.log(err)
        }
      })
    })
  })

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

  router.get('/api/feed/:id', function (req, res, next) {

    // Find the user object using the id passed in from the url,
    // get its feed array, and return threads 
    var userId = req.params.id
    User.findOne({'_id': userId}, function (err, user) {
      Thread.find({
        '_id': { $in: user.feed }
      }).sort('-date').exec(function (err, threads) {
          console.log(threads)
          res.json(threads)
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

  router.post('/api/threads', function (req, res, next) {
    
    // For now, turn CSV data into javascript array
    var includedArr = req.body.included.split(', ')
    req.body.included = includedArr

    // Fan out thread id to tagged users 
    process.NextTick(function () {
      User.find({
      'username': { $in: includedArr }
      }, function(err, users) {
           forEach(users, function (user) {
            user.feed.push(req.body._id)
            user.save(function (err) {
              if (err)
                throw err
            })
          })
        })
      })


    var thread = new Thread(req.body)
    console.log(thread)
    thread.save(function (err, thread) {
      if (err) { return next(err); }
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
