const mongoose = require('mongoose')
const async = require('async')

const User = mongoose.model('User', require('../models/User'))
const Thread = mongoose.model('Thread', require('../models/Thread'))

// connect to MongoDB
mongoose.connect('mongodb://localhost/shitlistanitsocialmediatest', function (err, db) {
  if (!err) {
    console.log('Connected to Database. . .')
  } else {
    console.log(err)
  }
})

Thread.find((err, threads) => {
	async.each(threads, (thread) => {
		thread.remove()
	})
})

User.find((err, users) => {
	async.each(users, (user) => {
		user.remove()
	})
})

// function clearDocs (collection) {
// 	mongoose.model(collection, require('../models/' + collection)
// 	).find((err, docs) => {
// 		console.log(docs)
// 		async.each(docs, (doc) => {
// 			doc.remove()
// 		})
// 	})
// 	callback()
// }

// function endDbConn(callback) {
// 	mongoose.disconnect()
// 	callback()
// }

// async.series([
// 	function (callback) {
// 		() => {
// 			process.argv[2].split(', ').forEach((collection) => {
// 				clearDocs(collection, callback)
// 			})
// 		}
// 	},
// 	function (callback) {
// 		endDbConn(callback)
// 	}
// ])
