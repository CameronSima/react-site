var mongoose = require('mongoose')

var CommentSchema = new mongoose.Schema({
  thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
  date: { type: Date, default: Date.now },
  text: String,
  proShitters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  proShittees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likes: { type: Number, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  parent: { type: String, default: 0 },
  ancestors: { type: String, default: '#' }
})

CommentSchema.methods.getLikesCount = function() {
  return this.proShitters.length - this.proShittees.length
}

module.exports = mongoose.model('Comment', CommentSchema)
