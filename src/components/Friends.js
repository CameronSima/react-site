import React, { Component } from 'react'
import { Link } from 'react-router'

import NavButtonsList from './NavButtons'

const config = require('../../config')
const helpers = require('../../helpers')

class FriendContainer extends Component {
	rawMarkup() {
		let rawMarkup = marked(this.props.children.toString(), {sanitize: true })
		return {__html: rawMarkup }
	}
	render() {
		return (
			<div className="friend">
				<p>
					{ this.props.friend}
				</p>
				<NavButtonsList buttons={['from', 'about']} />
				<hr></hr>
			</div>
			)
	}
}

class FriendsList extends Component {
	render() {
		var friendNodes
		 if (this.props.data) {
		 // console.log("PROPS FROM FRIENDS")
		 // console.log(this.props.data[0].name)
		var friendNodes = this.props.data.map((friend) => {
			return (
					<FriendContainer friend={friend.name} key={friend.id}/>
				)
		})
	 }
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
		this.friendsNavButtons = [
	    {
	      name: 'hot',
	      event: helpers.orderByDate
	  },
	    {
	      name: 'favorites',
	      event: helpers.orderByHot
	    }
	  ]
	  this.addFriendsButtons = [
	    {
	      name: 'add',
	      event: ''
	  },
	    {
	      name: 'remove',
	      event: ''
	    }
	  ]
		}

		render() {
			return (
				<div id="friendsBox">
					<NavButtonsList divId={'friendsNav'} buttons={ this.friendsNavButtons } />
					<FriendsList data={this.props.data} />
					<NavButtonsList divId={'addRemoveFriends'} buttons={ this.addFriendsButtons } />
				</div>
				)
		}
	}