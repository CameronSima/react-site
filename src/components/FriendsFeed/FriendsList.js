import React, { Component } from 'react'
import FriendContainer from './FriendContainer'

export default class FriendsList extends Component {
	render() {
		var friendNodes
		 if (this.props.data) {
		var friendNodes = this.props.data.map((friend) => {
			return (
					<FriendContainer friend={ friend.facebookName } 
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