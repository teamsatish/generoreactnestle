import ApiService from "./ApiService";
import MagentoMutations from "../mutation";
import { setPaymentFormConfig } from "../store/appStore/payment";
import { store } from "../store/store";

class AddressService {
  async getRegionFromPostCode(options) {
    const { data: postCodeResponse } = await ApiService.mutate(MagentoMutations.POST_ZIP_CODE, options);
    if (postCodeResponse && postCodeResponse.getPostcodeInfo && postCodeResponse.getPostcodeInfo.prefecture_code) {
      return postCodeResponse.getPostcodeInfo.prefecture_code
    } else {
      return ''
    }
  }

  async saveBillingAddress(options) {
    return await ApiService.mutate(MagentoMutations.POST_BILLING_ADDRESS, options);
  }

  async saveShippingAddress(options) {
    return await ApiService.mutate(MagentoMutations.POST_SHIPPING_ADDRESS, options);
  }

  async updateCartShippingAddress(options) {
    return await ApiService.mutate(MagentoMutations.POST_UPDATE_ADDRESS, options);
  }

  setPaymentMethodConfigs(setShippingAddressesOnCart) {

    let deliveryDate = {
      max_date: "",
      min_date: "",
      unavailable_date: "",
    };
    let delivery_info =
      setShippingAddressesOnCart.delivery_info;

    const
      { delivery_info: {
        0: { delivery_type },
      } } = setShippingAddressesOnCart;

    store.dispatch(setPaymentFormConfig({
      paymentMethods:
        setShippingAddressesOnCart.payment_methods,
      deliveryTime:
        setShippingAddressesOnCart.delivery_time_list,
      deliveryDate:
        delivery_info && delivery_info.length
          ? delivery_info[0]
          : deliveryDate,
      fromApi: true,
      deliveryType: delivery_type,
    }));
  }
}


export default new AddressService()
