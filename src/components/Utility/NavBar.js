import React, { Component } from 'react'
import { Link } from 'react-router'
var config = require('../../../config')


export default class NavBar extends Component {
  logout() {
    $.ajax({
      url: config.apiUrl + 'logout',
      dataType: 'jsonp',
      cache: false,
      type: 'POST',
      success: (data) => {
        console.log(data)
      },
      error: (xhr, status, err) => {
        console.log(this.url, status, err.toString())
      }
    })
  }

  render() {
    return (
      <div>
      <div className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <a href="../" id="navTitle" className="navbar-brand">Dirty Laundry</a>
          <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        </div>
        <div className="navbar-collapse collapse" id="navbar-main">
          <ul className="nav navbar-nav">
            <li><a href="http://builtwithbootstrap.com/" target="_blank">I SAID</a></li>
            <li><a href="http://builtwithbootstrap.com/" target="_blank">THEY SAID</a></li>          
            <li><a href="http://builtwithbootstrap.com/" target="_blank">I TAGGED</a></li>
            <li>
              <Link to="/addFriends">ADD OR REMOVE</Link>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <form className="navbar-form navbar-left" role="search">
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Search the Shit List"></input>
              </div>
              <button type="submit" className="btn btn-default">Submit</button>
              <br></br>
              <li onClick={this.logout} style={{float: 'right'}} target="_blank">Log out</li>
            </form>
          </ul>
        </div>
      </div>
    </div>
    <div>{this.props.children}</div>
    </div>

      )
    }
  }

