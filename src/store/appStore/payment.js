import createStore from "../createStore";

const initialState = {
  deliveryAddress: {},
  paymentFormConfig: {
    paymentMethods: [
      { code: "none", title: "選択してください", description: "" },
    ],
    deliveryDate: {},
    deliveryTime: [{ label: "指定なし", value: "-1" }],
    fromApi: false,
  }
};

const [{ setDeliveryAddress, setPaymentFormConfig }, reducer] = createStore("nestle/payment", {
  _initialState: initialState,

  setDeliveryAddress: (deliveryAddress) => (state) => ({
    ...state,
    deliveryAddress,
  }),

  setPaymentFormConfig: (paymentFormConfig) => (state) => ({
    ...state,
    paymentFormConfig: {
      ...state.paymentFormConfig,
      ...paymentFormConfig,
    }
  })
});

export { setDeliveryAddress, setPaymentFormConfig };
export default reducer;
