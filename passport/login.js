var LocalStrategy = require('passport-local').Strategy
var User = require('../models/User')
var bCrypt = require('bcryptjs')

module.exports = function(passport) {
  passport.use('login', new LocalStrategy({
    passReqToCallback: true
  },
  function(req, username, password, done) {
    User.findOne({ 'username': username },
      function (err, user) {
        if (err)
          return done(err)
        if (!user)
          console.log('No user: ' + username + 'found')
          return done(null, false)
        if (!isValidPassword(user, password)) {
          console.log('Password ' + password + 'is invalid')
          return done(null, false)
        }
        return done(null, user)
      })
  }))
  var isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password)
  }
}