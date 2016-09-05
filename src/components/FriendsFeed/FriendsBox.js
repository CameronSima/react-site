import React, { Component } from 'react'

import FriendsList from './FriendsList'

export default class FriendsBox extends Component {
	constructor(props) {
	super(props)
	}

	render() {
		return (
			<div id="friendsBox">
				<FriendsList data={ this.props.data } />
			</div>
			)
	}
}