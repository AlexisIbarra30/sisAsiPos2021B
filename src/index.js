import React from 'react';
import ReactDOM from 'react-dom';
//import 'react-dates/initialize';
import 'normalize-css/normalize.css';
import './styles/style.scss';
//import 'react-dates/lib/css/_datepicker.css';
import AppRouter from './routers/AppRouter';

ReactDOM.render( <AppRouter />, document.getElementById('app'));

