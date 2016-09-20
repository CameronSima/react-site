var mongoose = require('mongoose')

var NotificationSchema = new mongoose.Schema({
	threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
	commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	text: String,
	taggedNum: { type: Number, default: 1 },
	new: { type: Boolean, default: true }
})

NotificationSchema.methods.getText = function(friendName, commentId) {
	
	// if this.text already exists, commentId should have been supplied,
	// and we can assume we're adding up the number of people who have
	// commented on a thread.
	if (this.text && commentId) {
		this.taggedNum += 1
		this.text = friendName + " and " + this.taggedNum + " others have commented on a thread you're tagged in."
	} else if (commentId) {
		this.text = friendName + " commented in a thread you're tagged in."
	} else {
		this.text = friendName + " tagged you in a thread."
	}
}

module.exports = mongoose.model('Notification', NotificationSchema)