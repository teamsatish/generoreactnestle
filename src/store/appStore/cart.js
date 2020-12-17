import createStore from "../createStore";

const initialState = {
  cartData: null,
};

const [{ setCartData }, reducer] = createStore("nestle/cart", {
  _initialState: initialState,

  setCartData: (cartData) => (state) => ({
    ...state,
    cartData,
  }),
});

export { setCartData };
export default reducer;
