import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
var _ = require('lodash')

var config = require('../../../config')

export default class TaggedModal extends Component {
	constructor(props) {
		super(props)
		this.state = { showModal: false }
		this.close = this.close.bind(this)
		this.open = this.open.bind(this)
	}
	close() {
		this.setState({ showModal: false })
	}
	open() {
		this.setState({ showModal: true })
	}

	render() {
		return (
			<div className="taggedModal">
				<div onClick={ this.open }>
					{ this.props.modalTrigger }
				</div>

				<Modal show={ this.state.showModal } onHide={ this.close }>
					<Modal.Dialog>
						<Modal.Header>
							<p className="modalTitle"> Tagged: </p>
						</Modal.Header>

						<Modal.Body>
							
							{this.props.friendsComponents}

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