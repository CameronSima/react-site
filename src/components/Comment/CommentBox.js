import React from 'react'
import CommentList from './CommentList'
import CommentForm from './CommentForm'

var config = require('../../../config')

var _ = require('lodash')


var CommentBox = React.createClass({

    // turn flat array of comments into threaded comment array
    buildTree: function(array, parent, tree) {
      var self = this
      tree = typeof parent !== 'undefined' ? tree : []
      parent = typeof parent !== 'undefined' ? parent : { _id: 0 }

      var replies = _.filter(array, function (child) {
        return child.parent == parent._id
      })

      if (!_.isEmpty(replies)) {
        if ( parent._id == '0' ) {
          tree = replies
        } else {
          parent['replies'] = replies
        }
        _.each(replies, function(child) {
          self.buildTree(array, child)
        })
      }
      return tree
  },

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
    onAddFile: function(res){
      this.setState({imageUrl: res.imageUrl})
    var newFile = {
      id:res.file.name,
      name:res.file.name,
      size: res.file.size,
      altText:'',
      caption: '',
      file:res.file,
      url:res.imageUrl
    };
    //this.executeAction(newImageAction, newFile);
  },

  render: function () {
    //console.log(this.props.comments)

    var threadedComments = this.buildTree(this.props.comments)
    return (
    <div className="commentBox">
      
      <CommentList threadId={ this.props.threadId } 
                   comments={ threadedComments }
                   onCommentSubmit={ this.handleCommentSubmit } />

      <CommentForm threadId={ this.props.threadId } 
                   onCommentSubmit={ this.handleCommentSubmit } />
    </div>
    )
  }
})

module.exports = CommentBox