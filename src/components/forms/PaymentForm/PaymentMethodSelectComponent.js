import React from 'react'

export default function PaymentMethodSelectComponent({ name, onChange, value, paymentMethods, disabled, ...props }) {
  const allowed_payment_methods = ['paygent', 'cashondelivery', 'none'];

  return (
    <select
      className="form-control form-select select-manage"
      name={name}
      onChange={onChange}
      value={value}
      disabled={disabled}
    >
      {
        paymentMethods.map((method, index) => {
          if (allowed_payment_methods.indexOf(method.code) !== -1) {
            return <option key={index} value={method.title}>{method.title}</option>
          }
        })
      }
    </select>
  )
}