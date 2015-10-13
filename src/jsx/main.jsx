'use strict';

import React from 'react';
import CodeReddit from './codereddit';
import About from './about';
import { Router, Route, IndexRoute } from 'react-router';

React.render((
  <Router>
    <Route path="/">
      <IndexRoute component={CodeReddit}></IndexRoute>
      <Route path="about" component={About}></Route>
      <Route path="/:subreddit" component={CodeReddit}></Route>
    </Route>
  </Router>), document.getElementById('content')
);
