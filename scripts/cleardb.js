const mongoose = require('mongoose')
const async = require('async')

const User = mongoose.model('User', require('../models/User'))
const Thread = mongoose.model('Thread', require('../models/Thread'))
const Comment = mongoose.model('Comment', require('../models/Comment'))
const Notification = mongoose.model('Notification', require('../models/Notification'))



// connect to MongoDB
mongoose.connect('mongodb://localhost/shitlistanitsocialmediatest', function (err, db) {
  if (!err) {
    console.log('Connected to Database. . .')
  } else {
    console.log(err)
  }
})

Comment.find((err, comments) => {
	async.each(comments, (comment) => {
		comment.remove()
	})
})


Thread.find((err, threads) => {
	async.each(threads, (thread) => {
		thread.remove()
	})
})

Notification.find((err, notifs) => {
	async.each(notifs, (notif) => {
		notif.remove()
	})
})

// User.find((err, users) => {
// 	async.each(users, (user) => {
// 		user.remove()
// 	})
// })

//mongoose.disconnect()