import React, { Component } from 'react';

var config = require('../../config')

class Thread extends Component {
  rawMarkup() {
    var rawMarkup = marked(this.props.children.toString(), { sanitize: true })
    return {__html: rawMarkup }
  }

  render() {
    return (
      <div className="thread">
        <h2 className="threadAuthor">Dear {this.props.author}: </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
      )
  }
}

class ThreadList extends Component {
  render() {
    var threadNodes = this.props.data.map(function (thread) {
      return (
        <Thread author={ thread.author } key={ thread._id }>
          { thread.text }
        </Thread>
      )
    })
    return (
      <div className="threadList">
        { threadNodes }
      </div>
      )
  }
}

var ThreadForm = React.createClass({

  getInitialState: function () {
    return {author: '', 
            text: '', 
            included: '',
            victim: '',
            }
  },
  handleAuthorChange: function (e) {
    this.setState({author: e.target.value})
  },
  handleTextChange: function (e) {
    this.setState({text: e.target.value})
  },
  handleIncludedChange: function (e) {
    this.setState({included: e.target.value})
  },
  handleVictimChange: function (e) {
    this.setState({victim: e.target.value})
  },
  handleSubmit: function (e) {
    e.preventDefault()
    var author = this.state.author.trim()
    var text = this.state.text.trim()
    var included = this.state.included.trim()
    var victim = this.state.victim.trim()
    if (!text || !author || !included || !victim) {
      return
    }
    this.props.onThreadSubmit({author: author, 
                                text: text, 
                                included: included,
                                victim: victim
                              })
    this.setState({author: '', 
                  text: '', 
                  included: '',
                  victim: ''
                  })
  },
  render: function () {
    return (
    <form className="threadForm" onSubmit={this.handleSubmit}>
      <input
        type="text"
        placeholder="Your name"
        value={this.state.author}
        onChange={this.handleAuthorChange} />
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
    )
  }
})

var ThreadsBox = React.createClass({
  loadThreadsFromServer: function () {
    console.log(this.state.pollInterval)
    $.ajax({
      url: config.apiUrl + 'threads',
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({data: data})
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.url, status, err.toString())
      }.bind(this)
    })
  },
  handleThreadSubmit: function (thread) {
    console.log(this.state.pollInterval)
    var threads = this.state.data
    var newThreads = threads.concat([thread])
    this.setState({data: newThreads})
    $.ajax({
      url: config.apiUrl + 'threads',
      dataType: 'json',
      type: 'POST',
      data: thread,
      success: function (data) {
        this.setState({data: data})
      }.bind(this),
      error: function (xhr, status, err) {
        this.setState({data: threads})
        console.error(this.url, status, err.toString())
      }.bind(this)
    })
  },
  getInitialState: function () {
    return {data: [],
            pollInterval: config.pollInterval}
  },
  componentDidMount: function () {
    this.loadThreadsFromServer()
    setInterval(this.loadThreadsFromServer, config.pollInterval)
  },
  componentWillUnmount: function () {
    this.state.pollInterval = false;
  },
  render: function () {
    return (
    <div className="threadsBox">
      <h1>Feed</h1>
      <ThreadList data={ this.state.data } />
      <ThreadForm onThreadSubmit={ this.handleThreadSubmit } />
    </div>
    )
  }
})

module.exports = ThreadsBox
