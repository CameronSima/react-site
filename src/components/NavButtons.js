import React, { Component } from 'react'

var helpers = require('../../helpers')

export class NavButton extends Component {
		constructor(props) {
		super(props)
		this._clickHander = this._clickHandler.bind(this)
	}
	_clickHandler() {
		this.props.eventFunc(this.props.state, this.props.value)
	}
	render() {
		return (
			<button type="button" 
							className="btn btn-link btn-sm"
							onClick={ this._clickHander } >
				{ this.props.title }
			</button>
		)
	}
}

export class NavButtonList extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		var buttonNodes = this.props.buttons.map((button) => {
			return (
				<NavButton title={ button.name } 
									 key={ button.name }
									 state={this.props.state }
									 value={ button.event }
									 eventFunc={ this.props.eventFunc } />
			)
		})
		return (
			<div className="navButtons" id={ this.props.divId }>
				{ buttonNodes }
			</div>
			)
	}
}