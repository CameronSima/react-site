var mongoose = require('mongoose')

var ThreadSchema = new mongoose.Schema({
  text: String,
  date: { type: Date, default: Date.now },
  
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  // track those who are for or against the thread author or its 'victim'
  proShitters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  proShittees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
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
  included: [String],
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
})

module.exports = mongoose.model('Thread', ThreadSchema)
