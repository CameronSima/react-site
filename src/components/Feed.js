import React, { Component } from 'react'

import NavButtonList from './NavButtons'

var config = require('../../config')

class Thread extends Component {
  rawMarkup() {
    var rawMarkup = marked(this.props.children.toString(), { sanitize: true })
    return {__html: rawMarkup }
  }

  render() {
    return (
      <div className="thread">
        <h4 className="threadVictim">Dear {this.props.victim}: </h4>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
        <p>signed,</p>
        <div>{this.props.author} and {this.props.ct} others.</div>
        <hr></hr>
      </div>
      )
  }
}

class ThreadList extends Component {
  render() {
    var threadNodes
    if (this.props.data) {
      var threadNodes = this.props.data.map(function (thread) {
        return (
          <Thread victim={ thread.victim } author={ thread.author } ct={ thread.included.length } key={ thread._id }>
            { thread.text }
          </Thread>
        )
      })
    }
    return (
      <div className="threadList">
        { threadNodes }
      </div>
      )
  }
}

class SuggestionsBox extends Component {
  constructor(props) {
    super(props)
    this.state = { tagged: [] }
    this.populate = this.populate.bind(this)
  }
  populate(e) {
    var tagged = this.state.tagged

    // Prevent duplicates in tagged array
    if (tagged.indexOf(e.target.innerHTML) === -1) {
      tagged.push(e.target.innerHTML)
      this.setState({tagged: tagged})
      this.props.handleTagged(this.state.tagged)
    }
    this.props.clearState('included')
    this.props.clearState('includedSuggestions')
  }
  render() {
    var suggestions
    if (this.props.suggestions) {
      suggestions = this.props.suggestions.map((friend) => {
        return (
          <div className="friendSuggestion" onClick={ this.populate } key={ friend.id }>
            <a>{ friend.name }</a>
            <hr></hr>
          </div>
          )
      })
    }
    return (
      <div id="suggestions">
        { suggestions }
        <SuggestedFriends taggedFriends={ this.state.tagged } />
      </div>
      )
  }
}

class SuggestedFriends extends Component {
  constructor(props) {
    super(props) 
  }
  render() {
    return (
      <button className="btn btn-primary" id="taggedButton" type="button">
        Tagged <span className="badge"> { this.props.taggedFriends.length } </span>
      </button>
      )
  }
}

var ThreadForm = React.createClass({
  getInitialState: function () {
    return {author: '', 
            text: '', 
            included: '',
            includedArr: [],
            includedSuggestions: '',
            victim: '',
            ct: ''
            }
  },
  clearState: function (field) {
    this.setState({[field]: ''})
  },
  handleTextChange: function (e) {
    this.setState({text: e.target.value})
  },
  handleIncludedChange: function (e) {
    this.setState({included: e.target.value})

    // Predictive friend selection
    var includedSuggestions = this.props.friends.filter((friend) => {
      return friend.name.toLowerCase().indexOf(e.target.value.toLowerCase()) === 0 && e.target.value.length > 0
    })
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
    var text = this.state.text.trim()
    var includedArr = this.state.includedArr
    var victim = this.state.victim.trim()
    if (!text || includedArr.length < 1 || !victim) {
      return
    }
    this.props.onThreadSubmit({ 
                                text: text, 
                                included: includedArr,
                                victim: victim
                              })
    this.setState({
                  text: '', 
                  included: '',
                  victim: '',
                  })
  },
  render: function () {
    return (
    <div id="threadInputs">
      <form className="threadForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Say something..."
          value={this.state.text}
          onChange={this.handleTextChange} />
        <input
          type="text"
          placeholder="Name your victim"
          value={this.state.victim}
          onChange={this.handleVictimChange} />
        <input
          type="text"
          placeholder="Who can see?"
          value={this.state.included}
          onChange={this.handleIncludedChange} />
        <input type="submit" value="Post" />
      </form>
      <SuggestionsBox suggestions={this.state.includedSuggestions} 
                      handleTagged={this.handleTagged} 
                      clearState={this.clearState} />
    </div>
    )
  }
})

var ThreadsBox = React.createClass({
  handleThreadSubmit: function (thread) {
    console.log(typeof thread)
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
        this.setState({feed: feed})
      }.bind(this),
      error: function (xhr, status, err) {
        this.setState({data: threads})
        console.log(this.url, status, err.toString())
      }.bind(this)
    })
  },
  getInitialState: function () {
    return {feed: []}
  },
  render: function () {
    // console.log("PROPS FROM FEED")
    // console.log(this.props.data)
    return (
    <div className="threadsBox">
      <div className="feedNav">
        <NavButtonList buttons={ ['home', 'heat']} />
      </div>
      <ThreadList data={ this.props.feed } />
      <ThreadForm onThreadSubmit={ this.handleThreadSubmit } 
                  friends={ this.props.friends } />
    </div>
    )
  }
})

module.exports = ThreadsBox
