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
				Friend goes here
			</div>
			)
	}
}

export default class FriendsBox extends Component {
	render() {
		let threadNodes = this.props.data.friendsData.map((friend) => {
			return (
				<FriendContainer>
				</FriendContainer>
				)
		})
	}
}