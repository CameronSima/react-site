import React, { Component } from 'react'
import ReactDom from 'react-dom'
import InfiniteScroll from 'react-infinite-scroller'

import Thread from './Thread'

var helpers = require('../../helpers')

export default class ThreadList extends Component {
  render() {
    var threadNodes, sortedFeed
    var self = this
    if (this.props.data) {

      // sort feed list before rendering components
      var sortedFeed = this.props.sortFunc(this.props.data) || this.props.data
      var threadNodes = sortedFeed.map(function (thread) {
        return (
          <Thread replaceThread={self.props.replaceThread}
                  removeThread={self.props.removeThread}
                  victim={ thread.victim } 
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
      <InfiniteScroll
        pageStart={0}
        threshold={50}
        loadMore={this.props.moreThreads}
        hasMore={!(this.props.data.length < this.props.numThreads && this.props.data.length > 1)}
        loader={<div className="loader">Loading. . .</div>}>
        <div className="threadList">
          { threadNodes }
        </div> 
      </InfiniteScroll>
      )
  }
}