var mongoose = require('mongoose')
var bCrypt = require('bcryptjs')
// var jwt = require('jsonwebtoken')

var UserSchema = new mongoose.Schema({
  username: { type: String, lowercase: true, unique: true },
  password: String,
  friends: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // used for 'History' page
  threadsParticipatedIn: { type: mongoose.Schema.ObjectId, ref: 'Thread' },

  // An array of Thread Ids
  feed: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Thread'} ],

  // Facebook login info
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
    friends: [ String ]
  }
})

UserSchema.methods.setPassword = function (password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}

UserSchema.methods.validPassword = function (password) {
  var saltedHash = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
  return this.password === saltedHash
}

module.exports = mongoose.model('User', UserSchema)
