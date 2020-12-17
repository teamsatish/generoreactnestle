import { gql } from '@apollo/client'

const POST_VERIFICATION_CODE = gql`
  mutation Verify($token: String!, $firstname: String!, $lastname: String!, $firstnamekana: String!, $lastnamekana: String!, $email: String!, $password: String!, $gender: Int!, $date_of_birth: String!, $allow_email_magazine: Int!){
    sendEmailVerification(
      input: {
      g_recaptcha_response: $token
      customer: {
        register_type: "customer"
        firstname: $firstname
        lastname: $lastname
        firstnamekana: $firstnamekana
        lastnamekana: $lastnamekana
        email: $email
        password: $password
        gender: $gender
        date_of_birth: $date_of_birth
        allow_email_magazine: $allow_email_magazine
        pure_mail_permission: 1
      }
      custom_options: {
              enable_sending_email: true
              email_template_type: 1
          }
    }
  ) {
      status
      type
  }
}
`

const POST_TOKEN = gql`
  mutation {
    generateCustomerToken(
      useCookie: true
    ) {
      token
      created_at
    }
  }
`

const POST_LOGIN = gql`
  mutation createToken($email: String!, $pwd: String!) {
    generateCustomerToken(
      email: $email
      password: $pwd
      useCookie: false
    ) {
      token
      created_at
    }
  }
`

const POST_CART = gql`
  mutation {
    createEmptyCart
  }
`

const POST_ADD_PRODUCTS_TO_CART = gql`
  mutation AddSimpleProductsToCart($cart_id: String!, $sku: String!, $quantity: Float!) {
    addSimpleProductsToCart(
      input: {
        cart_id: $cart_id
        cart_items: [
          {
            data: {
              quantity: $quantity
              sku: $sku
            }
          }
        ]
      }
    ) {
      cart {
        prices {
          grand_total{
            value
            currency
          }
        },
        items {
          id
          product {
            name
            sku
          }
          quantity
          ... on BundleCartItem {
            bundle_options {
              id
              label
              type
              values {
                id
                label
                price
                quantity
              }
            }
          }
        }
      }
    }
  }
`

const POST_UPDATE_CART = gql`
  mutation UpdateItems($cart_id: String!, $item_id: Int!, $qty: Int!) {
    updateCartHeaderInfo (
      cart_id: $cart_id
      input: {
        empty_cart: false
        items: {
          cartItem: {
            item_id: $item_id
            qty: $qty
          }
        }
      }
    ) {
      mini_cart{
        code
        message {
          type
          text
        }
        data {
          mini_cart {
            code
            id
            created_at
            updated_at
            is_active
            is_virtual
            items_count
            items_qty
            customer_is_guest
            is_guest_checkout_allowed
            order_type
            items {
              item_id
              sku
              name
              image_url
              product_type
              quote_id
              min_qty
              max_qty
              qty
              price_number
              price
              subtotal_number
              subtotal
              delivery_type
              gift_wrapping
              selected_gift_wrapping_id
              gift_wrapping_options {
                gift_wrapping_id
                gift_wrapping
                gift_wrapping_price
              }
              is_riki_machine
              case_display
            }
          }
        }
      }
    }
  }
`

const POST_PAYMENT_METHOD = gql`
  mutation selectPaymentmethod($payment_info: SetRikiPaymentMethodOnCartInput!){
    setRikiPaymentMethodOnCart(
      input: $payment_info
    ) {
      cart {
        selected_payment_method {
          code
          title
        }
      }
    }
  }
`

const POST_BILLING_ADDRESS = gql`
  mutation addBillingAddress($cart_id: String!, $same_as_shipping: Boolean, $address: CartAddressInput){
  setBillingAddressOnCart(
    input: {
      cart_id: $cart_id
      billing_address: {
        same_as_shipping: $same_as_shipping
        address: $address
      }
    }
  ) {
      id
      email
      billing_address {
        customer_notes
        firstname
        firstnamekana
        lastname
        lastnamekana
        company
        street
        city
        region{
          code
          label
        }
        postcode
        telephone
        country {
          code
          label
        }
      }
    }
  }
`

