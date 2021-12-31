import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { authReducer } from './authReducer';
import { storage } from '../state/storage';

const Store = () => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const rootReducer = combineReducers({ authReducer });
  const store = createStore(rootReducer, composeEnhancers(applyMiddleware()));

  store.subscribe(() => {
    storage.setItem('auth', store.getState());
  });

  return store;
};

export default Store;
