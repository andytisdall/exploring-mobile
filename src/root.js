import { compose, createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import React from 'react';

import reducers from './reducers';

const Root = ({ children, initialState = {} }) => {
  const composeEnhancers = compose;
  const store = createStore(
    reducers,
    initialState,
    composeEnhancers(applyMiddleware(reduxThunk)),
  );
  return <Provider store={store}>{children}</Provider>;
};

export default Root;
