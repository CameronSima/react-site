import React, { Component } from 'react'

class FacebookLogin extends Component {
  render() {
    return (
      <a href="http://localhost:3001/api/auth/facebook" className="button">Log in with Facebook</a>
      )
  }
}