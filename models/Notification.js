var mongoose = require('mongoose')

var NotificationSchema = new mongoose.Schema({
	threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
	commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	text: String,
	taggedNum: { type: Number, default: 1 },
	new: { type: Boolean, default: true },
	type: String,
	deleted: { type: Boolean, default: false }
})

NotificationSchema.methods.getTextandType = function(friendName, authored, commentId) {
	
	// if this.text already exists, commentId should have been supplied,
	// and we can assume we're adding up the number of people who have
	// commented on a thread.
	if (this.text && commentId) {
		this.taggedNum += 1
		if (authored) {
			this.text = friendName + " and " + this.taggedNum + " others have commented on your thread."
		} else {
			this.text = friendName + " and " + this.taggedNum + " others have commented on a thread you're tagged in."
		}
		this.type = 'theySaid'
	} else if (commentId) {
		if (authored) {
			this.text = friendName + " commented on your thread."
		} else {
			this.text = friendName + " commented in a thread you're tagged in."
		}
		this.type = 'theySaid'
	} else {
		this.text = friendName + " tagged you in a thread."
		this.type = 'tagged'
	}
}

module.exports = mongoose.model('Notification', NotificationSchema)