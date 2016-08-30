import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'

import TaggedModal from './TaggedModal'

var helpers = require('../../helpers')

export default class DropdownBox extends Component {
  constructor(props) {
    super(props)
    //this.state = { tagged: [] }
    this.populate = this.populate.bind(this)
  }
  populate(item) {
  //   // Prevent duplicates in tagged array
    var tagged = this.props.includedArr.filter(function(obj) {
      return obj.id !== item.id
    })
    tagged.push(item)
    //this.setState({tagged: tagged})
    this.props.handleTagged(tagged)

    this.props.clearState('included')
    this.props.clearState('includedSuggestions')
  }

   render() {
    var suggestions
    if (this.props.data) {
      suggestions = this.props.data.map((friend) => {
        var itemObj = {'id': friend.id, 'name': friend.name}
        return (
            <div className="suggestedItem" onClick={ this.populate.bind(this, itemObj) } 
                                              key={ friend.id }>
              <a>{ friend.name }</a>
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
                          tagged={ this.props.includedArr }
                          title={ this.props.title } />

        }
      </div>
      )
  }
}

