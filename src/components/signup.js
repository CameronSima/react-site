import React, { Component } from 'react';

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

    if (!username || !password1 || !password2) 
      return
    else if (password2 !== password1)
      console.log("PASSWORD ERROR")
      this.setState({
        error: "Passwords didn't match",
        username: "",
        password1: "",
        password2: ""
        })
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
          <input type="submit" value="Post" />
        </form>
        <label id="error">{this.state.error}</label>
      </div>
      )
  }
}