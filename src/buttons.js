var helpers = require('./helpers')

module.exports = {
	friendsNavButtons: [
	    {
	      name: 'hot',
	      event: helpers.orderByDate
	  },
	    {
	      name: 'favorites',
	      event: helpers.orderByHot
	    }
	  ],

	friendComponentButtons: [
	    {
	      name: 'from',
	      event: ''
	  },
	    {
	      name: 'about',
	      event: ''
	    }
	  ],
	addFriendsButtons: [
	    {
	      name: 'add',
	      event: ''
	  },
	    {
	      name: 'remove',
	      event: ''
	    }
	  ],  
	  mainNavButtons: [
    {
      name: 'home',
      event: helpers.orderByDate
  },
    {
      name: 'heat',
      event: helpers.orderByHot
    }
  ],
}