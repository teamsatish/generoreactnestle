export const getDeliveryAddress = (state) => state.payment.deliveryAddress;

export const getCartIdSelector = (state) => state.auth.cartId;
export const getCartDataSelector = (state) => state.cart.cartData;
export const getCartItemsSelector = (state) => state.cartItems.cartItems;
export const getHasDrupalSession = (state) => state.auth.hasDrupalSession;
export const getSkuIdSelector = (state) => state.auth.skuId;
export const getProductSelector = (state) => state.product.product;
export const getBearerTokenSelector = (state) => state.auth.bearerToken;
export const getCustomerDetailsSelector = (state) => state.auth.customerDetails;
export const getShippingAddressSelector = (state) => state.address.shipping_address;
export const getBillingAddressSelector = (state) => state.address.billing_address;
export const getShowLoaderSelector = (state) => state.loader.isLoaderShowing;
export const getPaymentConfigSelector = (state) => state.payment.paymentFormConfig;
