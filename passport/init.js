var mongoose = require('mongoose')

var login = require('./login')
var signup = require('./signup')
var facebook = require('./facebook')
var User = mongoose.model('User')

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user._id)
  }) 

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user)
    })
  })
  login(passport)
  signup(passport)
  facebook(passport)
}