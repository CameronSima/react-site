var mongoose = require('mongoose')

var CommentSchema = new mongoose.Schema({
  thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
  date: { type: Date, default: Date.now },
  text: String,
  likes: Number,
  dislikes: Number,
  // For now, just use a simple string for username
  author: String
// author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

mongoose.model('Comment', CommentSchema)
