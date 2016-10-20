import React from 'react'

import ReplyModal from '../Modal/ReplyModal'

var helpers = require('../../helpers')
var config = require('../../../config')

// Comment component combined with CommentList to prevent
// circular import because they instantiate each other
// recursively

var Comment = React.createClass({
  getInitialState: function() {
    return { vote: '', likesCount: 0, numComments: 1 }
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
  moreComments: function() {
    var newCount = this.state.numComments += 10
    this.setState({numComments: newCount})
  },
  showLessComments: function() {
    this.setState({numComments: 1})
  },
  render: function () {
    if (this.props.replies) {
      var allComments = this.props.replies
      var lessComments = allComments.slice(0, this.state.numComments)
    }
    return (
    <div className="comment" style={ this.props.style }>
      <span>
        <a className="commentAuthor">{ this.props.author.username }</a>
         { ' ' + this.props.text }
      </span>
      <br></br>
      <div className="commentActions">
        { this.props.likes }
        <a className="dislikeLink" 
           onClick={() => { this.sendLikeToServer(this.props.id, 'downvote')}}>Dislike</a>

        <a className="likeLink" 
           onClick={() => { this.sendLikeToServer(this.props.id, 'upvote')}}>Like</a>

        <ReplyModal OP={ this.props.author.username } 
                    thread={ this.props.threadId }
                    parent={ this.props.id }
                    onCommentSubmit={ this.props.onCommentSubmit } />

        <span className="timestamp">{ helpers.formatDate(this.props.date).relative }</span>
      </div>
      <div className="replies">
        <CommentList comments={ lessComments } 
                     threadId={ this.props.threadId }
                     onCommentSubmit={ this.props.onCommentSubmit } />

        {
          lessComments && lessComments.length > 0 && lessComments.length < allComments.length &&
          <a className="moreLink"
             onClick={()=> {this.moreComments()}}>&darr; More</a>
        }
        {
          lessComments && lessComments.length > 1 &&
          <a className="moreLink"
             onClick={()=> {this.showLessComments()}}>&uarr; Less</a>
        }
        
      </div>
    </div>
    )
  }
})


var CommentList = React.createClass({
  render: function () {
    var threadId = this.props.threadId
    var onCommentSubmit = this.props.onCommentSubmit
    if (this.props.comments) {     
      var commentNodes = this.props.comments.map(function (comment) {
        var depth = comment.ancestors.split('#').length - 2 
        var even = depth % 2

        if (even) {
          var color = 'white'
        } else {
          var color = '#F1F1F1'
        }

        var style = {
          backgroundColor: color
        }
        return (
        <Comment threadId={ threadId }
                 style={ style }
                 author={ comment.author } 
                 text={ comment.text } 
                 likes={ comment.likes }
                 date={ comment.date }
                 id={ comment._id }
                 replies={ comment.replies }
                 key={ comment._id}
                 onCommentSubmit={ onCommentSubmit } >
          
            { comment.text }

        </Comment>
        )
      })
      return (
      <div className="commentList">
        { commentNodes }
      </div>
      )
    } else {
      return (
        <div></div> 
      )
    }
  } 
})

module.exports = CommentList