import React, { Component } from 'react'
import { NavButton } from './NavButtons'

var config = require('../../config')
var helpers = require('../../helpers')

class FacebookFriend extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	handleFriendSubmit(fbFriend, url) {
		$.ajax({
			url: config.apiUrl + url,
			dataType: 'json',
			type: 'POST',
			data: {id: fbFriend},
			xhrFields: {withCredentials: true},
			success: function (data) {
				// this.setState({friends: data})
			}.bind(this)
		})
	}
	render() {

		// check if the current facebook friend is already friended
		console.log(this.props.id + this.props.friends)

		if (helpers.isInArray(this.props.id, this.props.friends)) {
			this.state.buttonTitle = 'remove'
			this.state.url = 'removeFriend'
		} else {
			this.state.buttonTitle = 'add'
			this.state.url = 'addFriend'
		}

		return (

			<div className="facebookFriend">
				<div>
					<img src={this.props.picUrl} />
					{this.props.name}
					<NavButton eventFunc={this.handleFriendSubmit}
							   state={this.props.id}
							   value={this.state.url}
							   title={this.state.buttonTitle} />
				</div>
			</div>
			)
	}
}

class FacebookFriendsList extends Component {
	render() {
		var fbFriendNodes, friendIds
		 if (this.props.data) {
		 	if(this.props.friends) {
		 		var friendIds = this.props.data.friends.map((friend) => {
		 		 	return friend._id
		 		 	})
		 		console.log(friendIds)
		 } else {
		 	friendIds = []
		 }
			var fbFriendNodes = this.props.data.fbFriends.map((friend) => {
			return (
					<FacebookFriend name={friend.username}
									picUrl={friend.facebookProfilePic}
									id={friend._id}
									friends={friendIds}
									key={friend._id}/>
				)
		})
	 }
		return (
			<div className="fbFriendList">
				{ fbFriendNodes }
			</div>
			)
		}
	}

export default class AddFriendsBox extends Component {
	constructor(props) {
		super(props)
		this.state = {facebookFriends: [], friends: []}
		this.loadDataFromServer = this.loadDataFromServer.bind(this)
	}

	loadDataFromServer() {
		$.ajax({
			url: config.apiUrl + 'importFriends',
			dataType: 'jsonp',
			cache: false,
			xhrFields: {withCredentials: true},
			success: (data) => {
				this.setState({data: data})
				console.log(data)
			},
			error: (xhr, status, err) => {
				console.log(this.url, status, err.toString())
			}

		})
	}
	componentDidMount() {
		this.loadDataFromServer()
	}
	render() {
		return (
			<div id="importFriends">
				<FacebookFriendsList data={this.state.data} />
			</div>
			)
	}	
}