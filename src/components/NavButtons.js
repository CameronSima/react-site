import React, { Component } from 'react'

class NavButton extends Component {
	render() {
		return (
			<button type="button" className="btn btn-link">
				{ this.props.title }
			</button>
		)
	}
}

export default class NavButtonsList extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		var buttonNodes = this.props.buttons.map((button) => {
			return (
				<NavButton title={ button } />
			)
		})
		console.log(typeof buttonNodes)
		console.log(buttonNodes)
		return (
			<div className="navButtons">
				{ buttonNodes }
			</div>
			)
	}
}