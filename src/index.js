import React from 'react';
import { Router, Route, IndexRoute, hashHistory, browserHistory, NotFoundView } from 'react-router';
import ReactDOM from 'react-dom';
import App from './components/App';
import NavBar from './components/NavBar';
import Feed from './components/Feed';
import Signup from './components/signup';

ReactDOM.render((
                <Router history = { browserHistory }>
                  <Route path='/' component={ NavBar }>
                    <IndexRoute component={ Feed } />
                    <Route path='signup' component={ Signup } />
                    <Route path='*' component={ NotFoundView } />
                  </Route>
                </Router>
  ), document.getElementById('root'));