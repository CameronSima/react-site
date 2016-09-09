import React, { Component } from 'react'
import { ButtonGroup, Button } from 'react-bootstrap'

import FriendsList from './FriendsList'

export default class FriendsBox extends Component {
	constructor(props) {
	super(props)
	}

	render() {
		return (

				<div id="friendsBox">
					<div>
					<ButtonGroup>
						<Button>TOP</Button>
						<Button>HEAT</Button>
					</ButtonGroup>
					</div>
					<FriendsList data={ this.props.data } />
				</div>
			)
	}
}