import React, { Component } from 'react';
import { Router, Route, IndexRoute, hashHistory, browserHistory, NotFoundView } from 'react-router';
import ReactDOM from 'react-dom';
// import App from './components/App';
import NavBar from './components/NavBar';
import Feed from './components/Feed';
import FrontPage from './components/FrontPage';
import Signup from './components/signup';
import Comments from './components/Comments';
import AddFriends from './components/AddFriends';

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



ReactDOM.render((
                <Router history = { browserHistory }>
                  <Route path='/' component={ NavBar }>
                    <IndexRoute component={ FrontPage } />
                    <Route path='signup' component={ Signup } />
                    <Route path='comments' component={ Comments } />
                    <Route path='addFriends' component={ AddFriends } />
                    <Route path='*' component={ NotFoundView } />
                  </Route>
                </Router>
  ), document.getElementById('root'));