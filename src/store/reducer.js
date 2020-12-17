import { combineReducers } from "redux";
import initApp from "./appStore/appInit";
import route from "./appStore/routeState";
import auth from "./appStore/auth";
import payment from "./appStore/payment";
import product from "./appStore/product";
import loader from "./appStore/loader";
import cart from "./appStore/cart";
import address from "./appStore/address";
import cartItems from "./appStore/cartItems";

export default combineReducers({
  initApp,
  route,
  auth,
  payment,
  product,
  cart,
  address,
  cartItems,
  loader
});
