var LocalStrategy = require('passport').Strategy
var User = require('../models/User')
var bCrypt = require('bcrypt')

module.exports = function (passport) {
  passport.use('signup', new LocalStrategy({
    passReqToCallback: true
  },
  function (req, username, password, done) {
    findOrCreateUser = function () {
      User.findOne({ username: username }, function (err, user) {
        if (err)
          console.log('Signup error ' + err)
          return done(err)
        if (user)
          return done(null, false)
        else
          var newUser = new User()
          newUser.username = username
          newUser.password = newUser.setPassword(password)
          newUser.save(function (err) {
            if (err)
              console.log("Error in saving User")
              throw err
            console.log("User registration successful")
            return done(null, newUser)
          })
      })  
    }
    process.nextTick(findOrCreateUser)
  }
  ))
}
