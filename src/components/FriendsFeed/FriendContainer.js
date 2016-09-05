import React, { Component } from 'react'
import NavButtonList from '../Utility/NavButtons'

class FriendContainer extends Component {
	rawMarkup() {
		let rawMarkup = marked(this.props.children.toString(), {sanitize: true })
		return {__html: rawMarkup }
	}
	render() {
		return (
			<div className="friend">
				<div className="profilePic">
				</div>
					<img src={this.props.pic} />
				<p>
					{ this.props.friend}
				</p>
				<NavButtonList buttons={ buttonObs.friendComponentButtons } />
				<hr></hr>
			</div>
			)
	}
}