// import React, { Component } from 'react'
// import { Link } from 'react-router'

// import { NavButtonList } from './NavButtons'

// const config = require('../../config')
// const helpers = require('../../helpers')
// const buttonObs = require('../../buttons')

// class FriendContainer extends Component {
// 	rawMarkup() {
// 		let rawMarkup = marked(this.props.children.toString(), {sanitize: true })
// 		return {__html: rawMarkup }
// 	}
// 	render() {
// 		return (
// 			<div className="friend">
// 				<div className="profilePic">
// 				</div>
// 					<img src={this.props.pic} />
// 				<p>
// 					{ this.props.friend}
// 				</p>
// 				<NavButtonList buttons={ buttonObs.friendComponentButtons } />
// 				<hr></hr>
// 			</div>
// 			)
// 	}
// }

// class FriendsList extends Component {
// 	render() {
// 		var friendNodes
// 		 if (this.props.data) {
// 		  // console.log("PROPS FROM FRIENDS")
// 		  // console.log(this.props.data[0])
// 		var friendNodes = this.props.data.map((friend) => {
// 			return (
// 					<FriendContainer friend={ friend.username } 
// 													 pic={ friend.facebookProfilePic }
// 													 key={ friend._id }/>
// 				)
// 		})
// 	 }
// 		return (
// 			<div className="friendList">
// 				{ friendNodes }
// 			</div>
// 			)
// 		}
// 	}

	// export default class FriendsBox extends Component {
	// 	constructor(props) {
	// 	super(props)
	// 	this.state = {}
	// 	}

	// 	render() {
	// 		return (
	// 			<div id="friendsBox">
	// 				<NavButtonList divId={'friendsNav'} buttons={ buttonObs.friendsNavButtons } />
	// 				<FriendsList data={this.props.data} />
	// 				<NavButtonList divId={'addRemoveFriends'} buttons={ buttonObs.addFriendsButtons } />
	// 			</div>
	// 			)
	// 	}
	// }