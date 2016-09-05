import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'

var config = require('../../../config')

class TaggedButton extends Component {
  constructor(props) {
    super(props) 
  }
  render() {
    return (
      <button className="btn btn-primary" id="taggedButton" type="button">
        { this.props.title } <span className="badge"> { this.props.tagged.length } </span>
      </button>
      )
  }
}

export default class TaggedModal extends Component {
	constructor(props) {
		super(props)
		this.state = { showModal: false, data: this.props.suggestions }
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

		var tagged = this.props.tagged.map(function(friend) {
			return friend.name
		})

		return (
			<div className="taggedModal">
				<div onClick={ this.open }>
					<TaggedButton title={ this.props.title }
								  tagged={this.props.tagged } />
				</div>

				<Modal show={ this.state.showModal } onHide={ this.close }>
					<Modal.Dialog>
						<Modal.Header>
							<p> Tagged: </p>
						</Modal.Header>

						<Modal.Body>
							
							{tagged}

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