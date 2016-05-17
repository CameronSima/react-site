import React from 'react';

var config = require('../../config')

var ThreadForm = React.createClass({

  getInitialState: function () {
    return {author: '', 
            text: '', 
            included: '',
            victim: ''
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
    $.ajax({
      url: config.url,
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
    var threads = this.state.data
    var newThreads = threads.concat([thread])
    this.setState({data: newThreads})
    $.ajax({
      url: config.url,
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
    return {data: []}
  },
  componentDidMount: function () {
    this.loadThreadsFromServer()
    setInterval(this.loadThreadsFromServer, config.pollInterval)
  },
  render: function () {
    return (
    <div className="threadsBox">
      <h1>Feed</h1>
      <div>
        <ThreadForm onThreadSubmit={this.handleThreadSubmit} />
      </div>
    </div>
    )
  }
})

module.exports = ThreadsBox
