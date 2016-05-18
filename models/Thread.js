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
  author: String,
  victim: String,
  included: [String],
  ct: String 
})

mongoose.model('Thread', ThreadSchema)
