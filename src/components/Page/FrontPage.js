// Parent component containting feed and friends components,
// handles retrieving data for both

import React, { Component } from 'react'
import ThreadsBox from '../Feed/ThreadsBox'
import FriendsBox from '../FriendsFeed/FriendsBox'
import StatusWindow from '../Status/StatusWindow'
import NavBar from '../Utility/NavBar'

var Router = require('react-router')

var _ = require('lodash')

var config = require('../../../config')
var helpers = ('../../helpers')

export default class FrontPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			friends: [],
			notifications: [],
			feed: [],
			facebookFriends: [],
			pollInterval: config.pollInterval,
			feedType: 'ALL',
			pic: ''
		}
		this.loadDataFromServer = this.loadDataFromServer.bind(this)
		this.loadThreads = this.loadThreads.bind(this)
		this.setFeedType = this.setFeedType.bind(this)
		this.addThread = this.addThread.bind(this)
		this.replaceThread = this.replaceThread.bind(this)
	}

	loadThreads(idsArr, notificationId) {
		var self = this
		$.ajax({
			url: config.apiUrl + 'threads/' + idsArr + '/' + notificationId,
			dataType: 'json',
			contentType: 'json',
			type: 'GET',
			data: { ids: idsArr, notificationId: notificationId },
			xhrFields: { withCredentials: true },
			cache: false,
			success: (response) => {
				var feed = response

				this.setState({ feed: feed,
												feedType: 'readingNotifications' })
			},
			error: (xhr, status, err) => {
				console.log(this.url, status, err.toString())
			}
		})
	}

	loadDataFromServer() {
		if (this.state.feedType === 'readingNotifications') {
			return
		}
		var feedType = this.state.feedType.split(' ').join('').toLowerCase()
		$.ajax({ 
			url: config.apiUrl + 'frontpage/' + feedType,
			dataType: 'json',
			xhrFields: { withCredentials: true },
			cache: false,
			success: (response) => {
				this.checkAuth(response)
				this.setState({ friends: response.friends,
												user_id: response._id,
												feed: response.feed,
												facebookFriends: response.facebookFriends,
												fbId: response.facebookId })
			},
			error: (xhr, status, err) => {
				console.log(this.url, status, err.toString())
				//Router.browserHistory.push('/signup')
			}
		})
	}

	checkAuth(response) {
		if (response === 'not logged in') {
			Router.browserHistory.push('/signup')
		}
	}

	// used to update threads that have be commented on --
	// replace old thread object with updated one
	replaceThread(updatedThread) {
		var updatedFeed = _.filter(this.state.feed, function(thread) {
			return thread._id != updatedThread._id
		})
		this.setState({feed: updatedFeed.concat([updatedThread])})
	}

	// add newly submitted thread response from server to feed
	addThread(thread) {
		this.setState({ feed: this.state.feed.concat([thread])})
	}

	setFeedType(feedType) {
		this.setState({ feedType: feedType }, function() {
			this.loadDataFromServer()
		}.bind(this))
	}

	componentDidMount() {
		this.loadDataFromServer()
	}

	componentWillUnmount() {
		this.state.pollInterval = false
	}
		render() {
			return (
				<div>
					<NavBar />
					<div className="FrontPage">
						<div id="left_column">
							<StatusWindow fbId={this.state.fbId}
														loadThreads={this.loadThreads}
														setFeedType={this.setFeedType}
														user_id={this.state.user_id} />

							<FriendsBox data={this.state.friends} />
						</div>
						<ThreadsBox feed={this.state.feed} 
												addThread={this.addThread}
												replaceThread={this.replaceThread}
								 				friends={this.state.friends}
								 				setFeedType={this.setFeedType} />		
					</div>
				</div>
				)
		}
	}

