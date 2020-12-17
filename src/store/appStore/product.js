import createStore from "../createStore";

const initialState = {
  product: null,
};

const [{ setProduct }, reducer] = createStore("nestle/product", {
  _initialState: initialState,

  setProduct: (product) => (state) => ({
    ...state,
    product,
  }),
});

export { setProduct };
export default reducer;
