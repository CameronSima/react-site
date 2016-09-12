// Parent component containting feed and friends components,
// handles retrieving data for both

import React, { Component } from 'react'
import ThreadsBox from '../Feed/ThreadsBox'
import FriendsBox from '../FriendsFeed/FriendsBox'
import NavBar from '../Utility/NavBar'

var Router = require('react-router')

var config = require('../../../config')
var helpers = ('../../helpers')

export default class FrontPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			friends: [],
			feed: [],
			facebookFriends: [],
			pollInterval: config.pollInterval,
			feedType: 'ALL'
		}
		this.loadDataFromServer = this.loadDataFromServer.bind(this)
		this.setFeedType = this.setFeedType.bind(this)
		this.addThread = this.addThread.bind(this)
	}

	loadDataFromServer() {
		var feedType = this.state.feedType.split(' ').join('').toLowerCase()
		$.ajax({ 
			 url: config.apiUrl + 'frontpage/' + feedType,
			dataType: 'json',
			xhrFields: { withCredentials: true },
			cache: false,
			success: (response) => {
				this.checkAuth(response)
				this.setState({ friends: response.friends,
												feed: response.feed,
												facebookFriends: response.facebookFriends })
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
    	author: '...Me...'.italics(),
    	date: Date.now() + 10000

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
		setInterval(this.loadDataFromServer, this.state.pollInterval)
	}
	componentWillUnmount() {
		this.state.pollInterval = false
	}
		render() {
			return (
				<div className="FrontPage">
					<NavBar />
					<FriendsBox data={ this.state.friends } />
					<ThreadsBox feed={ this.state.feed } 
											addThread={ this.addThread }
							 				friends={ this.state.friends }
							 				setFeedType={this.setFeedType } />		

				</div>
				)
		}
	}

