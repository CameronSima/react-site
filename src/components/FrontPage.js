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
				data.feed.forEach(function(thread) {
					console.log(thread.comments)
				})
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
					<FeedBox feed={ this.state.data.feed } 
							 friends={ this.state.data.facebookFriends }
							 setFeedType={this.setFeedType } />		

				</div>
				)
		}
	}

