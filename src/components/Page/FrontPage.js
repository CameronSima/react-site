// Parent component containting feed and friends components,
// handles retrieving data for both

import React, { Component } from 'react'
import ThreadsBox from '../Feed/ThreadsBox'
import FriendsBox from '../FriendsFeed/FriendsBox'

var config = require('../../../config')
var helpers = ('../../helpers')

export default class FrontPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: {},
			pollInterval: config.pollInterval,
			feedType: 'ALL'
		}
		this.loadDataFromServer = this.loadDataFromServer.bind(this)
		this.setFeedType = this.setFeedType.bind(this)
	}

	loadDataFromServer() {
		var feedType = this.state.feedType.split(' ').join('').toLowerCase()
		$.ajax({ 
			 url: config.apiUrl + 'frontpage/' + feedType,
			dataType: 'json',
			xhrFields: { withCredentials: true },
			cache: false,
			success: (data) => {
				this.setState({data: data})
				
				// localStorage.setItem("user", data._id)
				// console.log(localStorage.getItem("user"))
			},
			error: (xhr, status, err) => {
				console.log(this.url, status, err.toString())
			}
		})
	}


	setFeedType(feedType) {
		console.log(feedType)
		this.setState({ feedType: feedType }, function() {
			this.loadDataFromServer()
		}.bind(this))
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
					<FriendsBox data={ this.state.data.friends } />
					<ThreadsBox feed={ this.state.data.feed } 
							 friends={ this.state.data.facebookFriends }
							 setFeedType={this.setFeedType } />		

				</div>
				)
		}
	}

