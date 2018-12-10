import 'whatwg-fetch';
import { polyfill as promisePolyfill } from 'es6-promise';

import React from 'react';
import ReactDOM from 'react-dom';

import '../scss/index.scss';

import App from './App';
import Box from 'grommet/components/Box';
import Footer from 'grommet/components/Footer';


promisePolyfill();
const element = document.getElementById('content');
ReactDOM.render(<App />, element);
document.body.classList.remove('loading');
