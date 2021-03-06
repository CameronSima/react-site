// import React, { Component } from 'react'
// import ReplyModal from './ReplyModal'

// var _ = require('lodash')

// var config = require('../../config')
// var helpers = require('../../helpers')


// var Comment = React.createClass({
//   getInitialState: function() {
//     return { vote: '', likesCount: 0 }
//   },
//   sendLikeToServer: function(thread_id, vote) {
//     if (this.state.vote === vote) {
//       return
//     }
//     $.ajax({
//       url: config.apiUrl + vote + '/comment/' + thread_id,
//       xhrFields: { withCredentials: true },
//       type: 'POST',
//       dataType: 'json',
//       cache: false,
//       //data: {thread_id: thread_id},
//       success: (data) => {
//         this.setState({likesCount: data})
//       },
//       error: (xhr, status, err) => {
//         console.log(this.url, status, err.toString())
//       }
//     })
//   },

//   render: function () {

//     return (
//     <div className="comment" style={this.props.style}>
//     <span>
//       <a className="commentAuthor">{ this.props.author.username }</a>
//        { ' ' + this.props.text }
//     </span>
//     <br></br>
//     <div className="commentActions">
//       { this.props.likes }
//       <a className="dislikeLink" 
//          onClick={ () => { this.sendLikeToServer(this.props.id, 'downvote')} }>Dislike</a>

//       <a className="likeLink" 
//          onClick={ () => { this.sendLikeToServer(this.props.id, 'upvote')} }>Like</a>

//       <ReplyModal OP={ this.props.author.username } 
//                   thread={ this.props.threadId }
//                   parent={ this.props.id }
//                   onCommentSubmit={ this.props.onCommentSubmit } />

//       <span className="timestamp">{ helpers.formatDate(this.props.date).relative }</span>
//     </div>
//     <div className="replies">
//       <CommentList comments={ this.props.replies } 
//                    threadId={ this.props.threadId }
//                    onCommentSubmit={ this.props.onCommentSubmit } />
//     </div>
//     </div>
//     )
//   }
// })

// var CommentList = React.createClass({
//   render: function () {
//     var threadId = this.props.threadId
//     var onCommentSubmit = this.props.onCommentSubmit
//     if (this.props.comments) {     
//       var commentNodes = this.props.comments.map(function (comment) {
//         var depth = comment.ancestors.split('#').length - 2 
//         var even = depth % 2

//         if (even) {
//           var color = 'white'
//         } else {
//           var color = '#F1F1F1'
//         }

//         var style = {
//           backgroundColor: color
//         }
//         return (
//         <Comment threadId={ threadId }
//                  style={ style }
//                  author={ comment.author } 
//                  text={ comment.text } 
//                  likes={ comment.likes }
//                  date={ comment.date }
//                  id={ comment._id }
//                  replies={ comment.replies }
//                  key={ comment._id}
//                  onCommentSubmit={ onCommentSubmit } >
          
//             { comment.text }

//         </Comment>
//         )
//       })
//       return (
//       <div className="commentList">
//         { commentNodes }
//       </div>
//       )
//     } else {
//       return (
//         <div></div> 
//       )
//     }
//   } 
// })


// var CommentBox = React.createClass({

//     // turn flat array of comments into threaded comment array
//     buildTree: function(array, parent, tree) {
//       var self = this
//       tree = typeof parent !== 'undefined' ? tree : []
//       parent = typeof parent !== 'undefined' ? parent : { _id: 0 }

//       var replies = _.filter(array, function (child) {
//         return child.parent == parent._id
//       })

//       if (!_.isEmpty(replies)) {
//         if ( parent._id == '0' ) {
//           tree = replies
//         } else {
//           parent['replies'] = replies
//         }
//         _.each(replies, function(child) {
//           self.buildTree(array, child)
//         })
//       }
//       return tree
//   },

//   handleCommentSubmit: function (comment) {
//     var comments = this.props.comments
//     var newComments = comments.concat([comment])
//     this.setState({data: newComments})
//     $.ajax({
//       url: config.apiUrl + 'comments/',
//       dataType: 'json',
//       type: 'POST',
//       data: comment,
//       xhrFields: { withCredentials: true },
//       success: function (data) {
//         this.setState({data: data})
        
//       }.bind(this),
//       error: function (xhr, status, err) {

//         console.error(this.props.url, status, err.toString())
//       }.bind(this)
//     })
//   },
//   getInitialState: function () {
//     return {data: [] }
//   },
//     onAddFile: function(res){
//       this.setState({imageUrl: res.imageUrl})
//       console.log(res)
//     var newFile = {
//       id:res.file.name,
//       name:res.file.name,
//       size: res.file.size,
//       altText:'',
//       caption: '',
//       file:res.file,
//       url:res.imageUrl
//     };
//     //this.executeAction(newImageAction, newFile);
//   },

//   render: function () {
//     //console.log(this.props.comments)

//     var threadedComments = this.buildTree(this.props.comments)
//     console.log(threadedComments)
//     return (
//     <div className="commentBox">
      
//       <CommentList threadId={ this.props.threadId } 
//                    comments={ threadedComments }
//                    onCommentSubmit={ this.handleCommentSubmit } />

//       <CommentForm threadId={ this.props.threadId } 
//                    onCommentSubmit={ this.handleCommentSubmit } />
//     </div>
//     )
//   }
// })

// var CommentForm = React.createClass({
//   getInitialState: function () {
//     return { text: '' }
//   },
//   handleTextChange: function (e) {
//     this.setState({text: e.target.value})
//   },
//   handleSubmit: function (e) {
//     e.preventDefault()
//     var text = this.state.text.trim()
//     var id = this.props.threadId
//     if (!text || !id) {
//       return
//     }
//     this.props.onCommentSubmit({ text: text, thread: id })
//     this.setState({ text: ''})
//   },
//   render: function () {
//     return (
//     <form className="commentForm" onSubmit={this.handleSubmit}>
//       <textarea rows='2' cols='48'
//         className="replyInput"
//         type="text"
//         placeholder="Comment"
//         value={this.state.text}
//         onChange={this.handleTextChange} />
//       <input className="replyButton" type="submit" value="Post" />
//     </form>
//     )
//   }
// })


// module.exports = CommentBox