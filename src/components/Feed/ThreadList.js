import React, { Component } from 'react'

import Thread from './Thread'

export default class ThreadList extends Component {
  render() {
    var threadNodes, sortedFeed
    if (this.props.data) {

      // sort feed list before rendering components
      var sortedFeed = this.props.sortFunc(this.props.data)
      
      var threadNodes = sortedFeed.map(function (thread) {
        return (
          <Thread victim={ thread.victim } 
                  comments={ thread.comments }
                  date={ thread.date }
                  author={ thread.author } 
                  included={ thread.included }
                  initialLikes={ thread.likes } 
                  id={ thread._id}
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