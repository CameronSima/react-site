import React, { Component } from 'react'
import FriendContainer from './FriendContainer'

export default class FriendsList extends Component {
	render() {
		var friendNodes
		 if (this.props.data) {
		  // console.log("PROPS FROM FRIENDS")
		  // console.log(this.props.data[0])
		var friendNodes = this.props.data.map((friend) => {
			return (
					<FriendContainer friend={ friend.username } 
													 pic={ friend.facebookProfilePic }
													 key={ friend._id }/>
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