import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { connect } from "react-redux";
import { useMutation } from "@apollo/client";
import { get as getProperty } from "lodash";
import MagentoMutations from "./mutation";
import MagentoQueries from "./queries";
import Cookies from "js-cookie";
import { isLoggedIn } from "./utils";
import Loader from "./Loader";
import {
  getCartIdSelector,
  getProductSelector,
  getCartItemsSelector,
  getCartDataSelector,
} from "./store/selectors";
import apolloClient from "./apollo-client";
import { setCartData } from "./store/appStore/cart";
import { store } from "./store/store";

function Product({ product, cartId, cartData, orderConfirmPage }) {

  let productStockQuantity = product.stock_item.length
    ? product.stock_item[0].qty
    : 0;
  let inStock = product.stock_item.length
    ? product.stock_item[0].is_in_stock
    : false;
  let productSKU = product.sku;
  let defaultQuantity = Number(localStorage.getItem("cart_quantity") || 0);
  let itemsId = JSON.parse(localStorage.getItem("lp_items"));

  const cartItemsMap = useMemo(
    () =>
      new Map(
        getProperty(cartData, "totals.items", []).map((item) => [
          item.item_id,
          item.qty,
        ]),
        [cartData]
      )
  );

  if (itemsId && cartItemsMap.get(parseInt(itemsId[productSKU].item_id))) {
    defaultQuantity = cartItemsMap.get(parseInt(itemsId[productSKU].item_id));
  }

  // States
  const [activeCartData, setActiveCartData] = useState({});
  const [productQuantity, setProductQuantity] = useState(defaultQuantity);

  const getCartData = useCallback(
    async (options) =>
      apolloClient
        .query({
          query: MagentoQueries.GET_CART,
          ...options,
        })
        .then((response) => {
          console.log(response.data.getCart);
          store.dispatch(setCartData(response.data.getCart));
        }),
    []
  );

  // const getCartData = useCallback(() => useQuery(MagentoQueries.GET_CART, {
  //   async onCompleted(cartDataResponse) {
  //     console.log(cartDataResponse.getCart);
  //     store.dispatch(setCartData(cartDataResponse.getCart));
  //   },
  //   onError(error) {
  //     // @todo create log file.
  //     console.error(error)
  //   }
  // }), []);

  const [setCartMutation, { loading: setCartMutationLoading }] = useMutation(
    MagentoMutations.POST_ADD_PRODUCTS_TO_CART,
    {
      onCompleted: (data) => {
        console.log("Line no => 71", productQuantity);
        setActiveCartData(data);
        if (data.hasOwnProperty("addSimpleProductsToCart")) {
          data.addSimpleProductsToCart.cart.items.map((item) => {
            if (item.product.sku === productSKU) {
              let items = {
                [item.product.sku]: {
                  item_id: item.id,
                },
              };
              // Store quantity in local storage.
              localStorage.setItem("lp_items", JSON.stringify(items));
            }
          });
        }
      },
      onError: (error) => {
        // @todo create logged file.
        console.error(error);
      },
    }
  );

  const [
    updateCartMutation,
    { loading: updateCartMutationLoading },
  ] = useMutation(MagentoMutations.POST_UPDATE_CART, {
    onCompleted: (data) => {
      console.log("Line no => 100", productQuantity);
      setActiveCartData(data);
      if (data.hasOwnProperty("updateCartHeaderInfo")) {
        data.updateCartHeaderInfo.mini_cart.data.mini_cart.items.map((item) => {
          if (item.sku === productSKU) {
            let items = {
              [item.sku]: {
                item_id: item.item_id,
              },
            };
            localStorage.setItem("lp_items", JSON.stringify(items));
          }
        });
      }
    },
    onError: (error) => {
      // @todo create logged file.
      console.error(error);
    },
  });

  const [removeItemMutation] = useMutation(MagentoMutations.POST_REMOVE_ITEM, {
    onCompleted: (data) => {
      // TODO: Dispatch cart data.
    },
    onError: (error) => {
      // @todo create logged file.
      console.error(error);
    },
  });

  useEffect(() => {
    let CARTSESSID;
    // Update cart requires CARTSESSID instead of cartId.
    if (Cookies.get("CARTSESSID") !== undefined) {
      CARTSESSID = Cookies.get("CARTSESSID").replaceAll("%2C", ",");
    }
    // If active cart is empty, add product to the cart.
    let createOptions = {
      variables: {
        cart_id: cartId,
        sku: productSKU,
        quantity: productQuantity,
      },
    };
    let updateOptions = {
      variables: {
        cart_id: CARTSESSID,
        item_id: "",
        qty: productQuantity,
      },
    };
    let updateOptionsStatus = false;
    // If active cart is null and existing cart data is empty.
    if (
      ((Object.keys(activeCartData).length === 0 && !cartData) ||
        !CARTSESSID) &&
      productQuantity > 0
    ) {
      console.log("Line no => 153", productQuantity);
      setCartMutation(createOptions);
    } else if (cartData) {
      if (cartData.hasOwnProperty("totals")) {
        console.log("Line no => 158", productQuantity);
        cartData.totals.items.map((item) => {
          // TODO: Update API is called on each page reload.
          if (
            item.item_id === parseInt(itemsId[productSKU].item_id) &&
            productQuantity > 0
          ) {
            updateCartMutation({
              variables: {
                cart_id: CARTSESSID,
                item_id: item.item_id,
                qty: productQuantity,
              },
            }).then(() => {
              if (isLoggedIn() && orderConfirmPage) {
                const options = {
                  variables: {
                    cartId: cartId,
                  },
                };
                console.log("options => ", options);
                getCartData(options);
              }
            });
          } else if (
            item.item_id === parseInt(itemsId[productSKU].item_id) &&
            productQuantity === 0
          ) {
            // Remove item from cart.
            removeItemMutation({
              variables: {
                cart_id: cartId,
                item_id: item.item_id,
              },
            });
          }
        });
      }
    } else if (
      activeCartData &&
      activeCartData.hasOwnProperty("addSimpleProductsToCart")
    ) {
      console.log("Line no => 193", productQuantity);
      activeCartData.addSimpleProductsToCart.cart.items.map((item) => {
        if (item.product.sku === productSKU && productQuantity > 0) {
          updateCartMutation({
            variables: {
              cart_id: CARTSESSID,
              item_id: item.id,
              qty: productQuantity,
            },
          }).then(() => {
            if (isLoggedIn() && orderConfirmPage) {
              const options = {
                variables: {
                  cartId: cartId,
                },
              };
              console.log("options => ", options);
              getCartData(options);
            }
          });
        } else if (item.product.sku === productSKU && productQuantity === 0) {
          // Remove item from cart.
          removeItemMutation({
            variables: {
              cart_id: cartId,
              item_id: item.id,
            },
          });
        }
      });
    } else if (
      activeCartData &&
      activeCartData.hasOwnProperty("updateCartHeaderInfo")
    ) {
      console.log("Line no => 226", productQuantity);
      let miniCartData = activeCartData.updateCartHeaderInfo.mini_cart.data;
      if (miniCartData.mini_cart.items.length !== 0) {
        miniCartData.mini_cart.items.map((item) => {
          if (item.sku === productSKU && productQuantity > 0) {
            updateCartMutation({
              variables: {
                cart_id: CARTSESSID,
                item_id: item.item_id,
                qty: productQuantity,
              },
            }).then(() => {
              if (isLoggedIn() && orderConfirmPage) {
                const options = {
                  variables: {
                    cartId: cartId,
                  },
                };
                console.log("options => ", options);
                getCartData(options);
              }
            });
          } else if (productQuantity === 0) {
            // Remove item from cart.
            removeItemMutation({
              variables: {
                cart_id: cartId,
                item_id: item.id,
              },
            });
          }
        });
      }
    }

    // if(updateOptionsStatus) {
    //   updateCartMutation(updateOptions).then(() => {
    //     if (isLoggedIn() && orderConfirmPage) {
    //       const options = {
    //           variables: {
    //             cartId: cartId,
    //           },
    //         };
    //       console.log("options => ", options);
    //       getCartData(options);
    //     }
    //   });
    // }
  }, [productQuantity]);

  function ProductQuantityIncrement() {
    if (productQuantity < productStockQuantity) {
      setProductQuantity(productQuantity + 1);
      localStorage.setItem("cart_quantity", productQuantity + 1);
    }
  }

  function ProductQuantityDecrement() {
    if (productQuantity >= 0) {
      setProductQuantity(productQuantity - 1);
      localStorage.setItem("cart_quantity", productQuantity - 1);
    }
  }

  function ProductQuantityIncrementButton() {
    return (
      <span
        className="qty-btn-control plus"
        id={"qty-btn-plus-" + product.sku}
        onClick={(e) => { e.preventDefault(); ProductQuantityIncrement() }}
      >
        <i className="fa fa-plus" aria-hidden="true"></i>
      </span>
    );
  }

  function ProductQuantityDecrementButton() {
    if (productQuantity > 1) {
      return (
        <span
          className="qty-btn-control minus"
          id={"qty-btn-minus-" + product.sku}
          onClick={() => ProductQuantityDecrement()}
        >
          <i className="fa fa-minus" aria-hidden="true"></i>
        </span>
      );
    } else {
      return <ProductQuantityRemoveButton />;
    }
  }

  function ProductQuantityRemoveButton() {
    return (
      <span
        className="qty-btn-control minus delete"
        id={"qty-btn-delete-" + product.sku}
        onClick={() => ProductQuantityDecrement()}
      >
        削除
      </span>
    );
  }

  // Set max product stock display.
  // if (productStockQuantity >= 99) {
  productStockQuantity = 99;
  // }

  function ProductQuantityEmptyButton() {
    return (
      <button
        className="qty-btn-control start"
        id={"qty-btn-plus-" + product.sku}
        onClick={() =>
          ProductQuantityIncrement()}
        // disabled={productStockQuantity <= 0}
        type="button"
      >
        カートに入れる
      </button>
    );
  }

  function OutOfStockBlock() {
    return (
      <div className="aolp-out-of-stock">
        申し訳ありませんが、現在売り切れ中です。 次回の入荷をお待ちください。
      </div>
    );
  }

  function ProductSelectListOptions() {
    let ProductSelectListOptions = [];
    for (let i = 0; i <= productStockQuantity; i++) {
      ProductSelectListOptions.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return ProductSelectListOptions;
  }

  function ProductSelectList() {
    return (
      <React.Fragment>
        <ProductQuantityDecrementButton />
        <select
          id={"qty-btn-select-" + product.sku}
          className="qty-list"
          onChange={(e) => setProductQuantity(Number(e.currentTarget.value))}
          value={productQuantity}
        >
          <ProductSelectListOptions />
        </select>
        <ProductQuantityIncrementButton />
      </React.Fragment>
    );
  }

  function isLoading() {
    return setCartMutationLoading || updateCartMutationLoading;
  }

  return (
    <React.Fragment>
      {isLoading() ? <Loader /> : null}
      <div
        className="quantity-btns aolp-quantity-btns"
        id={"qty-btn-" + product.sku}
      >
        {productQuantity > 0 ? (
          <ProductSelectList />
        ) : (
            <ProductQuantityEmptyButton />
          )}
      </div>
      {!inStock ? <OutOfStockBlock /> : null}
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  product: getProductSelector(state),
  cartId: getCartIdSelector(state),
  cartItems: getCartItemsSelector(state),
  cartData: getCartDataSelector(state),
});
export default connect(mapStateToProps)(Product);


const getCartData1 = async (options) => apolloClient.query({
  query: MagentoQueries.GET_CART,
  ...options
}).then(function onCompleted(cartDataResponse) {
  console.log("GetData1=>", cartDataResponse);
  // store.dispatch(setCartData(cartDataResponse.data.getCart));
})
