import React, { Component } from 'react'

export default class NotFound extends Component {
	render() {
		var url = this.props.location.pathname
		return(
			<div> 
				<h2 id='oops'>Whoops, </h2>
				<a href='/'>
					<img id="Errimg"  src='/src/assets/dl_logoLessOpaque.png' />
				</a>
				<h3 id='oops_contd'>| Nothing found at { url }. |</h3>
			</div>
			)
	}
}