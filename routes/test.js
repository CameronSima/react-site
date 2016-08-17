router.get('/api/frontPage/:feedType*?', isAuthenticated, function (req, res, next) {
	async.parallel([
		function(callback) {
			User.findOne({ '_id': req.user._id })
		    .populate('feed')
		    .populate('friends')
		    .exec(function (err, userData) {
		    	if (err) {
		    		console.log(err)
		    	} else {
					console.log(userData.username)
					callback(null, userData)
		    	}
		    })
		},
		function(callback) {
			if (req.params.feedType === 'theySaid') {
				threadQuery('victim', req.username)
				.exec(function (err, theySaidThreads) {
					if (err) {
						console.log(err)
					} else {
						callback(null, theySaidThreads)
					}
				})
			} else {
				callback(null, null)
			}
		},
		function(err, results) {
			if (err) {
				console.log(err)
			}
			var userData = results[0]
			var theySaidThreads = results[1]
			if (req.params.feedType === 'isaid') {

				// filter out threads not authored by the user
				var iSaidThreads = userData.feed.filter(function (thread) {
					return thread.author.real = req.user.username
				})
				data.iSaidThreads = iSaidThreads
			}
			// if 'isaid' or 'theysaid' were supplied, set those threads
			// as the user's feed; else, use the users' default feed
			// (all threads he authored or was tagged in).
			 userData.feed = iSaidThreads || theySaidThreads || userData.feed

			 // Finally, remove some of the data such as friends' passwords
			 // that we don't want the client receive. Here, we replace
			 // the author user object containing _id, username, and 
			 // pseudonym with simply either the username or pseudonym
			 // depending on whether the auther chose to remain anonymous
			 // or not.
			 userData.feed.forEach(function(thread) {
			 	if (thread.anonymous === true) {
			 		thread.author[0] = thread.author[0].pseudonym
			 	} else {
			 		thread.author[0] = thread.author[0].real
			 	}
			})
			res.jsonp(userData)
		}
	])
})