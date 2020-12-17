import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import AuthService from "../services/AuthService";
import MagentoMutations from "../mutation";
import { getCartIdSelector } from "../store/selectors";
import CartService from "../services/CartService";
import ProductService from "../services/ProductService";

const useAppInit = () => {
  const cartId = useSelector(getCartIdSelector);
  const query = new URLSearchParams(window.location.search);
  const coupon = query.get("coupon");

  const [
    applyCouponToCartMutation,
    { loading: coupontMutationLoading },
  ] = useMutation(MagentoMutations.POST_APPLY_COUPON_TO_CART, {
    onError(error) {
      console.error(error);
    },
  });

  useEffect(() => {
    CartService.fetchCartDetails(cartId);
    if (cartId && coupon) {
      applyCouponToCartMutation({
        variables: {
          cartId: cartId,
          couponCode: coupon,
        },
      });
    }
  }, [cartId]);


  useEffect(() => {
    ProductService.fetchProductDetails();
    if (!AuthService.getCartIdFromLocalStorage()) {
      CartService.createEmptyCart();
    }
  }, []);

  return {

  };
};


export default useAppInit;
