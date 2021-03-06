import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'

var config = require('../../../config')

export default class ReplyModal extends Component {
	constructor(props) {
		super(props)
		this.state = { showModal: false, text: '', data: [] }
		this.close = this.close.bind(this)
		this.open = this.open.bind(this)
		this.sendComment = this.sendComment.bind(this)
		this.handleTextChange = this.handleTextChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
  
	}
	close() {
		this.setState({ showModal: false })
	}
	open() {
		this.setState({ showModal: true })
	}
  sendComment(comment) {
    var comments = this.state.data
    // Optimistically set an id on the new comment. It will be replaced by an
    // id generated by the server. In a production application you would likely
    // not use Date.now() for this and would have a more robust system in place.
    // comment.id = Date.now()
    var newComments = comments.concat([comment])
    this.setState({data: newComments})
    $.ajax({
      url: config.apiUrl + 'comments/',
      dataType: 'json',
      type: 'POST',
      data: comment,
      xhrFields: { withCredentials: true },
      success: function (data) {
        //this.setState({data: data})

      },
      error: function (xhr, status, err) {
        //this.setState({data: comments})
        //console.log(data)
        console.error(this.props.url, status, err.toString())
      }
    })
  }
  handleTextChange(e) {
  	this.setState({ text: e.target.value })
  }
  handleSubmit(e) {
  	e.preventDefault()
  	var text = this.state.text.trim()
  	if (!text) {
  		return
  	} else {
  		this.props.onCommentSubmit({ text: text, 
  											 parent: this.props.parent, 
  											 thread: this.props.thread })
  		
  		this.setState({ text: '' })
  		this.close()
  	}
  }
	render() {
		return (
			<div className="replyLink">
				<a onClick={ this.open }>Reply</a>
				<Modal show={ this.state.showModal } onHide={ this.close }>
					<Modal.Dialog>
						<Modal.Header>
							<p className='modalTitle'> Reply to { this.props.OP }'s comment: </p>
						</Modal.Header>

						<Modal.Body>
							<textarea rows="4" cols="61" value={ this.state.text } onChange={ this.handleTextChange }>
							</textarea>

						</Modal.Body>

						<Modal.Footer>
							<a className="replyLink" onClick={ this.handleSubmit }>Reply</a>
							<a className="closeLink" onClick={ this.close }>Close</a>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal>
			</div>
		)
	}
}