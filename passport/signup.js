var LocalStrategy = require('passport-local').Strategy
var mongoose = require('mongoose')
var User = mongoose.model('User')
var bCrypt = require('bcrypt')

module.exports = function(passport){

  passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                User.findOne({'username':  username}, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log("User " + username + " already exists")
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();
                        newUser.username = username;
                        newUser.setPassword(password);
                        console.log(newUser.password)
                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+err);  
                                throw err;  
                            }
                            console.log('User Registration succesful');    
                            return done(null, newUser);
                        });
                    }
                });
            };
            process.nextTick(findOrCreateUser);
        })
    );
  }
