import React, { Component } from 'react'

export default class NavButton extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<button type="button" className="btn btn-link">
				{ this.props.title }
			</button>
		)
	}
}