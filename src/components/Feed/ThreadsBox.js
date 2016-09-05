import React from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'

import ThreadList from './ThreadList'
import ThreadForm from './ThreadForm'
import Menu from '../Utility/Menu'

var config = require('../../../config')
var helpers = require('../../helpers')


var ThreadsBox = React.createClass({
  handleThreadSubmit: function (thread) {
    var threads = this.props.feed
    var newThreads = threads.concat([thread])
    this.setState({feed: newThreads})
    $.ajax({
      url: config.apiUrl + 'threads',
      dataType: 'json',
      type: 'POST',
      data: thread,
      xhrFields: {withCredentials: true},
      success: function (data) {
        // this.setState({feed: feed})
      }.bind(this),
      error: function (xhr, status, err) {
        this.setState({data: threads})
        console.log(this.url, status, err.toString())
      }.bind(this)
    })
  },
  // Feed nav buttons default to order by date;
  // Feed type defaults to all
  getInitialState: function () {
    return {feed: [], sortFunc: helpers.orderByDate }
  },

  setFeedType: function(feedType) {
    //console.log(feedType)
    this.props.setFeedType(feedType)
  },
  componentDidMount: function() {

  },

  // TODO: replace custom navbuttons with react-bootstrap buttons
  render: function() {
    return (
    <div className="threadsBox">
      <ThreadForm friends={this.props.friends}
                  onThreadSubmit={ this.handleThreadSubmit }/>
      <div className="feedNav">
        <Menu items={ ['ALL', 'I SAID', 'THEY SAID', 'I TAGGED'] }
              menuEventFunc={ this.setFeedType }
         />


        <ButtonGroup>
          <Button onClick={ () => { this.setState({'sortFunc': helpers.orderByDate}) }}>Home</Button>
          <Button onClick={ () => { this.setState({'sortFunc': helpers.orderByHot}) }}>Heat</Button>
        </ButtonGroup>
      </div>
      <ThreadList data={ this.props.feed }
                  sortFunc={ this.state.sortFunc } />
    </div>
    )
  }
})

module.exports = ThreadsBox