import React, { Component } from 'react'

import io from 'socket.io-client'
let socket = io('http://localhost:3001')

socket.on('server event', function(data) {
	console.log(data)
	socket.emit('client event', {
		 socket: 'io'
	})
})

export default class StatusWindow extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		// Get large facebook image
		var url = 'https://graph.facebook.com/' + this.props.fbId + '/picture?type=large'
		return (
			<div id='status_box'>
				<div id="avatar_box">
					<img className="avatar" src={url} />
				</div>

				<div id="status_actions">
					<h6 onClick={()=> {this.props.setFeedType('I SAID')}}>
						I SAID
							<sup>
							</sup>
					</h6>
					<h6 onClick={()=> {this.props.setFeedType('THEY SAID')}}>
						THEY SAID
							<sup>
							</sup>
					</h6>
					<h6 onClick={()=> {this.props.setFeedType('I TAGGED')}}>
						TAGGED
							<sup>
							</sup>
					</h6>
				</div>

			</div>
			)
	}
}