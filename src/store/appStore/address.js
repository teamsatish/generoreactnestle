import createStore from "../createStore";

// DEVELOPER_NOTE: Notice snake_case, it is intetional, apis use snake_case, so I have put it here in snake case only.
const initialState = {
  shipping_address: null,
  billing_address: null
};

const [{ setShippingAddress, setBillingAddress }, reducer] = createStore("nestle/address", {
  _initialState: initialState,

  setShippingAddress: (shipping_address) => (state) => ({
    ...state,
    shipping_address,
  }),

  setBillingAddress: (billing_address) => (state) => ({
    ...state,
    billing_address,
  }),
});

export { setShippingAddress, setBillingAddress };
export default reducer;
