import React from 'react'
import { Button } from 'react-bootstrap'

import DropdownBox from '../Utility/Dropdown'
import DragDropFile from '../Utility/DragDropFile'

const Promise = require('bluebird')

const helpers = require('../../helpers')
const _config = require('../../../config')

var ThreadForm = React.createClass({
  getInitialState: function () {
    return {
            text: '', 
            included: '',
            includedArr: [],
            includedSuggestions: [],
            victim: '',
            ct: '',
            anonymous: '',
            imageUrl: ''
            }
  },
  showPreview: function(imageUrl) {

  },

  sendPic: function(pic) {
    var body = new FormData()
    body.append('userPhoto', pic.file)
    body.append('text', 'some text')
    console.log(typeof pic.file)
  
        $.ajax({
      url: _config.apiUrl + 'image',
      cache: false,
      processData: false,
      contentType: false,
      type: 'POST',
      data: body,
      xhrFields: {withCredentials: true},
      success: function (doc) {
        //this.props.addThread(thread)
      }.bind(this),
      error: function (xhr, status, err) {
        //this.setState({data: threads})
        //console.log(this.url, status, err.toString())
      }.bind(this)
    })

    // var xhr = new XMLHttpRequest()
    // xhr.open('POST', '/api/image', true)
    // xhr.onload = function() {
    //   if (xhr.status === 200) {
    //     console.log('upload complete')
    //   } else {
    //     console.log('there was an error')
    //   }
    // }
    // xhr.send(body)
  },

  onAddFile: function(res){
    this.setState({imageUrl: res.imageUrl})
    this.refs.comment.innerHTML = this.state.text + ' ' + res.imageUrl
    this.showPreview(res.imageUrl)
    console.log(res)
    var newFile = {
      id:res.file.name,
      name:res.file.name,
      //name: 'photoupload',
      size: res.file.size,
      altText:'',
      caption: '',
      file:res.file,
      url:res.imageUrl
    };
    this.sendPic(res)
    //this.executeAction(newImageAction, newFile);
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
    var anonymous = this.state.anonymous
    var text = this.state.text.trim()
    var includedArr = this.state.includedArr
    var victim = this.state.victim.trim()
    if (!text || includedArr.length < 1 || !victim) {
      return
    }
    this.props.onThreadSubmit({ 
                                text: text, 
                                included: includedArr,
                                victim: victim,
                                anonymous: anonymous
                              })
    this.setState({
                  text: '', 
                  included: '',
                  victim: '',
                  includedArr: [],
                  includedSuggestions: [],
                  anonymous: '',

                  })
  },
  render: function () {
    return (
    <div id="threadInputs">
      <div className="submitActions">
      
      <DragDropFile onDrop={this.onAddFile}>
        <Button>
          <img className='icon-camera' 
               src='src/assets/icon-camera.png' 
               onClick={()=> {console.log("OK")}} />
        </Button>
      </DragDropFile>


        </div>
      <form className="threadForm" onSubmit={this.handleSubmit}>
        <img className='upload_preview' src={this.state.imageUrl} />

        <textarea 
          ref="comment"
          rows='1'
          cols='48'
          className="textInput"
          type="text"
          placeholder="Say something..."
          value={this.state.text}
          onChange={this.handleTextChange} />

        <input
          className="textInput"
          type="text"
          placeholder="Name your victim"
          value={this.state.victim}
          onChange={this.handleVictimChange} />
        <input
          className="textInput"
          type="text"
          placeholder="Who can see?"
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