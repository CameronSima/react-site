import React, { Component } from 'react'

var config = require('../../config')

class FacebookFriend extends Component {
	render() {
		return (
			<div className="facebookFriend">
				<div>
					{this.props.name}
				</div>
				<div>
					hi
				</div>
			</div>
			)
	}
}

class FacebookFriendsList extends Component {
	render() {
		var fbFriendNodes
		 if (this.props.data) {
		var fbFriendNodes = this.props.data.map((friend) => {
			console.log(friend.name)
			return (
					<FacebookFriend name={friend.name} key={friend.id}/>
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
		console.log("oad")
		$.ajax({
			url: config.apiUrl + 'importFriends',
			dataType: 'jsonp',
			cache: false,
			xhrFields: {withCredentials: true},
			success: (friends) => {
				console.log(friends)
				this.setState({facebookFriends: friends})
			},
			error: (xhr, status, err) => {
				console.log(this.url, status, err.toString())
			}

		})
	}

	handleFriendSubmit(fbFriend) {
		$.ajax({
			url: config.apiUrl + 'importFriends',
			datatype: 'jsonp',
			type: 'POST',
			data: fbFriend,
			xhrFields: {withCredentials: true},
			success: function (data) {
				this.setState({friends: data})
			}.bind(this)
		})
	}

	componentDidMount() {
		this.loadDataFromServer()
	}
	render() {
		console.log(this.state)
		return (
			<div id="importFriends">
				<FacebookFriendsList data={this.state.facebookFriends} />
			</div>
			)
	}	
}