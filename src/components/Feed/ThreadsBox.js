import React from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'

import ThreadList from './ThreadList'
import ThreadForm from './ThreadForm'
import Menu from '../Utility/Menu'

var config = require('../../../config')
var helpers = require('../../helpers')


var ThreadsBox = React.createClass({
  handleThreadSubmit: function (thread) {
    this.props.addThread(thread)
    $.ajax({
      url: config.apiUrl + 'threads',
      dataType: 'json',
      type: 'POST',
      data: thread,
      xhrFields: {withCredentials: true},
      success: function (doc) {
      }.bind(this),
      error: function (xhr, status, err) {
        //this.setState({data: threads})
        //console.log(this.url, status, err.toString())
      }.bind(this)
    })
  },

  handleFileSubmit: function(file, thread) {
    var body = new FormData()
    body.append('userPhoto', file.file)
    body.append('text', 'some text')
  
    var self = this
    var xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/image', true)
    xhr.onload = function() {
      if (xhr.status === 200) {
        // needed to remove double double-quotes e.g. ""photoname""
        thread.photoName = JSON.parse(xhr.responseText)

        // make the thread submit request only when the server
        // has responded with the saved photo name
        self.handleThreadSubmit(thread)
      } else {
        return('there was an error')
      }
    }
    xhr.send(body)
  },
  
  // Feed nav buttons default to order by date;
  // Feed type defaults to all
  getInitialState: function () {
    return {feed: [], sortFunc: helpers.orderByDate }
  },

  setFeedType: function(feedType) {
    this.props.setFeedType(feedType)
  },
  componentDidMount: function() {

  },

  // TODO: replace custom navbuttons with react-bootstrap buttons
  render: function() {

    return (
    <div className="threadsBox">
      <ThreadForm friends={this.props.friends}
                  onThreadSubmit={ this.handleThreadSubmit }
                  onFileSubmit={ this.handleFileSubmit } />
      <div className="feedNav">
        <Menu items={ ['ALL', 'I SAID', 'THEY SAID', 'I TAGGED'] }
              menuEventFunc={ this.setFeedType }
         />

        <ButtonGroup>
          <Button onClick={() => {this.setState({'sortFunc': helpers.orderByDate})}}>Home</Button>
          <Button onClick={() => {this.setState({'sortFunc': helpers.orderByHot})}}>Heat</Button>
        </ButtonGroup>
      </div>
      <ThreadList data={ this.props.feed }
                  sortFunc={ this.state.sortFunc } />
    </div>
    )
  }
})

module.exports = ThreadsBox