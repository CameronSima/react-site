import React, { Component } from 'react';
import { Link } from 'react-router';

export default class NavBar extends Component {
  render() {
    return (
      <div>
      <div className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <a href="../" className="navbar-brand">Shit List</a>
          <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        </div>
        <div className="navbar-collapse collapse" id="navbar-main">
          <ul className="nav navbar-nav">
            
            <form className="navbar-form navbar-left" role="search">
              <div className="form-group">
                <input type="text" class="form-control" placeholder="Search the Shit List"></input>
              </div>
              <button type="submit" class="btn btn-default">Submit</button>
            </form>
          </ul>

          <ul className="nav navbar-nav navbar-right">
            <li><a href="http://builtwithbootstrap.com/" target="_blank">Login</a></li>
          </ul>
        </div>
      </div>
    </div>
    {this.props.children}
    </div>

      )
    }
  }

