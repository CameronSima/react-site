import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import { Button } from 'react-bootstrap'

import AddRemoveFriendBox from '../Utility/AddRemoveFriendBox'

var _ = require('lodash')
var helpers = require('../../helpers')
var config = require('../../../config')

class Friend extends Component {
	constructor(props) {
		super(props)
		this.handleFriendSubmit = this.handleFriendSubmit.bind(this)
		this.handleButtonState = this.handleButtonState.bind(this)
		this.state = {buttonTitle: '',
									url: ''}
	}
	handleFriendSubmit(fbFriend) {
		if (this.state.url == 'removeFriend') {
			this.setState({url: 'addFriend', buttonTitle: 'add'})
		} else {
			this.setState({url: 'removeFriend', buttonTitle: 'remove'})
		}
		$.ajax({
			url: config.apiUrl + this.state.url,
			//contentType: "json",
			//dataType: 'jsonp',
			type: 'POST',
			data: { id: fbFriend },
			xhrFields: { withCredentials: true },
			success: function (friends) {
				//this.handleButtonState()
			},
			error: (xhr, status, err) => {
				console.log(this.url, status, err.toString())
			}

		})
	}
	handleButtonState() {
		//check if the current facebook friend is already friended
		if (helpers.isInArray(this.props.friend._id, this.props.friendIds)) {
			this.setState({ buttonTitle: 'remove',
							url: 'removeFriend'
			})
		} else {
			this.setState({ buttonTitle: 'add',
							url: 'addFriend'
			})
		}
	}
	componentDidMount() {
		this.handleButtonState()
	}
	render() {
		return(
			<AddRemoveFriendBox friend={this.props.friend}
													buttonText={this.state.buttonTitle}
													clickedFunc={this.handleFriendSubmit}
													clickedFuncParam={this.props.friend._id}
													key={this.props.friend._id} />
			)
	}
}

class FacebookFriendsList extends Component {
	constructor(props) {
		super(props)
		this.submitToServer = this.submitToServer.bind(this)
	}

	submitToServer(fbFriend, url) {
		$.ajax({
			url: config.apiUrl + url,
			//contentType: "json",
			//dataType: 'jsonp',
			type: 'POST',
			data: { id: fbFriend },
			xhrFields: { withCredentials: true },
			success: function (friends) {
				//this.handleButtonState()
				this.setState({friends: freinds})
			},
			error: (xhr, status, err) => {
				console.log(this.url, status, err.toString())
			}

		})
	}
	render() {
		var fbFriendNodes, friendIds
		 if (this.props.data) {
	 		var friendIds = this.props.data.friends.map((friend) => {
	 		 	return friend._id
	 		 	})

			var fbFriendNodes = this.props.data.fbFriends.map((friend) => {
			return (
				<Friend friend={friend}
								key={friend._id}
								friendIds={friendIds} />																						
				)
		})
	 }
		return (
			<div className="fbFriendList">
				{ fbFriendNodes }
			</div>
			)
		}
	}

export default class AddRemoveFriendsModal extends Component {
	constructor(props) {
		super(props)
		this.state = { showModal: false,
									 data: [] }
		this.close = this.close.bind(this)
		this.open = this.open.bind(this)
		this.loadDataFromServer = this.loadDataFromServer.bind(this)
	}
	componentDidMount() {
		this.loadDataFromServer()
	}

	loadDataFromServer() {
		$.ajax({
			url: config.apiUrl + 'importFriends',
			dataType: 'jsonp',
			cache: false,
			xhrFields: {withCredentials: true},
			success: (response) => {
				console.log(response)
				this.setState({data: response})

			},
			error: (xhr, status, err) => {
				console.log(this.url, status, err.toString())
			}

		})
	}

	close() {
		this.setState({ showModal: false })
	}

	open() {
		this.setState({ showModal: true })
	}

	render() {
		return(
			<div className="addRemoveFriendsModal">
				<div onClick={this.open}>
					<Button>&#9786;&#9787;</Button>
				</div>

				<Modal show={this.state.showModal} onHide={this.close}>
					<Modal.Dialog>
						<Modal.Header>
							<p className="modalTitle">Your following friends are on D.L.</p>
						</Modal.Header>
						<Modal.Body>
							<FacebookFriendsList data={this.state.data} />
						</Modal.Body>
						<Modal.Footer>
							<a className="closeLink" onClick={this.close}>Close</a>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal>
			</div>
		)
	}
}