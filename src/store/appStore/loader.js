import createStore from "../createStore";

const initialState = {
  isLoaderShowing: false,
};

const [{ setShowLoader, setHideLoader }, reducer] = createStore("nestle/loader", {
  _initialState: initialState,

  setShowLoader: () => (state) => ({
    ...state,
    isLoaderShowing: true,
  }),

  setHideLoader: () => (state) => ({
    ...state,
    isLoaderShowing: false,
  }),
});

export { setShowLoader, setHideLoader };
export default reducer;
