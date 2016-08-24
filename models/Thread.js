var mongoose = require('mongoose')

var ThreadSchema = new mongoose.Schema({
  text: String, 
  date: { type: Date, default: Date.now }, 
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  proShitters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', 
                  unique: true,  dropDups: true 
                }],
  proShittees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',
                  unique: true, dropDups: true 
                }],
  likes: Number,
  // For testing purposes, use simple Strings 
  // author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // victim: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // included: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // author: String,
  author: [{
    real: String,
    pseudonym: String
  }],
  anonymous: Boolean,
  victim: String,
  included: [{
    id: String,
    name: String
  }]
})

ThreadSchema.methods.getLikesCount = function() {
  return this.proShitters.length - this.proShittees.length

}

module.exports = mongoose.model('Thread', ThreadSchema)
