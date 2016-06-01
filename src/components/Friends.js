import React, { Component } from 'react'
import { Link } from 'react-router'

import NavButton from './NavButton'

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
				<hr></hr>
			</div>
			)
	}
}

class FriendsList extends Component {
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

	export default class FriendsBox extends Component {
		constructor(props) {
		super(props)
		this.state = {}
		}
		render() {
			var buttons = ['hot', 'favorites'].map((button) => {
				return (
					<NavButton title={ button } />
					)
			})

			return (
				<div className="friendsBox">
					<div className="friendsNav">
						{ buttons }
					</div>
					<FriendsList data={this.props.data} />
				</div>
				)
		}
	}