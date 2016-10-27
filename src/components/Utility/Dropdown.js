import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'

import TaggedModal from '../Modal/TaggedModal'
import TaggedButton from '../Button/TaggedButton'
import AddRemoveFriendBox from '../Utility/AddRemoveFriendBox'

var helpers = require('../../helpers')

export default class DropdownBox extends Component {
  constructor(props) {
    super(props)
    //this.state = { tagged: [] }
    this.populate = this.populate.bind(this)
    this.getModalItems = this.getModalItems.bind(this)
    this.getModalTrigger = this.getModalTrigger.bind(this)
  }
  populate(item) {
  // Prevent duplicates in tagged array
    var tagged = this.props.includedArr.filter(function(obj) {
      return obj.id !== item.id
    })
    tagged.push(item)
    //this.setState({tagged: tagged})
    this.props.handleTagged(tagged)

    this.props.clearState('included')
    this.props.clearState('includedSuggestions')
  }

  getModalTrigger() {
    return(
      <TaggedButton title={ this.props.title }
                    tagged={this.props.includedArr } />
    )
  }

  // prepare array of components to pass to taggedmodal
  getModalItems() {
    // build array of tagged and untagged, removing duplicates
    var self = this
    var unTagged = _.filter(self.props.allFriendsArr, function(friend) {
      _.each(self.props.includedArr, function(tagged) {
        return friend._id !== tagged._id
      })
    })
    var friendArr = this.props.includedArr.concat(unTagged)
    var friendsComponents = _.map(friendArr, function(friend) {
      var clickedFunc, buttonText
      // friends not tagged will have their facebook profile name
      // attached to their user object, tagged ones won't
      if (friend.facebookName) {
        clickedFunc = self.props.handleTagged
        buttonText = 'ADD'
      } else {
        clickedFunc = self.props.handleUntagged
        buttonText = 'REMOVE'
      }
      return (
        <AddRemoveFriendBox friend={friend}
                            buttonText={buttonText}
                            clickedFunc={clickedFunc}
                            clickedFuncParam={friend}
                            key={friend.id} />
        )
    })
    return friendsComponents
  }

  render() {
    var suggestions
    if (this.props.data) {
      suggestions = this.props.data.map((friend) => {
        var itemObj = {
                        'id': friend._id, 
                        'name': friend.facebookName,
                        'facebookProfilePic': friend.facebookProfilePic
                      }
        return (
            <div className="suggestedItem" onClick={ this.populate.bind(this, itemObj) } 
                                           key={ friend._id }>
              <a>{ friend.facebookName }</a>
              <hr></hr>
          </div>
          )
      })
    }
              
    return (
      <div id="suggestions">
        <div id="suggestionsList">
          { suggestions }
        </div>

        {/* 
        If no title is supplied, don't display a button.
        Used for simple dropdown that doesn't store selected
        items and just displays data.
        */}
        { 
          this.props.title && 
            <TaggedModal  
                        modalTrigger={this.getModalTrigger()}
                        friendsComponents={this.getModalItems()} />
        }
      </div>
      )
  }
}

