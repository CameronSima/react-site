var FaceBookStrategy = require('passport-facebook').Strategy
var mongoose = require('mongoose')
var User = mongoose.model('User')
var config = require('../config')

var request = require('request')

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id)
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
    profileFields:     ['id', 'displayName', 'email', 'friends', 'photos']
  },

  // facebook sends back token and profile
  function (token, refreshToken, profile, done) {
    setImmediate(function () {
      User.findOne(
        { 'facebookId': profile.id }, 
      function (err, user) {
        if (err) {
          return done(err);
        }
        if (user) {

          // Update users' friends list with new facebook friends

          if (user.facebookFriends.length < profile._json.friends.data.length) {
            user.facebookFriends = profile._json.friends.data
            user.save(function(err) {
              if (err) {
                console.log(err)
              }
            })
          }
          return done(null, user)
        } else {
          var newUser = new User()
          newUser.username = profile.displayName
          newUser.facebookId = profile.id
          newUser.facebookToken = token
          newUser.facebookName = profile.displayName
          if (profile.emails) {
            newUser.facebookEmail = profile.emails[0].value
          }
          newUser.facebookFriends = profile._json.friends.data
          newUser.facebookProfilePic = profile._json.picture.data.url
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
