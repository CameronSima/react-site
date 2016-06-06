import React, { Component } from 'react';

var config = require('../../config')

class FacebookLogin extends Component {
  render() {
    return (
      <a href="http://localhost:3001/api/auth/facebook" class="button">Log in with Facebook</a>
      )
  }
}

export default class Signup extends Component {

  constructor(props) {
    super(props)
    this.state = {
        username: "",
        password1: "",
        password2: "",
        error: ""
      }
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange(e) {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit(e) {
    e.preventDefault()
    console.log(e)
    var username = this.state.username.trim()
    var password1 = this.state.password1.trim()
    var password2 = this.state.password2.trim()
    var friends = this.state.friends.trim()

    if (!username || !password1 || !password2) {
      return
    }
    else if (password2 !== password1) {
          console.log("PASSWORD ERROR")
          this.setState({
            error: "Passwords didn't match",
            username: "",
            password1: "",
            password2: "",
            friends: ""
          })
        }
    this.setState({
      error: "",
      username: "",
      password1: "",
      password2: "",
      friends: ""

    }) 
    $.ajax({
      url: config.apiUrl + 'signup',
      dataType: 'json',
      type: 'POST',
      data: { username: username,
              password: password1,
              friends: friends
            },
      success: function (user) {
        this.setState({user: user})
        console.log(user)
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.url, status, err.toString())
      }.bind(this)}
    )
  }
  render() {
    return (
      <div>
        <form className="signupForm" onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={this.state.username}
            onChange={this.onChange} />
          <input
            type="text"
            name="password1"
            placeholder="Password"
            value={this.state.password1}
            onChange={this.onChange} />
          <input
            type="text"
            name="password2"
            placeholder="Password again"
            value={this.state.password2}
            onChange={this.onChange} />
          <input
            type="text"
            name="friends"
            placeholder="friends"
            value={this.state.friends}
            onChange={this.onChange} />
          <input type="submit" value="Post" />
        </form>
        <label id="error">{this.state.error}</label>
        <div>
        <FacebookLogin />
      </div>
      </div>
      )
  }
}