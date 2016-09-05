import React, { Component } from 'react'

import CommentsBox from '../Comments'

var helpers = require('../../helpers')
var config = require('../../../config')

export default class Thread extends Component {
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
    e.target.innerHTML = helpers.formatDate(this.props.date).objective.italics().bold()
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
        <div className="salutation" >Dear { this.props.victim },</div> &nbsp;
        
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
        <p className="salutation">signed,</p>
        <div>
          {this.props.author} and 
          <a onClick={ this.toggleModal }> { this.props.included.length } others. </a>

        </div>
          <hr></hr>
          <div className="likeTotal">
            { this.state.likes }
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
        <hr></hr>         

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
