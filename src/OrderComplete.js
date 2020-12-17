import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import MagentoClient from './apollo-client'
import { ApolloProvider } from '@apollo/client'
import { cleanupOrderStorage } from './CleanupLocalStorage'
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

function OrderSummary () {

  let order = JSON.parse(localStorage.getItem('lp_order'))

  // Remove the cart id token once the order is placed.
  // New cart id is generated for new order.
  useEffect(() => {
    cleanupOrderStorage()
  }, [])

  const orderNumber = order.orderNumber
  let orderUrl = (location.hostname !== 'shop.nestle.jp') ? 'https://preprod.account.nestle.jp/ec/sales/order/view/order_id/' + orderNumber : 'https://account.nestle.jp/ec/sales/order/view/order_id/' + orderNumber

  function handlerthanksSubmit(e) {
    const redirectUrl = "/"+(window.location.search || "");
    window.location.href =  redirectUrl;
  }

  return (
    <div className="aolp-order-complete">
      <h3>ご注文ありがとうございました。</h3>

      <div className="aolp-order-complete-content">
        <p className="complete-title">ご注文ありがとうございました。</p>
        <p>注文番号は <span className="order-text"> <a href={orderUrl}>【{orderNumber}】</a></span>です。（注文受付日時{order.createdAt}）<br/>
          ※ご注文内容の詳細は、上記注文番号をクリックすることでご確認いただけます。<br/>
          ※ご登録いただきましたメールアドレスに注文完了メールを送信いたします。</p>
      </div>

      <div className="button-section">
        <button className="btn-blue" onClick={handlerthanksSubmit}>トップへ戻る</button>
      </div>
    </div>
  )
}

ReactDOM.render(
<React.StrictMode>
  <ApolloProvider client={MagentoClient}>
    <OrderSummary/>
  </ApolloProvider>
</React.StrictMode>, document.getElementById('order_complete'))