const POST_SHIPPING_ADDRESS = gql`
  mutation addShippingAddress($cart_id: String!, $address: CartAddressInput){
  setShippingAddressesOnCart(
    input: {
      cart_id: $cart_id
      shipping_addresses: {
        address: $address
      }
    }
  ) {
    id
    applied_coupon {
      code
    }
    applied_reward_point{
      reward_user_setting
      reward_user_redeem
    }
    email
    shipping_addresses {
      firstname
      firstnamekana
      lastname
      lastnamekana
      company
      street
      city
      region {
        code
        label
      }
      postcode
      telephone
      country {
        code
        label
      }
      available_shipping_methods {
        amount {
          currency
          value
        }
        available
        carrier_code
        carrier_title
        error_message
        method_code
        method_title
        price_excl_tax {
          value
          currency
        }
        price_incl_tax {
          value
          currency
        }
      }
    }
    billing_address {
      customer_notes
    }
    payment_methods{
      code
      title
      description
    }
    delivery_info {
      delivery_type
      min_date
      max_date
      period
      unavailable_date
    }
    delivery_time_list {
      label
      value
    }
    selected_payment_method {
      code
      title
    }
    point_balance
    totals{
      grand_total
      base_grand_total
      subtotal
      base_subtotal
      discount_amount
      base_discount_amount
      subtotal_with_discount
      base_subtotal_with_discount
      shipping_amount
      base_shipping_amount
      shipping_discount_amount
      base_shipping_discount_amount
      tax_amount
      base_tax_amount
      weee_tax_applied_amount
      shipping_tax_amount
      base_shipping_tax_amount
      subtotal_incl_tax
      shipping_incl_tax
      base_shipping_incl_tax
      base_currency_code
      quote_currency_code
      items_qty
      items {
        item_id
        price
        base_price
        qty
        row_total
        base_row_total
        row_total_with_discount
        tax_amount
        base_tax_amount
        tax_percent
        discount_amount
        base_discount_amount
        discount_percent
        price_incl_tax
        base_price_incl_tax
        row_total_incl_tax
        base_row_total_incl_tax
        options
        weee_tax_applied_amount
        weee_tax_applied
        name
      }
      total_segments {
        code
        title
        value
        area
        extension_attributes {
          attribute_code
          value
        }
      }
      extension_attributes {
        attribute_code
        value
      }
    }
  }
}
`

const POST_ORDER = gql`
  mutation order($cart_id: String!, $delivery_info: DeliveryInfoInput, $custom_options: CustomOptions) {
    placeOrder (
      input: {
        cart_id: $cart_id
        delivery_info: [$delivery_info]
        custom_options: $custom_options
      }
    ){
      order {
        order_number
        order_status
        created_at
        paygent_url
        paygent_limit_date
      }
    }
  }
`

const POST_UPDATE_ADDRESS = gql`
  mutation UpdateAddressQuery($cart_id: String!, $customer_address: CustomerAddressInput){
    updateCartAdrress(
      input: {
        cart_id: $cart_id
        address: $customer_address
      }
    ){
      totals {
        grand_total
      }
      shipping_addresses {
        firstname
        lastname
        company
        street
        city
        region{
          code
          label
        }
        postcode
        telephone
        country {
          code
          label
        }
      }
  }
}
`
const POST_AUTH_KEY_VARIFICATION = gql`
  mutation Verify($authKey: String!, $firstname: String!, $lastname: String!, $firstnamekana: String!, $lastnamekana: String!, $email: String!, $password: String!, $gender: Int!, $date_of_birth: String!, $allow_email_magazine: Int!){
    registerCustomerAccount(
      input: {
      customer: {
        register_type: "customer"
        firstname: $firstname
        lastname: $lastname
        firstnamekana: $firstnamekana
        lastnamekana: $lastnamekana
        email: $email
        password: $password
        gender: $gender
        date_of_birth: $date_of_birth
        allow_email_magazine: $allow_email_magazine
        pure_mail_permission: 1
      }
        verify_code: $authKey
    }
  ) {
      consumer_db_id
      customer_id
  }
}
`
const POST_ZIP_CODE = gql`
  mutation GetPostalCode($code: String!){
    getPostcodeInfo(
      postcode: $code
    ) {
      prefecture_code
      prefecture_name
      postcode
      city_code
      town_name
    }
  }
`

const POST_REMOVE_ITEM = gql`
  mutation RemoveItem($cart_id: String!, $item_id: Int!) {
    removeItemFromCart(
      input: {
        cart_id: $cart_id,
        cart_item_id: $item_id
      }
    ) {
      id
    }
  }
`
const POST_APPLY_COUPON_TO_CART = gql`
  mutation applyCoupon($cartId: String!, $couponCode: String!){
    applyCouponToCart(
      input: {
        cart_id: $cartId,
        coupon_code: $couponCode
      }
    ) {
      id
      applied_coupon {
        code
      }
      applied_reward_point {
        reward_user_setting
        reward_user_redeem
      }
      point_balance
    }
  }
`

export default {
  POST_VERIFICATION_CODE,
  POST_TOKEN,
  POST_LOGIN,
  POST_CART,
  POST_ADD_PRODUCTS_TO_CART,
  POST_PAYMENT_METHOD,
  POST_SHIPPING_ADDRESS,
  POST_BILLING_ADDRESS,
  POST_ORDER,
  POST_UPDATE_CART,
  POST_UPDATE_ADDRESS,
  POST_AUTH_KEY_VARIFICATION,
  POST_ZIP_CODE,
  POST_REMOVE_ITEM,
  POST_APPLY_COUPON_TO_CART
}
