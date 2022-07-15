import React from 'react';
import {Router, Switch, Route, HashRouter} from 'react-router-dom';
import { createBrowserHistory,createHashHistory } from 'history';
import LoginPage from '../components/LoginPage';
import AdminPage from '../components/AdminPage';
import UserPage from '../components/UserPage';
import Error004 from '../components/Error404';
import * as constantes from '../components/Constantes';
import TeachPage from '../components/TeachPage';
import AlumPage from '../components/AlumPage';

export const history = createHashHistory();
const AppRouter = () => (
    <HashRouter history={history}>
        <Switch>
            <Route exact path='/' component={LoginPage} />
            <Route path='/admin' component={AdminPage} />
            <Route path='/user' component={UserPage} />
            <Route path='/teach' component={TeachPage} />
            <Route path='/alum' component={AlumPage}/>
            <Route path='/*' component={Error004} />
        </Switch>
    </HashRouter>
    
    /*<Router history={history}>
        <Switch>
            <Route exact path='/' component={LoginPage} />
            <Route exact path='/admin' component={AdminPage} />
            <Route exact path='/user' component={UserPage} />
        </Switch>
    </Router>*/
);
    
export default AppRouter;