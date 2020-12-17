import React from 'react';
import { connect } from 'react-redux';
import RegistrationForm from '../RegistrationForm/RegistrationForm'
import BillingAddressForm from '../BillingAddressForm/BillingAddressForm'
import ShippingAddressForm from '../ShippingAddressForm/ShippingAddressForm'
import PrivacyBlock from '../../../PrivacyBlock'
import { isLoggedIn } from '../../../utils'
import { getCartIdSelector, getCustomerDetailsSelector } from '../../../store/selectors';

function NhsFormComponent({ disablePaymentMethodForm, status, isSubmitting, values, errors, handleSubmit, isValid, addresses, cartId, customerData, hasError, setShowShippingForm, setIsAddressButtonDisabled, isAddressButtonDisabled, ...form }) {
  return (
    <form noValidate onSubmit={handleSubmit} >
      {!isLoggedIn() && <RegistrationForm values={values} form={form} />}
      <BillingAddressForm form={form} />
      {<ShippingAddressForm form={form} values={values} setShowShippingForm={setShowShippingForm} setIsAddressButtonDisabled={setIsAddressButtonDisabled} />}
      {<div className="short-registration-page">
        <div className="container short-registration-content react-registration-container">
          <div className="form-timeline">
            <div className="form-timeline-inner">
              <div className="short-registration-form">
                <div className="form-content">

                  <div className="privacy-block">
                    <PrivacyBlock />
                  </div>
                  {hasError && (
                    <div className="divider">
                      <p className="form-row fields-label req-before clearfix form-red-heading">カートに商品を追加してください</p>
                    </div>
                  )}
                  <div className="form-group row">
                    <div className="col-md-12 form-col">
                      <div className="submit-control text-center">
                        <div className="form-actions js-form-wrapper form-wrapper">
                          <div className="form-actions">
                            <button className="btn btn-res-form btn__submit button js-form-submit form-submit"
                              type="submit" name="op" value="新規登録--" disabled={isAddressButtonDisabled}
                            >{isSubmitting ? '住所を確定し、以下の情報を入力する' : '住所を確定し、以下の情報を入力する'}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </form>
  )
}

const mapStateToProps = (state) => ({
  cartId: getCartIdSelector(state),
  customerData: getCustomerDetailsSelector(state),
})
export default connect(mapStateToProps)(NhsFormComponent);
