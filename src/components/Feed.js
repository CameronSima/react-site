import React, { Component } from 'react'

import {NavButtonList} from './NavButtons'
import {NavButton} from './NavButtons'

var config = require('../../config')
var helpers = require('../../helpers')
var buttonObs = require('../../buttons')

class Thread extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initialVoteCount: this.props.likes - this.props.dislikes,
      vote: ''
    }
    this.sendLikeToServer = this.sendLikeToServer.bind(this)
  }
  rawMarkup() {
    var rawMarkup = marked(this.props.children.toString(), { sanitize: true })
    return {__html: rawMarkup }
  }

  sendLikeToServer(thread_id, vote) {
    if (this.state.vote === vote) {
      return
    }
    $.ajax({
      url: config.apiUrl + vote,
      xhrFields: {withCredentials: true},
      type: 'POST',
      dataType: 'json',
      cache: false,
      data: {thread_id: thread_id},
      success: (data) => {
        this.setState({likesCount: data})
      },
      error: (xhr, status, err) => {
        console.log(this.url, status, err.toString())
      }
    })
    if (vote === 'upvote') {
      this.setState({initialVoteCount: this.state.initialVoteCount += 1,
                     vote: vote})
    } else {
      this.setState({initialVoteCount: this.state.initialVoteCount -= 1,
                     vote: vote})
    }
  }

  formatDate(dateTime) {
    // Date is saved to db in GMT, format for local timezone
    var dateArr = new Date(dateTime).toLocaleString().split(' ')
    var date = dateArr[0].slice(0, -1)
    var time = dateArr[1].split(':').slice(0, 2).join(':')
    var maridiem = dateArr[2].toLowerCase()
    return (
      date + ' at ' + time + maridiem
      )
  }

  render() {
    console.log(this.state.InitialVoteCount)
    return (
      <div className="thread">
        <div className="date">
          { this.formatDate(this.props.date) }
        </div>
        <div>Dear </div> &nbsp;
        <h4 className="threadVictim"> {this.props.victim}, </h4>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
        <p>signed,</p>
        <div>
          {this.props.author} and {this.props.ct} others.
        </div>
        <NavButton divId="like-button" 
                   title="like"
                   eventFunc={ this.sendLikeToServer }
                   state={ this.props.id }
                   value={ "upvote" } />

        <NavButton divId="dislike-button" 
                   title="dislike"
                   eventFunc={ this.sendLikeToServer }
                   state={ this.props.id }
                   value={ "downvote" } />          

        <div className="likeTotal">
          {this.state.initialVoteCount}
        </div>
        <div>
          <input type="text" placeholder="Comment..." />
        </div>
        <hr></hr>
      </div>
      )
  }
}

class ThreadList extends Component {
  render() {
    var threadNodes, sortedFeed
    if (this.props.data) {
      // sort feed list before rendering components
      var sortedFeed = this.props.sortFunc(this.props.data)
      
      var threadNodes = sortedFeed.map(function (thread) {
        return (
          <Thread victim={ thread.victim } 
                  date={ thread.date }
                  author={ thread.author } 
                  ct={ thread.included.length }
                  likes={ thread.likes } 
                  dislikes={ thread.dislikes }
                  id={ thread._id}
                  key={ thread._id }>
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
  populate(friendId) {
    var tagged = this.state.tagged

    // Prevent duplicates in tagged array
    if (tagged.indexOf(friendId) === -1) {
      tagged.push(friendId)
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
            <div className="friendSuggestion" onClick={ this.populate.bind(this, friend.id) } 
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
    return {
            text: '', 
            included: '',
            includedArr: [],
            includedSuggestions: '',
            victim: '',
            ct: '',
            anonymous: ''
            }
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
    var includedSuggestions = helpers.suggestFriends(this.props.friends, e.target.value)
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
                  anonymous: ''
                  })
  },
  render: function () {
    return (
    <div id="threadInputs">
      <form className="threadForm" onSubmit={this.handleSubmit}>
        <input
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
        <SuggestionsBox suggestions={this.state.includedSuggestions} 
                handleTagged={this.handleTagged} 
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
  // Feed nav buttons default to order by date
  getInitialState: function () {
    return {feed: [], sortFunc: helpers.orderByDate}
  },

  changeState: function (state, value) {
    this.setState({[state]: value})
  },

  render: function () {
    return (
    <div className="threadsBox">
      <ThreadForm friends={this.props.friends}
                  onThreadSubmit={ this.handleThreadSubmit }/>
      <div className="feedNav">
        <NavButtonList divId={"feedNav"}
                       eventFunc={this.changeState} 
                       state={"sortFunc"} 
                       buttons={buttonObs.mainNavButtons} />
      </div>
      <ThreadList data={ this.props.feed }
                  sortFunc={ this.state.sortFunc } />

    </div>
    )
  }
})


module.exports = ThreadsBox

