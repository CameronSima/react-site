import React, { Component } from 'react'
import ReactDom from 'react-dom'
import { Popover, OverlayTrigger } from 'react-bootstrap'

var _ = require('lodash')

var config = require('../../../config')
var helpers = require('../../helpers')

export default class StatusWindow extends Component {
	constructor(props) {
		super(props)
		this.handleNotifications = this.handleNotifications.bind(this)
		this.loadNotifications = this.loadNotifications.bind(this)
		this.getMoreNotifs = this.getMoreNotifs.bind(this)

		this.state = { newTheySaid: 0, 
									 newTaggedIn: 0, 
									 notifications: [],
									 numNotifs: 5,
									 activeId: '',
									 statusStyle: { color: 'black'} }

	}

	loadNotifications() {
		$.ajax({
			url: config.apiUrl + 'notifications' + '/' + this.state.numNotifs,
			dataType: 'json',
			xhrFields: { withCredentials: true },
			cache: false,
			success: (response) => {
				this.setState({ notifications: response })
				this.handleNotifications()
			},
			error: (xhr, status, err) => {
				console.log(this.url, status, err.toString())
			}
		})
	}

	componentDidMount() {
		this.loadNotifications()
		setInterval(this.loadNotifications, config.pollInterval)
	}

	handleNotifications() {
		var tsct = 0
		var tct = 0
		this.state.notifications.forEach(function(notif) {
			if (notif.type === 'theySaid' && notif.new) {
				tsct += 1
			}
			if (notif.type === 'tagged' && notif.new) {
				tct += 1
			}
		})
		this.setState({
			newTheySaid: tsct,
			newTaggedIn: tct
		})
		if (tsct > 0 || tct > 0) {
			var alertStyle = {color: 'red'}
			this.setState({ statusStyle: alertStyle })	
		} else {
			var alertStyle = {color: 'black'}
			this.setState({statusStyle: alertStyle})
		}
	}

	getMoreNotifs() {
		this.state.numNotifs += 5
		this.loadNotifications()
	}

	render() {
		var self = this
		var messages = this.state.notifications.map(function(notification) {
			var style
			if (notification.new) {
				style = { 'backgroundColor': '#f7f7f7', 'fontWeight': 500 }
			}
			return (
				<div style={ style }
						 key={ notification._id }>
					<div key={ notification._id }
							 className="notificationLink"
							 onClick={()=>{self.props.loadThreads(notification.threadId, notification._id),
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
					{ messages }
					<a className="moreLink"
					   onClick={()=>{this.getMoreNotifs()}}>More</a>
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