// Parent component containting feed and friends components,
// handles retrieving data for both

import React, { Component } from 'react'
import Feed from './Feed.js'
import FriendsBox from './Friends'

const config = require('../config')

export default class FrontPage extents Component {
	loadDataFromServer() {
		$ajax({ 
			url: config.apiUrl + 'frontPage',
			dataType: 'json',
			cache: false,
			success: (xhr, status, err) => {
				console.error(this.url, status, err)
			}.bind(this)
		})
	}

	
}