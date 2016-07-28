var config = require('./config')

module.exports = {
	isInArray: (item, array) => {
		console.log(item)
		console.log(array)
		return array.indexOf(item) > -1
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
				return -1
			} 
			if (getScore(a.likes, a.dislikes, a.date) > 
				  getScore(b.likes, b.dislikes, b.date)) {
				return 1
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
