import React, { Component } from 'react';

import { Router, Route, IndexRoute, 
         hashHistory, browserHistory, 
         NotFoundView } from 'react-router';

import ReactDOM from 'react-dom';
import NavBar from './components/Utility/NavBar';
import FrontPage from './components/Page/FrontPage';
import Signup from './components/Page/signup';
import AddFriends from './components/Page/AddFriends';

const config = require('../config');

// Redirect to signup if user is not logged in
// var authCheck = function (nextState, replace, callback) {
//   $(document).ready(function() {
//     var user = localStorage.getItem('uid')
//     console.log(user)
//     if (user === '') {
//       replace('signup')
//     } 
    
//     callback()
//   })
// }


// Redirect to signup if user is logged in
var authCheck = function (nextState, replace, callback) {
  const user = localStorage.getItem("user")
  if (user === "") {
    replace('/signup')
  }
  callback()
}

ReactDOM.render((
                <Router history = { browserHistory }>
         
                    <Route path='/' component={ FrontPage } onEnter= { authCheck }/>
                    <Route path='signup' component={ Signup } />
                    <Route path='addFriends' component={ AddFriends } />
                    <Route path='*' component={ NotFoundView } />
           
                </Router>
  ), document.getElementById('root'));