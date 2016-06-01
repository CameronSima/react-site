import React, { Component } from 'react'
import { Link } from 'react-router'

const config = require('../../config')

class FriendContainer extends Component {
	rawMarkup() {
		let rawMarkup = marked(this.props.children.toString(), {sanitize: true })
		return {__html: rawMarkup }
	}
	render() {
		return (
			<div className="friend">
				{ this.props.friend}
			</div>
			)
	}
}
export default class FriendsBox extends Component {
	constructor(props) {
		super(props)
		this.state = {}

	}
	render() {
		var friendNodes
		 if (this.props.data) {
		 console.log("PROPS FROM FRIENDS")
		 console.log(this.props.data[0].name)
		var friendNodes = this.props.data.map((friend) => {
			return (
					<FriendContainer friend={friend.name} key={friend.id}/>
				)
		})
	 }
	 console.log(friendNodes) 
		return (
			<div className="friendList">
				{ friendNodes }
			</div>
			)
		}
	}