import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
var _ = require('lodash')

import AddRemoveFriendBox from '../Utility/AddRemoveFriendBox'

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
		// build array of tagged and untagged, removing duplicates
		var self = this
		var unTagged = _.filter(this.props.allFriends, function(friend) {
			_.each(self.props.tagged, function(tagged) {
				return friend._id !== tagged._id
			})
		})

		var friendArr = this.props.tagged.concat(unTagged)
		var friendsComponents = _.map(friendArr, function(friend) {
			var clickedFunc
			// friends not tagged will have their facebook profile name
			// attached to their user object, tagged ones won't
			if (friend.facebookName) {
				clickedFunc = self.props.handleTagged
			} else {
				clickedFunc = self.props.handleUntagged
			}
			return (
				<AddRemoveFriendBox friend={friend}
														tagged={friend.facebookName}
														clickedFunc={clickedFunc}
														key={friend.id} />
				)
		})

		return (
			<div className="taggedModal">
				<div onClick={ this.open }>
					<TaggedButton title={ this.props.title }
								  			tagged={this.props.tagged }
								  																/>
				</div>

				<Modal show={ this.state.showModal } onHide={ this.close }>
					<Modal.Dialog>
						<Modal.Header>
							<p className="modalTitle"> Tagged: </p>
						</Modal.Header>

						<Modal.Body>
							
							{friendsComponents}

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