import React, { Component } from 'react';

export default class NavBar extends Component {
  render() {
    return (
      <div className="navBar">
        <h1 id="title">Shit List</h1>
        <div id="signin">
          <a href='/'>Sign Up</a>
        </div>
        {this.props.children}
      </div>
      )
    }
  }

