import React from 'react'
import Comment from './Comment'

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