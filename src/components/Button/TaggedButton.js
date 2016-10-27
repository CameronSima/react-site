import React, { Component } from 'react'

export default class TaggedButton extends Component {
  constructor(props) {
    super(props) 
  }
  render() {
    return (
      <button className="btn btn-primary" id="taggedButton" type="button">
        { this.props.title } <span className="badge"> { this.props.tagged.length } </span>
      </button>
      )
  }
}