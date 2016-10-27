import React, { Component } from 'react'
import { Button } from 'react-bootstrap'

// Reusable friend container containing an add or remove button, 
// and takes an onClick function
class AddRemoveFriendBox extends Component {
	render() {
		return(
			<div className="friendBoxOuter">
				<div className="friendBoxInner">
					<img src={this.props.friend.facebookProfilePic} />
					<div className="friendName">
						{ this.props.friend.name }
					</div>
					<Button className='addRemoveButton'
									onClick={()=>{this.props.clickedFunc(this.props.clickedFuncParam)}}>{this.props.buttonText}</Button>
				</div>
			</div>
			)
	}
}

module.exports = AddRemoveFriendBox