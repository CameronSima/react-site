import React, { Component } from 'react'
import ReactDom from 'react-dom'

import Thread from './Thread'

export default class ThreadList extends Component {

  render() {
    var threadNodes, sortedFeed
    var self = this
    if (this.props.data) {

      // sort feed list before rendering components
      var sortedFeed = this.props.sortFunc(this.props.data) || this.props.data
      console.log(sortedFeed)
      var threadNodes = sortedFeed.map(function (thread) {
        return (
          <Thread victim={ thread.victim } 
                  comments={ thread.comments }
                  date={ thread.date }
                  author={ thread.author } 
                  byMe={ thread.byMe }
                  pic={ thread.photoName }
                  included={ thread.included }
                  initialLikes={ thread.likes } 
                  id={ thread._id }
                  key={ thread._id }>
            { thread.text }
          </Thread>
        )
      })
    }
    return (
      <div className="threadList">
        { threadNodes }
      </div>
      )
  }
}