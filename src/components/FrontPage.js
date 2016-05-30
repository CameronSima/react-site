// Parent component containting feed and friends components,
// handles retrieving data for both

import React, { Component } from 'react'
import Feed from './Feed.js'
import FriendsBox from './Friends'

const config = require('../config')

export default class FrontPage extents Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			pollInterval: config.pollInterval
		}
	}
	componentDidMount() {
		this.loadDataFromServer()
		setInterval(this.loadDataFromServer, this.state.pollInterval)
	}
	componentWillUnmount() {
		this.state.pollInterval = false
	}
	loadDataFromServer() {
		$ajax({ 
			url: config.apiUrl + 'frontpage',
			dataType: 'json',
			cache: false,
			success: (data) => {
				this.setState({data: data})
			}.bind(this),
			error: (xhr, status, err) => {
				console.error(this.url, status, error.toString())
			}.bind(this)
			}
		})
		render() {
			return (
				<div className="FrontPage">
					<FriendsBox data={ this.state.data.friendsData } />
					<FeedBox data={ this.state.data.feedData } />
				</div>
				)
		}
	}
