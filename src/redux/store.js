import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { authReducer } from './authReducer';

const Store = () => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const rootReducer = combineReducers({ authReducer });

  return createStore(rootReducer, composeEnhancers(applyMiddleware()));
};

export default Store;
