// Parent component containting feed and friends components,
// handles retrieving data for both

import React, { Component } from 'react'
import ThreadsBox from '../Feed/ThreadsBox'
import FriendsBox from '../FriendsFeed/FriendsBox'
import StatusWindow from '../Status/StatusWindow'
import NavBar from '../Utility/NavBar'

var Router = require('react-router')

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
		this.loadNotifications = this.loadNotifications.bind(this)
		//this.loadThreads = this.loadThreads.bind(this)
		this.setFeedType = this.setFeedType.bind(this)
		this.addThread = this.addThread.bind(this)
	}


	loadNotifications() {
		$.ajax({
			url: config.apiUrl + 'notifications',
			dataType: 'json',
			xhrFields: { withCredentials: true },
			cache: false,
			success: (response) => {
				this.setState({ notifications: response })
			},
			error: (xhr, status, err) => {
				console.log(this.url, status, err.toString())
			}
		})
	}

	loadThreads(idsArr, id) {
		$.ajax({
			url: config.apiUrl + 'threads/' + idsArr,

			dataType: 'json',
			contentType: 'json',
			type: 'GET',
			params: { ids: idsArr },
			xhrFields: { withCredentials: true },
			cache: false,
			success: (response) => {
				this.s
				var feed = response

				//make the clicked id appear at the top if it was
				// supplied.
				if (id) {
					feed.sort(function(a, b) {
						return a != id
					})
				}
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

	addThread(thread) {

    // Set fake data for now, until the feed response
    // re-populates the feed with processed data
    var newThread = {
    	text: thread.text,
    	included: thread.included,
    	victim: thread.victim,
    	anonymous: thread.anonymous,
    	_id: Date.now(),
    	author: '...',
    	date: Date.now()

    }
		this.setState({ feed: this.state.feed.concat([newThread])})
	}

	setFeedType(feedType) {
		this.setState({ feedType: feedType }, function() {
			this.loadDataFromServer()
		}.bind(this))
	}

	componentDidMount() {
		this.loadDataFromServer()
		this.loadNotifications()
		setInterval(this.loadNotifications, this.state.pollInterval)
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
						<StatusWindow fbId={ this.state.fbId }
													getNotifications={ this.loadThreads }
													notifications={ this.state.notifications }
													setFeedType={ this.setFeedType }
													user_id={ this.state.user_id } />

						<FriendsBox data={ this.state.friends } />
					</div>
					<ThreadsBox feed={ this.state.feed } 
											addThread={ this.addThread }
							 				friends={ this.state.friends }
							 				setFeedType={this.setFeedType } />		

				</div>
				</div>
				)
		}
	}

