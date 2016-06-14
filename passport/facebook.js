var FaceBookStrategy = require('passport-facebook').Strategy
var mongoose = require('mongoose')
var User = mongoose.model('User')
var config = require('../config')

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
    profileFields:     ['id', 'displayName', 'email', 'friends']
  },

  // facebook sends back token and profile
  function (token, refreshToken, profile, done) {
    // async
    process.nextTick(function () {
      User.findOne({ 'facebookId': profile.id }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (user) {

          // Update users' friends list
          var newFriendsList = user.facebookFriends.concat(
            profile._json.friends.data.filter(function(friend) {
              return user.facebookFriends.indexOf(friend) === -1
              console.log(friend)
            })
          )
          console.log(newFriendsList)
          user.facebookFriends = newFriendsList
          user.save(function(err) {
            if (err) {
              console.log(err)
            }
          })
          console.log(user.facebookFriends)

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
