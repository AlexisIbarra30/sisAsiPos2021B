import React from 'react';
import {Router, Switch, Route} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import LoginPage from '../components/LoginPage';
import AdminPage from '../components/AdminPage';
import UserPage from '../components/UserPage';
import * as constantes from '../components/Constantes';

export const history = createBrowserHistory();
const AppRouter = () => (
    <Router history={history}>
        <Switch>
            <Route exact path='/' component={LoginPage} />
            <Route exact path='/admin' component={AdminPage} />
            <Route exact path='/user' component={UserPage} />
        </Switch>
    </Router>
);
    
export default AppRouter;