import React, { Component } from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'

var helpers = require('../../helpers')

export default class Menu extends Component {
	constructor(props) {
		super(props)
		this.state = {title: this.props.items[0]}
		this.handleClick = this.handleClick.bind(this)
	}
	renderMenuItem(title, i) {
		return (
			<MenuItem eventKey={i}>{title}</MenuItem>
			)
	}
	handleClick(eventKey) {
		this.setState({title: eventKey})
	}
	render() {
		var menuItems = this.props.items.map(function (item, i) {
			return (
				<MenuItem key={i} onSelect={this.handleClick} eventKey={item}>{item}</MenuItem>
				)
		}, this)
		return(
			<DropdownButton bsStyle="link" title={this.state.title} id={'dropdown-basic'}>
				{menuItems}
			</DropdownButton>
		)
	}
}