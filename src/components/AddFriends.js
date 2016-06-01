import React, { Component } from 'react'

export default class AddFriends extends Component {
	constructor(props) {
		super(props)
		this.state = {facebookFriends: []}
		this.loadDataFromServer = this.loadDataFromServer.bind(this)
	}
	
}