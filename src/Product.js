import React, { useRef } from "react";
import { connect } from "react-redux";
import NumberFormat from "./NumberFormat";
import { getProductSelector } from "./store/selectors";
import ProductQuantityComponent from './ProductQuantityComponent';
import { isLoggedIn } from "./utils";

function Product({ product }) {

  //Scroll Focus
  const scrollRef = useRef(null);
  const scrollToRef = () =>
    scrollRef.current && scrollRef.current.scrollIntoView({ behavior: "smooth" });
  if (isLoggedIn()) {
    setTimeout(function () { scrollToRef(); }, 2000);
  }

  return <>
    {product && (
      <main className="aolp-products">

        <div className="container aolp-product-info">
          <div className="lp-product">
            <h4>ご注文内容</h4>
            <div className={product.sku}>
              <div className="aolp-prod-image">
                <img alt="product-image" src={product.image.url} />
              </div>
              <p className="aolp-prod-name">{product.name}</p>
            </div>
            <div ref={scrollRef}></div>
            <div className="row aolp-price-qty">
              <div className="col-6 col-md-4 aolp-prod-col aolp-price-col">
                <div className="aolp-amount">
                  <NumberFormat number={product.price} />
                  円（税込）
              </div>
              </div>
              <div className="col-6 col-md-4 aolp-prod-col aolp-points-col">
                {/* <div className="points-value">９ポイント</div> */}
              </div>
              <div className="col-md-4 aolp-prod-col aolp-qty-col">
                <ProductQuantityComponent orderConfirmPage={false} />
              </div>
            </div>

            <div className="aolp-note">
              <p>
                ※初めてご購入の方（お一人様2セットまで）のみとさせて頂きます。
            </p>
            </div>
          </div>
        </div>
      </main>
    )
    }</>
}

const mapStateToProps = (state) => ({
  product: getProductSelector(state),
});
export default connect(mapStateToProps)(Product);
