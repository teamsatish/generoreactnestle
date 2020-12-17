import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import { useMutation, useQuery } from "@apollo/client";
import { get as getProperty } from "lodash";
import {
  getDeliveryAddress,
  getCartIdSelector,
  getCartDataSelector,
} from "../../store/selectors";
import MagentoQueries from "../../queries";
import Loader from "../../Loader";
import NumberFormat from "../../NumberFormat";
import MagentoMutations from "../../mutation";
import { store } from "../../store/store";
import { setCartData as setCartDataAction } from "../../store/appStore/cart";
import { hideNestleBlockContent } from "../../utils";
import ProductQuantityComponent from "../../ProductQuantityComponent";

function OrderConfirm({ deliveryAddress: deliveryInfo, cartId, cartData }) {
  const [productItems, setProductItems] = useState();
  const [productImage, setProductImage] = useState();
  const [giftWrapPrice, setGiftWrapPrice] = useState();
  const [shippingAddresses, setShippingAddresses] = useState();
  const [billingAddresses, setBillingAddresses] = useState();
  const [shippingSameAsBilling, setShippingSameAsBilling] = useState(false);
  const [orderSummary, setOrderSummary] = useState();
  const [selectedPaymentMethod, setPaymentMethod] = useState();
  const [selectedPaymentMethodLabel, setPaymentMethodLabel] = useState();
  const [updateQuantity, setUpdateQuantity] = useState(false);

  // if (cartId) {
  //   const { cartLoading } = useQuery(MagentoQueries.GET_CART, {
  //     variables: {
  //       cartId: cartId
  //     },
  //     onCompleted(data) {
  //       store.dispatch(setCartDataAction(data.getCart))
  //       // @todo create log file.
  //     },
  //     onError(error) {
  //       // @todo create log file.
  //       console.error(error)
  //     }
  //   })
  //   if (cartLoading) return <Loader />
  // }

  function update_quantity(e) {
    e.preventDefault();
    if (updateQuantity) {
      setUpdateQuantity(false);
    } else {
      setUpdateQuantity(true);
    }
  }

  useEffect(() => {
    if (Object.keys(cartData).length !== 0) {
      setProductItems(cartData.totals.items);
      setProductImage(cartData.shipping_addresses);
      setGiftWrapPrice(cartData.shipping_addresses);
      setOrderSummary(cartData.totals);
      setShippingSameAsBilling(cartData.shipping_same_as_billing);
      setShippingAddresses(cartData.shipping_addresses);
      setBillingAddresses(cartData.billing_address);
      setPaymentMethod(cartData.selected_payment_method.code);
      setPaymentMethodLabel(cartData.selected_payment_method.title);
    }
  }, [cartData]);

  useEffect(() => {
    hideNestleBlockContent();
  }, []);

  const segmentsMap = useMemo(
    () =>
      new Map(
        getProperty(cartData, "totals.total_segments", []).map((segment) => [
          segment.code,
          segment.value,
        ]),
        [cartData]
      )
  );

  console.log(segmentsMap);
  const [placeOrder] = useMutation(MagentoMutations.POST_ORDER, {});
  function handlerOrderSubmit(e) {
    const deliveryInfoCopy = {
      ...deliveryInfo,
    };
    delete deliveryInfoCopy.deliveryTimeLabel;
    const successUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      "/front/contents/nhs/thanks" +
      (window.location.search || "");
    placeOrder({
      variables: {
        cart_id: cartId,
        delivery_info: deliveryInfoCopy,
        custom_options: {
          site: {
            value: "nhspp",
            success_url: successUrl,
          },
        },
      },
    }).then((data) => {
      const {
        data: {
          placeOrder: {
            order: { order_number, created_at, paygent_url },
          },
        },
      } = data;
      localStorage.removeItem("CART_ID");
      localStorage.setItem(
        "lp_order",
        JSON.stringify({
          orderNumber: order_number,
          createdAt: created_at,
        })
      );

      if (paygent_url) {
        window.location.href = paygent_url;
      } else {
        window.location.href = successUrl;
      }
    });
  }

  function OrderProductImage() {
    return (
      <React.Fragment>
        {productImage.map((item, index1) => (
          <React.Fragment key={index1}>
            {item.cart_items_v2.map((item, index2) => (
              <img
                src={item.product.thumbnail.url}
                alt={item.product.name}
                key={`${index1}_${index2}`}
              />
            ))}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  }

  function GiftWrappingPrice() {
    return (
      <React.Fragment>
        {giftWrapPrice.map((item, index1) => (
          <React.Fragment key={index1}>
            {item.cart_items_v2.map((item, index2) => {
              if (item.product.gift_wrapping.length == 0) {
                return (
                  <span
                    className="order-details-value"
                    key={`${index1}_${index2}empty`}
                  >
                    0円
                  </span>
                );
              }
              return (
                <>
                  {item.product.gift_wrapping.map((item, index3) => (
                    <span
                      className="order-details-value"
                      key={`${index2}_${index3}price`}
                    >
                      {item.price}円
                    </span>
                  ))}
                </>
              );
            })}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  }

  function OrderProductItems() {
    if (productItems !== undefined) {
      return (
        <React.Fragment>
          {productItems.map((item, index) => (
            <div key={index} className="row">
              <div className="col-md-4 aolp-order-details-image">
                <OrderProductImage />
              </div>
              <div className="col-md-8 aolp-order-details-list">
                <div className="order-details-row order-details-prodname">
                  <span className="order-details-label">商品名</span>
                  <span className="order-details-value">{item.name}</span>
                </div>
                <div className="order-details-row order-details-prodqty">
                  <span className="order-details-label">数量</span>
                  {!updateQuantity && (
                    <span className="order-details-value">{item.qty}</span>
                  )}
                  {updateQuantity && (
                    <span className="order-details-value">
                      <ProductQuantityComponent orderConfirmPage={true} />
                    </span>
                  )}
                  <span className="order-details-link">
                    <a href="#" onClick={update_quantity}>
                      修正する
                    </a>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </React.Fragment>
      );
    } else {
      return <Loader />;
    }
  }

  function OrderBillingAddress() {
    if (billingAddresses !== undefined) {
      return (
        <React.Fragment>
          <div className="order-details-row aolp-order-shipping-name">
            <span className="order-details-label">お名前</span>
            <span className="order-details-value">
              {billingAddresses.lastname} {billingAddresses.firstname}
            </span>
          </div>
          <div className="order-details-row aolp-order-shipping-name-kana">
            <span className="order-details-label">お名前カナ</span>
            <span className="order-details-value">
              {billingAddresses.lastnamekana} {billingAddresses.firstnamekana}
            </span>
          </div>
          <div className="order-details-row aolp-order-shipping-phone">
            <span className="order-details-label">電話番号</span>
            <span className="order-details-value">
              {billingAddresses.telephone}
            </span>
          </div>
          <div className="order-details-row aolp-order-street-address">
            <span className="order-details-label">住所</span>
            <span className="order-details-value">
              {billingAddresses.region.label}
              {billingAddresses.city}
              {billingAddresses.street}
            </span>
          </div>
          <div className="order-details-row aolp-order-postal-code">
            <span className="order-details-label">郵便番号</span>
            <span className="order-details-value">
              〒{billingAddresses.postcode}
            </span>
          </div>
        </React.Fragment>
      );
    } else {
      return <Loader />;
    }
  }

  function OrderShippingAddress() {
    if (shippingAddresses !== undefined) {
      return (
        <React.Fragment>
          {shippingAddresses.map((item, index) => (
            <React.Fragment key={index}>
              <div className="order-details-row aolp-order-shipping-name">
                <span className="order-details-label">お名前</span>
                <span className="order-details-value">
                  {item.lastname} {item.firstname}
                </span>
              </div>
              <div className="order-details-row aolp-order-shipping-name-kana">
                <span className="order-details-label">お名前カナ</span>
                <span className="order-details-value">
                  {item.lastnamekana} {item.firstnamekana}
                </span>
              </div>
              <div className="order-details-row aolp-order-shipping-phone">
                <span className="order-details-label">電話番号</span>
                <span className="order-details-value">{item.telephone}</span>
              </div>
              <div className="order-details-row aolp-order-street-address">
                <span className="order-details-label">住所</span>
                <span className="order-details-value">
                  {item.region.label}
                  {item.city}
                  {item.street}
                </span>
              </div>
              <div className="order-details-row aolp-order-postal-code">
                <span className="order-details-label">郵便番号</span>
                <span className="order-details-value">〒{item.postcode}</span>
              </div>
            </React.Fragment>
          ))}
        </React.Fragment>
      );
    } else {
      return <Loader />;
    }
  }

  function OrderSummary() {
    if (orderSummary !== undefined && selectedPaymentMethod) {
      return (
        <React.Fragment>
          <div className="order-details-row aolp-order-prod-total">
            <span className="order-details-label">商品合計（税込）</span>
            <span className="order-details-value">
              <NumberFormat number={orderSummary.subtotal_incl_tax} />円
            </span>
          </div>
          <div className="order-details-row aolp-order-gift-wrapping">
            <span className="order-details-label">ギフト包装合計（税込）</span>
            <GiftWrappingPrice />
          </div>
          <div className="order-details-row aolp-order-shipping-fee">
            <span className="order-details-label">送料合計（税込）</span>
            <span className="order-details-value">
              <NumberFormat number={orderSummary.shipping_incl_tax} />円
            </span>
          </div>
          <div className="order-details-row aolp-order-cod">
            <span className="order-details-label">代引き手数料（税込）</span>
            <span className="order-details-value">
              {/* No variable for this value */}
              {segmentsMap.get("fee")}円
            </span>
          </div>
          {/*
          <div className="order-details-row aolp-order-points-use">
            <span className="order-details-label">使用するポイント</span>
            <span className="order-details-value">points to use円</span>
          </div>
          */}
          <div className="order-details-row aolp-order-discounted-price">
            <span className="order-details-label">割引価格（税込）</span>
            <span className="order-details-value">
              <NumberFormat number={orderSummary.discount_amount} />円
            </span>
          </div>
          <div className="order-details-row aolp-order-total-payment">
            <span className="order-details-label text-red">
              お支払い合計金額（税込）
            </span>
            <span className="order-details-value text-red">
              <NumberFormat
                number={orderSummary.grand_total + orderSummary.tax_amount}
              />
              円
            </span>
          </div>
          <div className="order-details-row aolp-order-points-earned">
            <span className="order-details-label">獲得予定ポイント合計</span>
            <span className="order-details-value">
              {/* No variable for this value */}0
            </span>
          </div>
          <PaymentButton />
        </React.Fragment>
      );
    } else {
      return <Loader />;
    }
  }

  function PaymentButton() {
    if (selectedPaymentMethod) {
      let buttonLabel =
        selectedPaymentMethod === "paygent" &&
        selectedPaymentMethodLabel == "クレジットカード（カード情報入力へ進む）"
          ? "クレジットカード情報の入力へ進む"
          : "注文確定";
      return (
        <React.Fragment>
          {/* Submit button */}
          <button className="order-submit" onClick={handlerOrderSubmit}>
            {buttonLabel}
          </button>
        </React.Fragment>
      );
    }
  }

  if (Object.keys(cartData).length !== 0) {
    return (
      <div className="aolp-order-confirm">
        <h3>ご注文内容の確認</h3>
        <div className="aolp-order-confirm-content">
          <div className="row">
            <div className="col-lg-7 order-confirm-left">
              <div className="aolp-order-details">
                {/* Product Details */}
                <div className="aolp-order-row aolp-order-details-prodinfo">
                  <div className="aolp-section-title">注文内容</div>
                  <OrderProductItems />
                </div>

                {/* Billing Address */}
                <div className="aolp-order-row aolp-order-details-shipping-address">
                  <div className="aolp-order-row-header">
                    <div className="header-col aolp-section-title">
                      請求先住所
                    </div>
                    <div className="header-col fix-link">
                      <a href="#">修正する</a>
                    </div>
                  </div>
                  <OrderBillingAddress />
                </div>

                {/* Shipping Address */}
                <div className="aolp-order-row aolp-order-details-shipping-address">
                  <div className="aolp-order-row-header">
                    <div className="header-col aolp-section-title">
                      お届け先住所
                    </div>
                    <div className="header-col fix-link">
                      <a href="#">修正する</a>
                    </div>
                  </div>
                  <OrderShippingAddress />
                </div>

                {/* Delivery Information */}
                <div className="aolp-order-row aolp-order-details-delivery">
                  <div className="aolp-order-row-header">
                    <div className="header-col aolp-section-title">
                      お届け希望日時
                    </div>
                    <div className="header-col fix-link">
                      <a href="#">修正する</a>
                    </div>
                  </div>
                  <div className="order-details-row aolp-order-delivery-date">
                    <span className="order-details-label">お届け希望日</span>
                    <span className="order-details-value">
                      {deliveryInfo.deliveryDate}
                    </span>
                  </div>
                  <div className="order-details-row aolp-order-delivery-time">
                    <span className="order-details-label">
                      お届け希望時間帯
                    </span>
                    <span className="order-details-value">
                      {deliveryInfo.deliveryTimeLabel}
                    </span>
                  </div>
                </div>

                {/* Coupon Code
                <div className="aolp-order-row aolp-order-details-coupon">
                  <div className="aolp-section-title">クーポンコード</div>

                  <div className="order-details-row aolp-order-coupon-code">
                    <span>Copupon Code</span>
                  </div>
                </div>
                */}

                {/* Shopping Points
                <div className="aolp-order-row aolp-order-details-points">
                  <div className="aolp-section-title">ショッピングポイント使用方法</div>

                  <div className="order-details-row aolp-order-shopping-points">
                    <p>ポイントを使用しない<br /> （現在の保有ポイント：0ポイント）</p>
                  </div>
                </div>
                 */}

                {/* Payment Method */}
                <div className="aolp-order-row aolp-order-details-payment-method">
                  <div className="aolp-order-row-header">
                    <div className="header-col aolp-section-title">
                      お支払方法
                    </div>
                    <div className="header-col fix-link">
                      <a href="#">修正する</a>
                    </div>
                  </div>
                  <div className="order-details-row aolp-order-pmethod-name">
                    <p>{selectedPaymentMethodLabel}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Confirm Right Sidebar */}
            <div className="col-lg-5 order-confirm-right">
              <div className="aolp-order-row aolp-order-amount">
                <div className="aolp-section-title">ご注文金額</div>
                {/* Shipping Address */}
                <OrderSummary />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <Loader />;
  }
}

const mapStateToProps = (state) => ({
  deliveryAddress: getDeliveryAddress(state),
  cartId: getCartIdSelector(state),
  cartData: getCartDataSelector(state),
});
export default connect(mapStateToProps)(OrderConfirm);
