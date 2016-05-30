import React, { Component } from 'react'
import { Link } from 'react-router'

const config = require('../../config')

export default class FriendsBox extends Component {
	constructor(props) {
		super(props)
		this.state = data = {}
	}
	loadFriendsFromServer() {
		$ajax({
			url: config.apiUrl + 'friendslist',
			dataType: 'jsonp',
			cache: false,
			success: (data) => {
				this.setState({data:data})
			}.bind(this),
			error: (xhr, status, err) => {
				console.error(this.url, status, err.toString())
			}.bind(this)
		})
	}

	componentDidMount() {
		this.loadFriendsFromServer()
		setInterval(this.loadFriendsFromServer, config.friendsListPollInterval)
	}

	componentWillUnmount() {
		// stop polling once we navigate away from the main page,
		// e.g. to the signup page
		this.state.friendsListPollInterval = false
	}


}