import React, { Component } from 'react'

import ReplyModal from './ReplyModal'

var config = require('../../config')
var helpers = require('../../helpers')

// class Reply  extends Component {
//   render() {
//     return (
//       <div className="reply">
        
//         <Comment threadId={ this.props.thread }
//                  author={ this.props.reply.author } 
//                  text={ this.props.reply.text } 
//                  likes={ this.props.reply.likes }
//                  date={ this.props.reply.date }
//                  id={ this.props.reply._id }
//                  replies={ this.props.reply.children }
//                  key={ this.props.reply._id} />
//         <RepliesList replies={this.props.reply.children} />
    
//       </div>
//       )
//   }
// }

// class RepliesList extends Component {
//   constructor(props) {
//     super(props)
//   }

//   render() {
//     var thread = this.props.thread
//     var replies = this.props.replies.map(function(reply) {
//       console.log(reply)
//       return (
//         <div>
//           <Reply reply={ reply } 
//                  thread={ thread } 
//                  key={ reply._id } />
//         </div>
//         )
// })
//     return (
//       <div className="repliesList" key={ thread + '_replies'}>
//         { replies }
//       </div>
//     )
//   }
// }

//TODO: just recurse with comment / commentList components,
// no need for a separate replies component when all it does is
// render comment components


var Comment = React.createClass({
  getInitialState: function() {
    return {vote: '', likesCount: 0 }
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
    <div className="comment">
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
                  parent={ this.props.id } />

      <span className="timestamp">{ helpers.formatDate(this.props.date).relative }</span>
    </div>
    <div className="replies">
      <CommentList comments={ this.props.replies } 
                   threadId={ this.props.threadId } />
    </div>
    </div>
    )
  }
})

var CommentList = React.createClass({
  render: function () {
    var threadId = this.props.threadId
    if (this.props) {

      // use buildTree helper to turn the flat array of comments
      // into a nested object by using the .parent property

      var threadedComments = helpers.buildTree(this.props.comments)
      
      var commentNodes = threadedComments.map(function (comment) {
        //console.log(comment.children)
        return (
        <Comment threadId={ threadId }
                 author={ comment.author } 
                 text={ comment.text } 
                 likes={ comment.likes }
                 date={ comment.date }
                 id={ comment._id }
                 replies={ comment.children }
                 key={ comment._id} >
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

var CommentForm = React.createClass({
  getInitialState: function () {
    return { text: '' }
  },
  handleTextChange: function (e) {
    this.setState({text: e.target.value})
  },
  handleSubmit: function (e) {
    e.preventDefault()
    var text = this.state.text.trim()
    var id = this.props.threadId
    if (!text || !id) {
      return
    }
    this.props.onCommentSubmit({ text: text, thread: id })
    this.setState({ text: ''})
  },
  render: function () {
    return (
    <form className="commentForm" onSubmit={this.handleSubmit}>
      <input
        className="replyInput"
        type="text"
        placeholder="Comment"
        value={this.state.text}
        onChange={this.handleTextChange} />
      <input type="submit" value="Post" />
    </form>
    )
  }
})


var CommentBox = React.createClass({
  handleCommentSubmit: function (comment) {
    var comments = this.props.comments
    var newComments = comments.concat([comment])
    this.setState({data: newComments})
    $.ajax({
      url: config.apiUrl + 'comments/',
      dataType: 'json',
      type: 'POST',
      data: comment,
      xhrFields: { withCredentials: true },
      success: function (data) {
        this.setState({data: data})
        
      }.bind(this),
      error: function (xhr, status, err) {

        console.error(this.props.url, status, err.toString())
      }.bind(this)
    })
  },
  getInitialState: function () {
    return {data: [] }
  },

  render: function () {
    return (
    <div className="commentBox">
      <CommentList threadId={ this.props.threadId } 
                   comments={ this.props.comments } />

      <CommentForm threadId={ this.props.threadId } 
                   onCommentSubmit={ this.handleCommentSubmit } />
    </div>
    )
  }
})

module.exports = CommentBox