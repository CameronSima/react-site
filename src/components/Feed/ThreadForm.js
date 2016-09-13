import React from 'react'
import { Button } from 'react-bootstrap'

import DropdownBox from '../Utility/Dropdown'
import DragDropFile from '../Utility/DragDropFile'

const helpers = require('../../helpers')
const _config = require('../../../config')
const async = require('async')

var ThreadForm = React.createClass({
  getInitialState: function () {
    return {
            text: '', 
            included: '',
            includedArr: [],
            includedSuggestions: [],
            showPreview: false,
            showDelete: false,
            victim: '',
            ct: '',
            anonymous: '',
            imageUrl: '',
            image: ''
            }
  },

  onAddFile: function(res){
    this.state.showPreview = true
    this.setState({imageUrl: res.imageUrl,
                   image: res })
  },
  clearState: function (field) {
    this.setState({[field]: ''})
  },
  handleTextChange: function (e) {
    this.setState({text: e.target.value})
  },
  handleAnonSubmit: function (e) {
    this.setState({anonymous: e.target.value})
  },
  handleIncludedChange: function (e) {
    this.setState({included: e.target.value})

    // Predictive friend selection
    var includedSuggestions = helpers.suggestItems(this.props.friends, e.target.value)
    this.setState({includedSuggestions: includedSuggestions})
  },
  handleVictimChange: function (e) {
    this.setState({victim: e.target.value})
  },
  handleTagged: function (tagged) {
    this.setState({includedArr: tagged})
  },
  handleSubmit: function (e) {
    e.preventDefault()

    if (this.state.imageUrl != '') {
    }
    var anonymous = this.state.anonymous
    var text = this.state.text.trim()
    var includedArr = this.state.includedArr
    var victim = this.state.victim.trim()
    if (!text || includedArr.length < 1 || !victim) {
      return
    }

    var thread = { 
                  text: text, 
                  included: includedArr,
                  victim: victim,
                  anonymous: anonymous,
                }

    if (this.state.imageUrl != '') {
    this.props.onFileSubmit(this.state.image, thread)
    } else {
      this.props.onThreadSubmit(thread)
    }
    this.setState({
              text: '', 
              included: '',
              victim: '',
              includedArr: [],
              includedSuggestions: [],
              anonymous: '',

              }) 
    this.removePhoto()
  },

  removePhoto: function() {
    this.state.showPreview = false
    this.setState({ imageUrl: '' })
  },

  render: function () {
      var previewStyle = {
            backgroundImage: 'url(' + this.state.imageUrl + ')'
        }

    return (
    <div id="threadInputs">
      <div className="submitActions">
      
      <DragDropFile onDrop={this.onAddFile}>
        <Button>
          <img className='icon-camera' 
               src='src/assets/icon-camera.png' 
                />
        </Button>
      </DragDropFile>

        </div>
      <form className="threadForm" onSubmit={this.handleSubmit}>

        { this.state.showPreview && 
          <div>
            <div className='upload_preview' style={previewStyle} >
              <img className='delete' src='src/assets/minus.png' onClick={()=> this.removePhoto()}/>
            </div>
          </div>
        }

        <textarea 
          ref="comment"
          rows='1'
          cols='48'
          className="textInput"
          type="text"
          placeholder="Write:"
          value={this.state.text}
          onChange={this.handleTextChange} />

        <input
          className="textInput"
          type="text"
          placeholder="To:"
          value={this.state.victim}
          onChange={this.handleVictimChange} />
        <input
          className="textInput"
          type="text"
          placeholder="Tag:"
          value={this.state.included}
          onChange={this.handleIncludedChange} />
        <br></br>
        <DropdownBox data={this.state.includedSuggestions}
                     includedArr={this.state.includedArr} 
                     handleTagged={this.handleTagged} 
                     title={ 'TAGGED' }
                     clearState={this.clearState} />
        
        <input type="radio" 
               name="anonymity" 
               onChange={this.handleAnonSubmit} 
               value="anonymous" />Anonymous
        <br></br>

        <input type="radio" 
               name="anonymity" 
               onChange={this.handleAnonSubmit} 
               value="use real name" />Real name
        <br></br>

        <input type="submit" value="Post" />
      </form>
    </div>
    )
  }
})

module.exports = ThreadForm