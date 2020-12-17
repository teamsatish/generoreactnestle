import {createStore, applyMiddleware, compose} from 'redux';
import reducer from './reducer';
import asyncMiddleware from './asyncMiddleware';

let listeners = [];
let trigger = true;

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(asyncMiddleware),
  // other store enhancers if any
);
const store = createStore(reducer, enhancer);

const getState = () => store.getState();

const dispatch = (...args) => store.dispatch(...args);

const storeUpdated = () => {
  if (trigger) {
    listeners.forEach(listener => listener());
  }
};

const batchDispatch = actions => {
  trigger = false;
  const lastState = getState();
  actions.forEach(dispatch);
  trigger = true;
  if (lastState !== getState()) {
    storeUpdated();
  }
};

export {store, getState, dispatch, batchDispatch};
