var config = require('./config')

module.exports = {
	isInArray: (item, array) => {
		return array.indexOf(item) > -1
	},

	changeState: (obj) => {
		for (var key in obj) {
			this.setState({key: obj[key]})
		}
	},

	// format date to show either time in hours ago, or, if dateTime was
	// 24 hours ago or more, show the date

	// TODO: Move as much of this logic server-side as possible; 
	// try to only convert toLocaleString()
	 formatDate(dateTime) {
	 	var monthNames = ["January", "February", "March", "April", "May", "June",
  			"July", "August", "September", "October", "November", "December"
		];
	 	var timeStampToHoursAgo = function(date) {
		    var round = function(value) {
		      return Math.max(Math.round(value * 10) / 10, 2.7).toFixed(0)
		    }
		    var unixTime = Date.parse(date)
		    var now = Date.now()
		    return round((now - unixTime) / 3600000)
		  }

		var ts = timeStampToHoursAgo(dateTime)
		    if (ts < 23) {
		      return ts + " hours ago"
		    }

	    // Date is saved to db in GMT, format for local timezone
	    var date = new Date(dateTime)
	    var month = monthNames[date.getMonth()]
	    var dateStr = date.toLocaleString()
	    var day = dateStr.split('/')[1]
	    var date = dateStr[0].slice(0, -1).split(' ')
	    var time = dateStr.split(' ')[1].split(':').slice(0, 2).join(':')
	    var maridiem = dateStr.split(' ')[2].toLowerCase()
	    return (
	       month + ' ' + day + ' at ' + time + maridiem
	      )
  },

	// Reorder threads by hotness
	orderByHot: (threads) => {
		var getScore = (likes, dislikes, date) => {
			var score = likes - dislikes
			var order = Math.log(Math.max(Math.abs(score), 1)) / Math.LN10
			var age = (Date.now() - Date.parse(date)) / 1000
			return order - age / 45000 
		}

		 return threads.sort((a, b) => {
			if (getScore(a.likes, a.dislikes, a.date) < 
				  getScore(b.likes, b.dislikes, b.date)) {
				return 1
			} 
			if (getScore(a.likes, a.dislikes, a.date) > 
				  getScore(b.likes, b.dislikes, b.date)) {
				return -1
			}
			return 0
		})
	},

	// Order threads by recency
	orderByDate: (threads) => {
		return threads.sort((a, b) => {
			if(Date.parse(a.date) > Date.parse(b.date)) {
				return -1
			} else {
				return 1
			}
		})
	},

	// Predictive friend selection
	suggestItems: (items, clicked) => {
		return items.filter((item) => {
			return (
				item.name.toLowerCase().indexOf(clicked.toLowerCase()) === 0 
				&& clicked.length > 0
				)
		})
	},


}
