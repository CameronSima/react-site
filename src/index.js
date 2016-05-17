import React from 'react';
import { Router, Route, hashHistory, browserHistory } from 'react-router';
import ReactDOM from 'react-dom';
import App from './components/App';
import NavBar from './components/NavBar';
import Feed from './components/Feed';
import Signup from './components/signup';

ReactDOM.render((
                <Router history = { browserHistory }>
                  <Route component={ NavBar }>
                    <Route path='/' component={ Feed } url='/api/threads' pollInterval={ 2000 } />
                    <Route path='signup' component={ Signup } />
                  </Route>
                </Router>
  ), document.getElementById('root'));
