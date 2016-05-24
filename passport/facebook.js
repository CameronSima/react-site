var FaceBookStrategy = require('passport-facebook').Strategy
var mongoose = require('mongoose')
var User = mongoose.model('User')
var config = require('../config')

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user._id)
  })

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user)
    })
  })

  passport.use(new FaceBookStrategy({
    clientID:          config.auth.facebookAuth.clientID,
    clientSecret:      config.auth.facebookAuth.clientSecret,
    callbackURL:       config.auth.facebookAuth.callbackURL,
    scope:             ['public_profile', 'email', 'user_friends'],
    profileFields:     ['id', 'displayName', 'email', 'friends']
  },

  // facebook sends back token and profile
  function (token, refreshToken, profile, done) {
    
    // async
    process.nextTick(function () {
      User.findOne({ 'facebook.id': profile.id }, function (err, user) {
        if (err)
          return done(err);
        if (user) {
          return done(null, user)
        } else {
          var newUser = new User()
          newUser.facebook.id = profile.id
          newUser.facebook.token = token
          newUser.facebook.name = profile.displayName
          if (profile.emails) {
            newUser.facebook.email = profile.emails[0].value
          }
          newUser.facebook.friends = profile._json.friends.data 
          newUser.save(function (err) {
            if (err)
              throw err
            return done(null, newUser)
          })
        }
      })
    })
  }
  ))
}