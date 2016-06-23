// Parent component containting feed and friends components,
// handles retrieving data for both

import React, { Component } from 'react'
import FeedBox from './Feed'
import FriendsBox from './Friends'
import ThreadForm from './Feed'

var config = require('../../config')

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
				this.setState({data: data})
				console.log(data.facebookFriends)
			},
			error: (xhr, status, err) => {
				console.log(this.url, status, err.toString())
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
			return (
				<div className="FrontPage">
					<FriendsBox data={ this.state.data.facebookFriends } />
					<FeedBox feed={ this.state.data.feed } 
									 friends={ this.state.data.facebookFriends } />		

				</div>
				)
		}
	}

