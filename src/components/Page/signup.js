import React, { Component } from 'react';

var config = require('../../../config')

class FacebookLogin extends Component {
  render() {
    return (
      <div id="loginPanel">
      <h1 id="title">Dirty Laundry</h1>
      <h3>Anti-Social Media</h3>
        <a href="http://localhost:3001/api/auth/facebook" >
          <input type="image" 
                 id="loginWithFacebook"
                 src="/src/assets/loginwithfacebookColored.png"
                 href="http://localhost:3001/api/auth/facebook"  />
        </a>
        <div>Get the app</div>
        <div>
          <a href="" >
            <input type="image" 
                   id=""
                   className="mobile-download"
                   src="/src/assets/downloadonappstore.png"
                   href="http://localhost:3001/api/auth/facebook"  />
          </a>

          <a href="" >
            <input type="image" 
                   id=""
                   className="mobile-download"
                   src="/src/assets/downloadongoogleplay.png"
                   href="http://localhost:3001/api/auth/facebook"  />
          </a>
        </div>
      </div>
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
        <FacebookLogin />
      </div>
      )
  }
}