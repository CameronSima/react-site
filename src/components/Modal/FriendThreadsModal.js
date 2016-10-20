import React, { Component } from 'react'
import { Modal, Button } from 'react-bootstrap'

import ThreadList from '../Feed/ThreadList'

var config = require('../../../config')
var helpers = require('../../helpers')

export default class FriendThreadsModal extends Component {
	constructor(props) {
		super(props)
		this.state = { showModal: false, 
									 data: [],
									 limit: 25,
									 threadsType: '',
									 headerText: '' }

		this.close = this.close.bind(this)
		this.open = this.open.bind(this)
		this.getHeaderText = this.getHeaderText.bind(this)
		this.getFriendThreads = this.getFriendThreads.bind(this)
		this.handleByThreads = this.handleByThreads.bind(this)
		this.handleTalkedThreads = this.handleTalkedThreads.bind(this)
		this.handleAboutThreads = this.handleAboutThreads.bind(this)
		this.handleMoreThreads = this.handleMoreThreads.bind(this)
	}

	close() {
		this.setState({ showModal: false })
	}

	open() {
		this.setState({ showModal: true })
	}

	getHeaderText(threadsType) {
		if (threadsType === 'talked') {
			this.setState({headerText: this.props.friendName + ' commented on:'})
		} else {
			this.setState({headerText: threadsType + ' ' + this.props.friendName + ':'})
		}
	}

	handleMoreThreads() {
		this.state.limit += 25
		this.getFriendThreads()
	}

	handleByThreads() {
		this.state.threadsType = 'by'
		this.state.headerText = 'By ' + this.props.friendName + ':'
		this.getFriendThreads()
	}

	handleAboutThreads() {
		this.state.threadsType = 'about'
		this.state.headerText = 'About ' + this.props.friendName + ':'
		this.getFriendThreads()
	}

	handleTalkedThreads() {
		this.state.threadsType = 'talked'
		this.state.headerText = this.props.friendName + ' commented on:'
		this.getFriendThreads()
	}

	getFriendThreads() {
		$.ajax({
			url: config.apiUrl + 'user/' + 
			     this.state.threadsType + '/' + this.props.friendId + 
			     '/' + this.state.limit,

			dataType: 'json',
			xhrFields: { withCredentials: true },
			cache: false,
			success: (response) => {
				this.setState({ data: response })
			},
			error: (xhr, status, err) => {
				console.log(this.url, status, err.toString())
			}
		})
	}
	render() {
		return (
			<div className="friendThreadsModal">
				<div onClick={ this.open }>
					<div className="friendActions">
						<a className="byLink"
							 onClick={()=> {this.handleByThreads()}}>By</a>
						<a className="aboutLink"
							 onClick={()=> {this.handleAboutThreads()}}>About</a>
						<a className="talkedLink"
							 onClick={()=> {this.handleTalkedThreads()}}>Talked</a>
					</div>
				</div>

				<Modal show={ this.state.showModal } onHide={ this.close }>
					<Modal.Dialog>
						<Modal.Header>
							<p className="modalTitle"> { this.state.headerText } </p>
						</Modal.Header>

						<Modal.Body>
							<ThreadList data={ this.state.data } 
													sortFunc={ helpers.orderByHot } />
							<a className="moreThreadsLink"
								 onClick={()=>{this.handleMoreThreads()}}>
								<h6> MORE</h6>
							</a>
						</Modal.Body>

						<Modal.Footer>
							<a className="closeLink" onClick={ this.close }>Close</a>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal>
			</div>
		)
	}

}