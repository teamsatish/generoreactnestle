import { get } from 'lodash';
import ApiService from "./ApiService";
import AuthService from "./AuthService";
import { setCartData } from "../store/appStore/cart";
import { setBillingAddress } from "../store/appStore/address";
import { store } from "../store/store";
import MagentoQueries from "../queries";
import MagentoMutations from "../mutation";
import AddressService from './AddressService';
import LoaderService from './LoaderService';

class CartService {
  async fetchCartDetails(cartId) {

    try {

      console.log(cartId);

      if (cartId && AuthService.getBearerToken()) {
        const { data: cartDataResponse } = await ApiService.query(MagentoQueries.GET_CART, {
          variables: {
            cartId: cartId,
          },
        });


        store.dispatch(setCartData(cartDataResponse.getCart));
        debugger
        const billingAddress = cartDataResponse.getCart.billing_address;
        AddressService.setPaymentMethodConfigs(cartDataResponse.getCart);
        if (billingAddress) {
          store.dispatch(setBillingAddress(billingAddress));
          const prefectureCode = get(billingAddress, "region.code");

          if (!prefectureCode) {
            const zipCodeResponse = await AddressService.getRegionFromPostCode({
              variables: { code: billingAddress.postcode.replaceAll("-", "") },
            });
            store.dispatch(
              setBillingAddress({
                ...billingAddress,
                address: {
                  ...billingAddress.address,
                  region: zipCodeResponse.getPostcodeInfo.prefecture_code,
                },
              })
            );
          }
        }
      }

    } catch (error) {
      console.error(error)
      LoaderService.showLoader();
    }

  }

  async createEmptyCart() {
    const { data: cartResponse } = await ApiService.mutate(MagentoMutations.POST_CART);
    if (cartResponse && cartResponse.createEmptyCart) {
      AuthService.setCartId(cartResponse.createEmptyCart);
    }
  }
}

export default new CartService();
