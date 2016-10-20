import React, { Component } from 'react'

import FriendThreadsModal from '../Modal/FriendThreadsModal'

var config = require('../../../config')

export default class FriendContainer extends Component {
	rawMarkup() {
		let rawMarkup = marked(this.props.children.toString(), {sanitize: true })
		return {__html: rawMarkup }
	}

	render() {
		return (
			<div className="friend">
				
					<img src={this.props.pic } />
				<p>
					{ this.props.friend }
				</p>
				<FriendThreadsModal friendId={ this.props.id }
														friendName={ this.props.friend } />

				<hr></hr>
			</div>
			)
	}
}