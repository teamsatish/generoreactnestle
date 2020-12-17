import React, { useEffect, useState, useCallback } from 'react'
import { connect } from "react-redux";
import BillingAddressComponent from './BillingAddressFormComponent'
import { store } from "../../../store/store";
import { getCartIdSelector, getCustomerDetailsSelector } from '../../../store/selectors';

function BillingAddress({ customerData = {}, form }) {
  return (
    <div className="short-registration-page">
      <div className="container short-registration-content react-registration-container">
        <div className="form-timeline">
          <div className="form-timeline-inner">
            <div className="short-registration-form">
              <div className="form-content">
                {customerData && customerData.lastname && <div className="username">{customerData.lastname} {customerData.firstname} 様</div>}
                <div className="divider">
                  <div className="divider-heading">ご連絡先</div>
                </div>
                <BillingAddressComponent form={form} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect((state) => ({
  cartId: getCartIdSelector(state),
  customerData: getCustomerDetailsSelector(state),
}))(BillingAddress);