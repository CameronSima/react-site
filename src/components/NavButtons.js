import React, { Component } from 'react'

class NavButton extends Component {
	render() {
		return (
			<button type="button" className="btn btn-link btn-sm">
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
				<NavButton title={ button } key={ button }/>
			)
		})
		return (
			<div className="navButtons" id={ this.props.divId }>
				{ buttonNodes }
			</div>
			)
	}
}