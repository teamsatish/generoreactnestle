import createStore from '../createStore';

const initialState = { 
    appInit: false
}

const [
    {setAppInit},
    reducer,
  ] = createStore('nestle/appInit', {
    _initialState: initialState,
    
    setAppInit: appInit => state => ({
      ...state,
      appInit,
    }),
});

export {
  setAppInit
}
export default reducer;