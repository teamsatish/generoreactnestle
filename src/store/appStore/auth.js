import createStore from "../createStore";

const initialState = {
  hasDrupalSession: false,
  user: {},
  bearerToken: "",
  customerDetails: {},
  cartId: "",
  skuId: "",
};

const [
  {
    setAuth,
    resetAuth,
    setSkuId,
    setBearerToken,
    setHasDrupalSession,
    setCustomerDetails,
    setCartId
  },
  reducer,
] = createStore("nestle/auth", {
  _initialState: initialState,

  setAuth: (auth) => (state) => ({
    ...state,
    token: auth.token,
    user: auth.user,
  }),

  setSkuId: (skuId) => (state) => ({
    ...state,
    skuId,
  }),

  resetAuth: () => () => initialState,

  setBearerToken: (bearerToken) => (state) => ({
    ...state,
    bearerToken,
  }),

  setCartId: (cartId) => (state) => ({
    ...state,
    cartId,
  }),

  setHasDrupalSession: (hasDrupalSession) => (state) => ({
    ...state,
    hasDrupalSession,
  }),

  setCustomerDetails: (customerDetails) => (state) => ({
    ...state,
    customerDetails,
  }),
});

export {
  setAuth,
  resetAuth,
  setSkuId,
  setBearerToken,
  setHasDrupalSession,
  setCustomerDetails,
  setCartId
};
export default reducer;
