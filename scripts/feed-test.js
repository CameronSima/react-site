// A script to load dummy data into the db and test that feeds/friends are 
// working properly.

// Use: run script with the following command line arguments:
// 1. an array of usernames, who will all be 'friends'. User
// accounts will be created if they do not exist. If they do,
// the friendship will be added

// 2. an array containing a thread text, author, and another
// array with the names of friends included

const mongoose = require('mongoose')
const async = require('async')

const User = mongoose.model('User', require('../models/User'))
const Thread = mongoose.model('Thread', require('../models/Thread'))

let usernames = []

// connect to MongoDB
mongoose.connect('mongodb://localhost/shitlistanitsocialmediatest', function (err, db) {
  if (!err) {
    console.log('Connected to Database. . .')
  } else {
    console.log(err)
  }
})

const u = process.argv[2].split(', ')
let thread = process.argv[3].split(', ')

function loopThroughUsers(users, cb, callback) {
	async.each(users, (user) => {
		User.findOne({'facebook.name': user}, (err, existingUser) => {
			if (err) {
				console.log(err)
			}
			if (existingUser) {
				user = null
			}
			cb(user)
		})

	}, (err) => { 
		if (err) {
			console.log(err)
		} else {
		console.log('done')
	}
	})
	callback()
}

// Add users to db, and all their friends as friends
function addUser(user) {
	if (user) {
		let friends = []
		u.forEach((person) => {
			if (person !== user) {
				friends.push(person)
			}
		})
		let newUser = new User()
		newUser.facebook.name = user
		newUser.password = '123'

		newUser.facebook.friends = friends
		newUser.save()
	}
}

function getAllUsernames(callback) {
	User.find((err, users) => {
	users.forEach((user) => {
		usernames.push(user.facebook.name)
		})
	callback()
	})
}

function print(data, callback) {
	console.log(data)
	callback()
}

function addUsers(callback) {
	loopThroughUsers(u, addUser, callback)
}

function endDbConn(callback) {
	mongoose.disconnect()
	callback()
}

function addThread(author, text, included, callback) {
	let newThread = new Thread()
	newThread.text = text
	newThread.author = author
	newThread.included = included
	

	async.each(included, (person) => {
		User.update(
			{'facebook.name': person},
			{$push: {'feed': newThread._id}}, {upsert:true}, function (err, data) {

			}
			)
		newThread.save()
	})
	


	callback()
}

async.series([
	function (callback) {
		getAllUsernames(callback)
	},
	function (callback) {
		addUsers(callback)
	},
	function (callback) {
		const author = thread[0]
		const text = thread[1]
		const included = thread.slice(2, thread.length)
		addThread(thread[0], thread[1], included, callback)
	},

	function (callback) {
		endDbConn(callback)

	}
])



