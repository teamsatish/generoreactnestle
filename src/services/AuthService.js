import Cookies from 'js-cookie'
import {
  setCustomerDetails,
  setBearerToken,
  setCartId,
  setSkuId,
  setHasDrupalSession
} from "../store/appStore/auth";
import { store } from "../store/store";
import { appConfig } from '../config';
import MagentoQueries from "../queries";
import MagentoMutations from "../mutation";
import ApiService from './ApiService';

class AuthService {
  constructor() {
    if (window.drupalSettings.sku) {
      store.dispatch(setSkuId(window.drupalSettings.sku));
    }
    if (this.isDrupalSessionSet()) {
      this.setDrupalAuthState();
      this.generateBearerToken();
    }

    if (this.getBearerToken()) {
      this.resetAuthStore();
    }
    store.dispatch(setCartId(localStorage.getItem("CART_ID")));
  }

  async generateBearerToken() {

    if (localStorage.getItem('BEARER_TOKEN')) {
      this.setBearerToken(localStorage.getItem('BEARER_TOKEN'));
      await this.fetchCustomerData();
      return;
    }
    const { data: bearerTokeResponse } = await ApiService.mutate(MagentoMutations.POST_TOKEN, {});
    if (bearerTokeResponse && bearerTokeResponse.generateCustomerToken.token) {
      this.setBearerToken(bearerTokeResponse.generateCustomerToken.token);
      await this.fetchCustomerData();
    }
  }

  async fetchCustomerData() {
    const { data: response } = await ApiService.query(MagentoQueries.GET_CUSTOMER);
    if (response.customer) {
      this.setCustomerDetails(response.customer);
    }
  }

  resetAuthStore() {
    store.dispatch(setBearerToken(this.getBearerToken()));
    store.dispatch(
      setCustomerDetails(JSON.parse(localStorage.getItem("CUSTOMER_DETAILS")))
    );
  }

  isDrupalSessionSet() {
    console.log(appConfig, appConfig.isLocalDevelopment);
    return appConfig.isLocalDevelopment ? true : Cookies.get("MemberCode") > 0;
  }

  setDrupalAuthState() {
    store.dispatch(setHasDrupalSession(true));
  }

  setBearerToken(bearerToken) {
    localStorage.setItem("BEARER_TOKEN", bearerToken);
    store.dispatch(setBearerToken(bearerToken));
  }

  setCustomerDetails(customerDetails) {
    localStorage.setItem("CUSTOMER_DETAILS", JSON.stringify(customerDetails));
    store.dispatch(setCustomerDetails(customerDetails));
  }

  getBearerToken() {
    return localStorage.getItem("BEARER_TOKEN");
  }

  setCartId(cartId) {
    localStorage.setItem("CART_ID", cartId);
    store.dispatch(setCartId(cartId));
  }

  getCartIdFromLocalStorage() {
    return localStorage.getItem("CART_ID");
  }

  isUserLoggedIn() {
    return !!this.getBearerToken();
  }

  async mapCartIdForCurrentUser(cartId) {
    return ApiService.query(MagentoQueries.GET_CART, {
      variables: {
        cartId,
      }
    })
  }

  async requestLoginInDrupal({ email, password }) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        pwd: password,
      }),
    };
    return await fetch(
      appConfig.serverUrl +
      "/all-in-one-lp-login",
      requestOptions
    ).then((res) => res.json());
  }


  async requestLoginOtp(options) {
    return ApiService.mutate(MagentoMutations.POST_VERIFICATION_CODE, options);
  }
}



export default new AuthService();
