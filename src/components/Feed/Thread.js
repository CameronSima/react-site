import React, { Component } from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'

import CommentBox from '../Comment/CommentBox'

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
    if (this.props.pic) {
        var photo = <img className="user_photo" 
                         src={'src/assets/user_images/' + this.props.pic}
                      />
    }
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
          <a onClick={ this.toggleModal }> { this.props.included.length - 1 } others. </a>

        </div>
          <hr></hr>

          <div>{photo}</div>

          <div className="likeTotal">
            { this.state.likes }
          </div>

        <ButtonGroup>
          <Button onClick={() => {this.sendLikeToServer(this.props.id, "upvote")}}>Like</Button>
          <Button onClick={() => {this.sendLikeToServer(this.props.id, "downvote")}}>Dislike</Button>
        </ButtonGroup>
        <hr></hr>         

        <div>
          <CommentBox threadId={ this.props.id }
                      comments={ this.props.comments }
                        />
        </div>
        <hr></hr>
      </div>
      )
  }
}
