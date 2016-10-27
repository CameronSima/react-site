import React, { Component } from 'react'
import { ButtonGroup, Button } from 'react-bootstrap'

import FriendsList from './FriendsList'
import AddRemoveFriendsModal from '../Modal/AddRemoveFriendsModal'
import AddRemoveFriendBox from '../Utility/AddRemoveFriendBox'

var _ = require('lodash')

var config = require('../../../config')
var helpers = require('../../helpers')

export default class FriendsBox extends Component {


	render() {
		return (
				<div id="friendsBox">
					<div>
					<ButtonGroup>
						<Button>TOP</Button>
						<Button>HEAT</Button>
						<AddRemoveFriendsModal />
					</ButtonGroup>
					</div>
					<FriendsList data={ this.props.friends } />
				</div>
			)
	}
}