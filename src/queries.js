import { gql } from 'apollo-boost'

const GET_ALL_PRODUCTS = gql`
  query Products($sku: String!) {
    products(filter: { sku: { eq: $sku } } ) {
      items {
        name
        sku
        price
        image {
          url
          label
        }
        stock_item {
          is_in_stock
          qty
        }
      }
    }
  }
`

const GET_EMAIL_EXISTS = gql`
  query emailQuery($email: String!) {
    selectCustomer(
      email: $email
    ) {
      is_email_available
    }
  }
`

const GET_CART = gql`
  query getCartQuery($cartId: String) {
    getCart(cart_id: $cartId) {
      id
      shipping_same_as_billing
      applied_coupon {
        code
      }
      applied_reward_point {
        reward_user_setting
        reward_user_redeem
      }
      point_balance
      email
      billing_address {
        city
        country {
          code
          label
        }
        firstname
        firstnamekana
        lastname
        lastnamekana
        postcode
        region {
          code
          label
        }
        street
        telephone
        company
      }
      shipping_addresses {
        firstname
        firstnamekana
        lastname
        lastnamekana
        postcode
        street
        city
        region {
          code
          label
        }
        country {
          code
          label
        }
        telephone
        company
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
        selected_shipping_method {
          amount {
            value
            currency
          }
          carrier_code
          carrier_title
          method_code
          method_title
        }
        cart_items {
          cart_item_id
          quantity
        }
        cart_items_v2 {
          id
          quantity
          prices {
            price {
              value
            }
            row_total {
              value
            }
            row_total_including_tax {
              value
            }
            discounts {
              amount {
                value
              }
              label
            }
            total_item_discount {
              value
            }
          }
          product {
            sku
            id
            name
            thumbnail {
              url
            }
            gift_wrapping {
              gw_id
              label
              price
            }
          }
        }
      }
      selected_payment_method {
        code
        title
      }
      payment_methods {
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
      totals {
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
        coupon_code
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
          extension_attributes{
            attribute_code
            value
          }
        }
        extension_attributes{
          attribute_code
            value
        }
      }
    }
  }
`

const GET_PURE_ADDRESS_TYPE = gql`
  query GetAddress($riki_type_address: String!) {
    pureAddress(filter: { riki_type_address: { eq: $riki_type_address } }) {
      items {
        id
        pure_address_type
        riki_nickname
        region {
          region_id
          region
        }
        street
        telephone
        firstname
        lastname
        firstnamekana
        lastnamekana
        postcode
        riki_type_address
      }
      total
    }
  }
`

// Get customer address from the current customer.
const GET_CUSTOMER = gql`
  query GetCustomer {
    customer {
      firstname
      lastname
      firstnamekana
      lastnamekana
      suffix
      email
      addresses {
      id
      riki_type_address
      riki_nickname
        firstname
        lastname
        firstnamekana
        lastnamekana
        street
        city
        region {
          region_code
          region
        }
        postcode
        country_code
        telephone
      }
    }
  }
`

// Get customer cart from the current customer.
const GET_CUSTOMER_CART = gql`
  query GetCustomerCart {
    customerCart {
      id
      items {
        id
        product {
          name
          sku
        }
        quantity
      }
    }
  }
`

const GET_CART_HEADER_INFO = gql`
  query GetCartHeader($cartId: String!) {
    getCartHeaderInfo(
      cart_id: $cartId
    ) {
    mini_cart {
        code
        id
        created_at
        updated_at
        is_active
        is_virtual
        items_count
        items_qty
        currency{
            global_currency_code
            base_currency_code
            store_currency_code
            quote_currency_code
            store_to_base_rate
            store_to_quote_rate
            base_to_global_rate
            base_to_quote_rate
        }
        customer_is_guest
        is_guest_checkout_allowed
        store_id
        subtotal_incl_tax_number
        subtotal_incl_tax
        frequency_id
        riki_hanpukai_qty
        is_hanpukai_cart
        riki_course_id
        riki_course_name
        riki_course_code
      	riki_course_type
        order_type
        checkout_url
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
            is_addition
            unit_qty
        }
    }
  }
}
`
const GET_CART_ITEMS = gql`
  query GetCartItems($cartId: String!) {
    cart(cart_id: $cartId) {
      email
      items {
        id
        product {
          name
          sku
        }
        quantity
      }
    }
  }
`
export default {
  GET_ALL_PRODUCTS,
  GET_EMAIL_EXISTS,
  GET_CART,
  GET_PURE_ADDRESS_TYPE,
  GET_CUSTOMER,
  GET_CUSTOMER_CART,
  GET_CART_HEADER_INFO,
  GET_CART_ITEMS
}
