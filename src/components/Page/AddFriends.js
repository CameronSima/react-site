import React, { Component } from 'react'
import { NavButton } from '../Utility/NavButtons'
import ReactDOM from 'react-dom'

var config = require('../../../config')
var helpers = require('../../helpers')



class FacebookFriend extends Component {
	constructor(props) {
		super(props)
		this.state = { buttonTitle: "",
					   url: "",
					   friends: this.props.friends
					}
		this.handleFriendSubmit = this.handleFriendSubmit.bind(this)
		this.handleButtonState = this.handleButtonState.bind(this)
	}

	handleFriendSubmit(fbFriend, url) {
		if (url == 'removeFriend') {
			this.setState({url: 'addFriend', buttonTitle: 'add'})
		} else {
			this.setState({url: 'removeFriend', buttonTitle: 'remove'})
		}
		$.ajax({
			url: config.apiUrl + url,
			//contentType: "json",
			//dataType: 'jsonp',
			type: 'POST',
			data: { id: fbFriend },
			xhrFields: { withCredentials: true },
			success: function (friends) {
				//this.handleButtonState()
			},
			error: (xhr, status, err) => {
				console.log(this.url, status, err.toString())
			}

		})
	}
	handleButtonState() {
		//check if the current facebook friend is already friended
		if (helpers.isInArray(this.props.id, this.state.friends)) {
			this.setState({ buttonTitle: 'remove',
							url: 'removeFriend'
			})
			
		} else {
			this.setState({ buttonTitle: 'add',
							url: 'addFriend'
			})
		}
	}
	componentDidMount() {
		this.handleButtonState()
	}
	render() {
		return (
			<div className="facebookFriend" >
				<div>
					<img src={this.props.picUrl} />
					{this.props.name}
					<NavButton eventFunc={ this.handleFriendSubmit }
							   state={ this.props.id }
							   value={ this.state.url }
							   title={ this.state.buttonTitle } 
							   key={ this.props.id }/>
				</div>
			</div>
			)
	}
}

class FacebookFriendsList extends Component {
	render() {
		var fbFriendNodes, friendIds
		 if (this.props.data) {

	 		var friendIds = this.props.data.friends.map((friend) => {
	 		 	return friend._id
	 		 	})
	 		//console.log("FRIEND IDS: " + friendIds)

			var fbFriendNodes = this.props.data.fbFriends.map((friend) => {
			return (
					<FacebookFriend name={ friend.username }
									picUrl={ friend.facebookProfilePic }
									id={ friend._id }
									friends={ friendIds }
									key={ friend._id } />
				)
		})
	 }
		return (
			<div className="fbFriendList">
				{ fbFriendNodes }
			</div>
			)
		}
	}

export default class AddFriendsBox extends Component {
	constructor(props) {
		super(props)
		//this.state = { data: {} }
		this.state = {facebookFriends: [], friends: []}
		this.loadDataFromServer = this.loadDataFromServer.bind(this)
	}

	loadDataFromServer() {
		$.ajax({
			url: config.apiUrl + 'importFriends',
			dataType: 'jsonp',
			cache: false,
			xhrFields: {withCredentials: true},
			success: (data) => {
				this.setState({data: data})
				//console.log("DATA FROM SERVER: ")
				//console.log(data)
			},
			error: (xhr, status, err) => {
				console.log(this.url, status, err.toString())
			}

		})
	}
	onAddFile(res){
    var newFile = {
      id:uuid(),
      name:res.file.name,
      size: res.file.size,
      altText:'',
      caption: '',
      file:res.file,
      url:res.imageUrl
    };
    this.executeAction(newImageAction, newFile);
  }

	componentDidMount() {
		this.loadDataFromServer()
	}
	render() {
		return (
			<div style={{'margin-top': '100px'}}>
				<h6>The following Facebook Friends are on Shit List:</h6>
				<p>Add or remove them from your group.</p>
				<div id="importFriends">
					<FacebookFriendsList data={this.state.data} />
				</div>
			</div>
			)
	}	
}