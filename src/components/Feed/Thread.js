import React, { Component } from 'react'
import ReactDom from 'react-dom'
import { Button, ButtonGroup } from 'react-bootstrap'

import CommentBox from '../Comment/CommentBox'

var helpers = require('../../helpers')
var config = require('../../../config')

export default class Thread extends Component {
  constructor(props) {
    super(props)
    this.state = { vote: '', 
                   likes: this.props.initialLikes }

    this.deleteThread = this.deleteThread.bind(this)
    this.sendLikeToServer = this.sendLikeToServer.bind(this)
    this.setRelativeDate = this.setRelativeDate.bind(this)
    this.setObjectiveDate = this.setObjectiveDate.bind(this)
  }
  rawMarkup() {
    var rawMarkup = marked(this.props.children.toString(), { sanitize: true })
    return {__html: rawMarkup }
  }

  deleteThread(id) {
    $.ajax({
      url: config.apiUrl + 'threads/delete/' + id,
      type: 'POST',
      xhrFields: { withCredentials: true },
      success: function(doc) {

      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err)
      }.bind(this)
    })
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

  setObjectiveDate(e) {
    e.target.innerHTML = helpers.formatDate(this.props.date).objective.italics()
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
      <div className="thread" ref={this.props.id}>
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
          { this.props.byMe  && this.props.author.toString().charAt(0) === '_' && '*' }
          { this.props.author } and 
          
          <a > { this.props.included.length - 1 } others. </a>

        </div>
          <hr></hr>

          <div>{photo}</div>

        <div className="threadActions">
          <div className="likeTotal">
            { this.state.likes }
          </div>
             |
          <a className="likeLink"
             onClick={() => {this.sendLikeToServer(this.props.id, "upvote")}}>Like</a>
             |
          <a className="dislikeLink"
             onClick={() => {this.sendLikeToServer(this.props.id, "downvote")}}>Dislike</a>

             |
          <a className="tagLink">Tag</a>
             |
        
            { 
              this.props.byMe && 
                <div className="deleteLink"
                     onClick={()=> {this.deleteThread(this.props.id)}}>
                  <a >Delete</a>
                </div>
            }
          </div>
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
