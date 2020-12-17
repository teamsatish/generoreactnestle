import createStore from "../createStore";

const initialState = {
  cartItems: null,
};

const [{ setCartItems }, reducer] = createStore("nestle/cartItems", {
  _initialState: initialState,

  setCartItems: (cartItems) => (state) => ({
    ...state,
    cartItems
  }),
});

export { setCartItems };
export default reducer;
