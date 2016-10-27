import React, { Component } from 'react';

import { Router, Route, IndexRoute, 
         hashHistory, browserHistory } from 'react-router';

import ReactDOM from 'react-dom';
import NavBar from './components/Utility/NavBar';
import FrontPage from './components/Page/FrontPage';
import Signup from './components/Page/signup';
import NotFoundRoute from './components/Page/404NotFound'

const config = require('../config');

ReactDOM.render((
                <Router history = { browserHistory }>
                    <Route path='/' component={ FrontPage } />
                    <Route path='signup' component={ Signup } />
                    <Route path='*' component={ NotFoundRoute } />
           
                </Router>
  ), document.getElementById('root'));