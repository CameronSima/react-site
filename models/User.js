var mongoose = require('mongoose')
var bCrypt = require('bcrypt')
// var jwt = require('jsonwebtoken')

var UserSchema = new mongoose.Schema({
  username: { type: String, lowercase: true, unique: true },
  password: String,
  friends: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // used for 'History' page
  threadsParticipatedIn: { type: mongoose.Schema.ObjectId, ref: 'Thread' },
  // An array of Thread Ids
  feed: [ String ]
})

UserSchema.methods.setPassword = function (password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}

UserSchema.methods.validPassword = function (password) {
  var saltedHash = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
  return this.password === saltedHash
}

mongoose.model('User', UserSchema)
