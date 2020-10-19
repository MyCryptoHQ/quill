import React from 'react';

import { HashRouter as Router, Switch } from 'react-router-dom';

import { Route } from './routing';
import { ROUTES } from './routing/routes';

export const AppRoutes = () => (
  <Router>
    <Switch>
      {Object.values(ROUTES).map((route, index) => (
        <Route key={index} {...route} />
      ))}
    </Switch>
  </Router>
);
