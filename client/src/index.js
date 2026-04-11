/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'; // ✅ Step 1: PropTypes import karein

// ✅ Step 2: Global window objects set karein (ApexCharts ke liye zaroori hai)
window.React = React;
window.ReactDOM = ReactDOM;
window.PropTypes = PropTypes; 

import './index.css';
import App from './App';

import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import reducers from './reducers/'

// Store setup
const store = createStore(reducers, compose(applyMiddleware(thunk)))

ReactDOM.render(
  <Provider store={store} >
    <App />
  </Provider>,
  document.getElementById('root')
);