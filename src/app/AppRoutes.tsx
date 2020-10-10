import React from 'react';

import { Route, HashRouter as Router, Switch } from 'react-router-dom';

import { ROUTES } from './routes';

export const AppRoutes = () => (
  <Router>
    <Switch>
      {Object.values(ROUTES).map((route, index) => (
        <Route key={index} {...route} />
      ))}
    </Switch>
  </Router>
);
