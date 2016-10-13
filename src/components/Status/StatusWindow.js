import React, { Component } from 'react'
import ReactDom from 'react-dom'
import { Popover, OverlayTrigger } from 'react-bootstrap'


export default class StatusWindow extends Component {
	constructor(props) {
		super(props)
		this.handleNotification = this.handleNotification.bind(this)

		this.state = { newTheySaid: 0, 
									 newTaggedIn: 0, 
									 notifications: [],
									 activeId: '',
									 statusStyle: { color: 'black'} }

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
		var notifIds = this.props.notifications.map(function(notif) {
			return notif.threadId
		}).join('&')
		//console.log(notifIds)
		var messages = this.props.notifications.map(function(notification) {
			var style
			if (notification.new) {
				style = { 'backgroundColor': '#f7f7f7', 'fontWeight': 500 }
			}
			return (
				<div style={ style }>
					<div key={ notification._id }
							 className="notificationLink"
							 onClick={()=>{self.props.getNotifications(notification._id),
							 							 self.setState({ statusStyle: {color: 'black'},
							 															 newTaggedIn: 0,
							 															 newTheySaid: 0 })}}

							 	>{ notification.text }</div>
					<hr></hr>
				</div>
			)
		})
		var notification = (
				<Popover id="popover-trigger-click-root-close"
								 title="Notifications:">
					{ messages.reverse() }
					<a className="moreLink">More</a>
				</Popover>
			)

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