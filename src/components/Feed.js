import React, { Component } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'

import { NavButtonList } from './NavButtons'
import { NavButton } from './NavButtons'
import DropdownBox from './Dropdown'
import Menu from './Menu'
import CommentsBox from './Comments'
import ReplyModal from './ReplyModal'

var config = require('../../config')
var helpers = require('../../helpers')
var buttonObs = require('../../buttons')

class Thread extends Component {
  constructor(props) {
    super(props)
    this.state = { vote: '', likes: this.props.initialLikes }
    this.sendLikeToServer = this.sendLikeToServer.bind(this)
    this.setRelativeDate = this.setRelativeDate.bind(this)
    this.setObjectiveDate = this.setObjectiveDate.bind(this)
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
      url: config.apiUrl + vote + '/thread/' + thread_id,
      xhrFields: { withCredentials: true },
      type: 'POST',
      dataType: 'json',
      cache: false,
      //data: {thread_id: thread_id},
      success: (likes) => {
        console.log(likes)
        this.setState({ likes: likes})
      },
      error: (xhr, status, err) => {
        console.log(this.url, status, err.toString())
      }
    })
  }

  toggleModal() {
    <Modal isOpen={this.state.modalIsOpen} onCancel={this.toggleModal} backdropClosesModal>
  <ModalHeader text="Lots of text to show scroll behavior" showCloseButton onClose={this.toggleModal} />
  <ModalBody>[...]</ModalBody>
  <ModalFooter>
    <Button type="primary" onClick={this.toggleModal}>Close modal</Button>
    <Button type="link-cancel" onClick={this.toggleModal}>Also closes modal</Button>
  </ModalFooter>
</Modal>
  }

  setObjectiveDate(e) {
    console.log(e.target.innerHTML)
    e.target.innerHTML = helpers.formatDate(this.props.date).objective
  }

  setRelativeDate(e) {
    e.target.innerHTML = helpers.formatDate(this.props.date).relative
  }



  render() {
    return (
      <div className="thread">
        <div className="dateOuter">
          <div className="date" onMouseOver={ this.setObjectiveDate } 
                                onMouseLeave={this.setRelativeDate } >
            { helpers.formatDate(this.props.date).relative }
          </div>
        </div>
        <div>Dear </div> &nbsp;
        <h4 className="threadVictim"> {this.props.victim}, </h4>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
        <p>signed,</p>
        <div>
          {this.props.author} and 
          <a onClick={this.toggleModal}> { this.props.included.length } others. </a>

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
          { this.state.likes }
        </div>
        <div>
          <CommentsBox threadId={ this.props.id }
                       comments={ this.props.comments }
                        />
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
                  comments={ thread.comments }
                  date={ thread.date }
                  author={ thread.author } 
                  included={ thread.included }
                  initialLikes={ thread.likes } 
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
        <DropdownBox data={this.state.includedSuggestions} 
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

