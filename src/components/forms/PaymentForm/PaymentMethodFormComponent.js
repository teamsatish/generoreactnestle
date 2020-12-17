import React from "react";
import PaymentMethodSelectComponent from './PaymentMethodSelectComponent';
import ShowPaymentDescription from './ShowPaymentDescription';
import DatePickerElement from "./DatePickerComponent";
import TimePicker from "./TimePicker";

export default function PaymentFormComponent({ paymentMethods, values, handleChange, deliveryDates, deliveryTimeOptions, disablePaymentMethodForm, ...props }) {
  return (
    <div className="short-registration-page">
      <div className="container short-registration-content react-registration-container">
        <div className="form-timeline">
          <div className="form-timeline-inner">
            <div className="short-registration-form">
              <div className="form-content">
                <div className="form-group row">
                  <div className="col-md-12 form-col">
                    <p className="form-row fields-label req-before clearfix form-red-heading">下記はご登録後に入力可能となります</p>
                  </div>
                </div>
                <div className="divider">
                  <div className="divider-heading">お支払方法</div>
                </div>
                <div className="form-group row">
                  <label htmlFor="gender" className="col-md-3 form-col"></label>
                  <div className="col-md-9 form-col form-email">
                    <div className="js-form-item form-item js-form-type-email form-item-email js-form-item-email form-no-label form-group col-auto">
                      <div className="select-wrapper">
                        <PaymentMethodSelectComponent name="paymentMethod" paymentMethods={paymentMethods} onChange={handleChange} value={values.paymentMethod} {...props} disabled={disablePaymentMethodForm} />
                        <ShowPaymentDescription paymentMethod={values.paymentMethod} paymentMethods={paymentMethods} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="divider">
                  <div className="divider-heading">配送情報</div>
                </div>
                <div className="form-group row">
                  <div className="col-md-12 form-col">
                    <div className="row name-kanji">
                      <div className="col-md-6 delivery-date">
                        <div className="js-form-item form-item js-form-type-textfield form-item-last-name js-form-item-last-name form-group col-auto">
                          <label htmlFor="edit-last-name delivery-label" className="js-form-required form-required col-form-label">お届け希望日</label>
                          <DatePickerElement deliveryDates={deliveryDates} onChange={(date) => props.setFieldValue('deliveryDate', date)} value={values.deliveryDate} disabled={disablePaymentMethodForm} {...props} />
                        </div>
                      </div>
                      <div className="col-md-6 delivery-time">
                        <div className="js-form-item form-item js-form-type-textfield form-item-first-name js-form-item-first-name form-group col-auto">
                          <label htmlFor="edit-first-name delivery-label" className="js-form-required form-required col-form-label">お届け希望時間帯</label>
                          <div className="select-wrapper">
                            <TimePicker name="deliveryTime" deliveryTimeOptions={deliveryTimeOptions} onChange={handleChange} value={values.deliveryTime} disabled={disablePaymentMethodForm} {...props} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-12 form-col">
                    <div className="submit-control text-center">
                      <div className="form-actions js-form-wrapper form-wrapper">
                        <div className="form-actions">
                          <button className="btn btn-res-form btn__submit button js-form-submit form-submit" type="button" name="op" onClick={props.submitForm} disabled={disablePaymentMethodForm} >注文内容の確認</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-12 form-col">
                    <div className="registration-note">※新規会員登録の場合、仮登録完了メールが送信されますので、「@nestle.jp」「@jp.nestle.com」のドメインからのメールを受信できるように設定してください。</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
