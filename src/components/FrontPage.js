// Parent component containting feed and friends components,
// handles retrieving data for both

import React, { Component } from 'react'
import FeedBox from './Feed.js'
import FriendsBox from './Friends'
import Dashboard from './Dashboard'

const config = require('../../config')

export default class FrontPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: {},
			pollInterval: config.pollInterval
		}
		this.loadDataFromServer = this.loadDataFromServer.bind(this)
	}

	loadDataFromServer() {
		$.ajax({ 
			url: config.apiUrl + 'frontpage',
			dataType: 'jsonp',
			cache: false,
			success: (data) => {
				// console.log("DATA FROM AJAX REQUEST")
				// console.log(data)
				this.setState({data: data})
			},
			error: (xhr, status, err) => {
				console.error(this.url, status, error.toString())
			}
		})
	}
	componentDidMount() {
		this.loadDataFromServer()
		setInterval(this.loadDataFromServer, this.state.pollInterval)
	}
	componentWillUnmount() {
		this.state.pollInterval = false
	}
		render() {
			// console.log("STATE FROM FRONTPAGE")
			// console.log(this.state.data)
			return (
				<div className="FrontPage">
					<FriendsBox data={ this.state.data.facebookFriends } />
					<FeedBox feed={ this.state.data.feed } friends={ this.state.data.facebookFriends } />		
				</div>
				)
		}
	}

