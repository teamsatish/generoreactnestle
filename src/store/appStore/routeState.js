import createStore from '../createStore';

const initialState = { 
    meta: {isAuth: false}
}

const [
    {setRouteState},
    reducer,
  ] = createStore('nestle/routeState', {
    _initialState: initialState,
    
    setRouteState: (route) => state => ({
      ...state,
      ...route
    }),
});

export {
    setRouteState
}
export default reducer;