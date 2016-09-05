import React from 'react'

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
      <textarea rows='2' cols='48'
        className="replyInput"
        type="text"
        placeholder="Comment"
        value={this.state.text}
        onChange={this.handleTextChange} />
      <input className="replyButton" type="submit" value="Post" />
    </form>
    )
  }
})


module.exports = CommentForm