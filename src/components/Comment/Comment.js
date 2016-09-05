import React from 'react'
import CommentList from './CommentList'
import ReplyModal from '../Modal/ReplyModal'

var helpers = require('../../helpers')
var config = require('../../../config')

var Comment = React.createClass({
  getInitialState: function() {
    return { vote: '', likesCount: 0 }
  },
  sendLikeToServer: function(thread_id, vote) {
    if (this.state.vote === vote) {
      return
    }
    $.ajax({
      url: config.apiUrl + vote + '/comment/' + thread_id,
      xhrFields: { withCredentials: true },
      type: 'POST',
      dataType: 'json',
      cache: false,
      //data: {thread_id: thread_id},
      success: (data) => {
        this.setState({likesCount: data})
      },
      error: (xhr, status, err) => {
        console.log(this.url, status, err.toString())
      }
    })
  },

  render: function () {

    return (
    <div className="comment" style={this.props.style}>
    <span>
      <a className="commentAuthor">{ this.props.author.username }</a>
       { ' ' + this.props.text }
    </span>
    <br></br>
    <div className="commentActions">
      { this.props.likes }
      <a className="dislikeLink" 
         onClick={ () => { this.sendLikeToServer(this.props.id, 'downvote')} }>Dislike</a>

      <a className="likeLink" 
         onClick={ () => { this.sendLikeToServer(this.props.id, 'upvote')} }>Like</a>

      <ReplyModal OP={ this.props.author.username } 
                  thread={ this.props.threadId }
                  parent={ this.props.id }
                  onCommentSubmit={ this.props.onCommentSubmit } />

      <span className="timestamp">{ helpers.formatDate(this.props.date).relative }</span>
    </div>
    <div className="replies">
      <CommentList comments={ this.props.replies } 
                   threadId={ this.props.threadId }
                   onCommentSubmit={ this.props.onCommentSubmit } />
    </div>
    </div>
    )
  }
})

module.exports = Comment