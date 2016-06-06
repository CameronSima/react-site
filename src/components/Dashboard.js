import React, { Component } from 'react'

class DashElement extends Component {
	render() {
		return (
			<div className="dashElement">
				{ this.props.buttonName }
			</div>
			)
	}
}

export default class Dashboard extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div id="dashboard">
				<DashElement buttonName={ "I SAID" } />
				<DashElement buttonName={ "THEY SAID" } />
				<DashElement buttonName={ "I TAGGED" } />
			</div>
			)
	}
}