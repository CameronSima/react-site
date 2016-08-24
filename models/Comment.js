var mongoose = require('mongoose')
var mongooseTreeAncestors = require('mongoose-tree-ancestors')

var CommentSchema = new mongoose.Schema({
  thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
  date: { type: Date, default: Date.now },
  text: String,
  proShitters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  proShittees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likes: Number,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

mongooseTreeAncestors(CommentSchema, {
	parentFieldName: 'parent',
	parentFieldRefModel: 'CommentSchema',
	ancestorsFieldName: 'children',
	ancestorsFieldModel: 'CommentSchema'
})

CommentSchema.methods.getLikesCount = function() {
  return this.proShitters.length - this.proShittees.length
}

mongoose.model('Comment', CommentSchema)
