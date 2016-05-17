import React, { Component } from 'react';
import { Link } from 'react-router';

export default class NavBar extends Component {
  render() {
    return (
      <div className="navBar">
        <h1 id="title">Shit List</h1>
        <div id="signin">
          <Link to='/signup'>Sign Up</Link>
        </div>
        {this.props.children}
      </div>
      )
    }
  }

