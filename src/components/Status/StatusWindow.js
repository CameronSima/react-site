import React, { Component } from 'react'
import ReactDom from 'react-dom'
import { Popover, OverlayTrigger } from 'react-bootstrap'

import io from 'socket.io-client'
let socket = io('http://localhost:3001')


export default class StatusWindow extends Component {
	constructor(props) {
		super(props)
		this.handleNotification = this.handleNotification.bind(this)

		this.state = { newTheySaid: 0, 
									 newTaggedIn: 0, 
									 notifications: [],
									 activeId: '',
									 statusStyle: { color: 'black'} }

		var self = this
		socket.on('notification', function(data) {
			self.handleNotification(data)
		})
	}

	handleNotification(notification) {
		console.log(notification)
		if (notification.type === 'tagged') {
			var count = this.state.newTaggedIn += 1
			this.setState({newTaggedIn: count })
		}
		if (notification.type === 'about') {
			this.state.newTheySaid += 1
		}

		var newNotifs = this.state.notifications.concat([notification])
		var alertStyle = { color: 'red' }
		this.setState({ notifications: newNotifs,
										statusStyle: alertStyle })	
	}

	render() {
		var self = this
		var notifIds = this.state.notifications.map(function(notif) {
			return notif.id
		}).join('&')
		console.log(notifIds)
		var messages = this.state.notifications.map(function(notification) {
			return (
				<div>
					<div key={ notification.id }
							 onClick={()=>{self.props.getNotifications(notifIds, notification.id),
							 							 self.setState({ statusStyle: {color: 'black'},
							 															 newTaggedIn: 0,
							 															 newTheySaid: 0 })}}

							 	>{ notification.message }</div>
					<hr></hr>
				</div>
			)
		})
		var notification = (

				<Popover id="popover-trigger-click-root-close"
								 title="Notifications:">
					{ messages.reverse() }
				</Popover>
			)

		// emit the user_id so the connection can be stored on the server
		socket.emit('join', {
		user_id: this.props.user_id
	})

		// Get large facebook image
		var url = 'https://graph.facebook.com/' + this.props.fbId + '/picture?type=large'
		return (
			<div id='status_box'>
				<div id="avatar_box">
					<img className="avatar" src={url} />
				</div>

				<div id="status_actions">
					<OverlayTrigger trigger="click" 
													rootClose
													placement="right"
													overlay={notification}>
						<div id="status_icon" style={this.state.statusStyle}>
						dl
						</div>
					</OverlayTrigger>
					<h6 onClick={()=> {this.props.setFeedType('ALL')}}>
						ALL
					</h6>
					<h6 onClick={()=> { this.props.setFeedType('THEY SAID'),
															this.setState({newTheySaid: 0})}}>
						THEY SAID
						{ this.state.newTheySaid > 0 && 
							<sup>
								{ this.state.newTheySaid }
							</sup>
						}
					</h6>
					<h6 onClick={()=> { this.props.setFeedType('I TAGGED'), 
															this.setState({newTaggedIn: 0})}}>
						TAGGED
							{	this.state.newTaggedIn > 0 &&				
								<sup>
								{ this.state.newTaggedIn }
							</sup>
							}
					</h6>
				</div>
			</div>
			)
	}
}