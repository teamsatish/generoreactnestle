import React from "react";
import { Formik } from 'formik';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import MagentoMutations from '../../../mutation';
import PaymentMethodFormComponent from "./PaymentMethodFormComponent";
import { setDeliveryAddress } from "../../../store/appStore/payment";
import { store } from "../../../store/store";
import { getCartIdSelector, getPaymentConfigSelector } from '../../../store/selectors';
import { defaultPaymentMethod } from './defaultValues';

function PaymentForm({ disablePaymentMethodForm, paymentConfig, cartId }) {
  const { paymentMethods, deliveryTime: deliveryTimeOptions, deliveryDate: deliveryDates, deliveryType, } = paymentConfig;

  const [setPaymentMethodMutation, { loading: mutationLoading, error: mutationError }] = useMutation(MagentoMutations.POST_PAYMENT_METHOD, {
    onCompleted: (data) => {
    }
  });
  const history = useHistory();
  function PaymentFormComponentWraper(formikProps) {
    return <PaymentMethodFormComponent {...formikProps} paymentMethods={paymentMethods} disablePaymentMethodForm={disablePaymentMethodForm} deliveryDates={deliveryDates} deliveryTimeOptions={deliveryTimeOptions} />
  }

  function handleSubmit(values, actions) {

    const paymentMethodMap = new Map([
      defaultPaymentMethod,
      ...paymentMethods].map(paymentMethod => [paymentMethod.title, paymentMethod]))


    let deliveryTimeLabel = '';
    deliveryTimeOptions.map(time => {
      if (time.value === values.deliveryTime) deliveryTimeLabel = time.label
    })

    let d = values.deliveryDate;
    let d_Year = d.getFullYear();
    let d_Month = d.getMonth() + 1;
    let d_Day = d.getDate();
    let d_full_date = d_Year + "-" + d_Month + "-" + d_Day;
    // selectedPaymentMethod [0: payment code, 1: index]
    const deliveryInfo = {
      deliveryName: deliveryType,
      deliveryDate: d_full_date,
      deliveryTime: values.deliveryTime,
      deliveryTimeLabel: deliveryTimeLabel
    };
    const payInfo = {
      cart_id: cartId,
      payment_method: {
        code: paymentMethodMap.get(values.paymentMethod).code
      }
    };

    if (paymentMethodMap.get(values.paymentMethod).code === 'paygent') {
      // Option 1: Register new card.
      // Option 0: Use existing card.
      payInfo.payment_method.extension_attributes = [{
        attribute_code: "paygent_option",
        value: (paymentMethodMap.get(values.paymentMethod).title === 'クレジットカード（カード情報入力へ進む）') ? "1" : "0"
      }]
    }

    setPaymentMethodMutation({
      variables: {
        cart_id: cartId, payment_info: payInfo
      }
    }).then((value) => {
      store.dispatch(setDeliveryAddress(deliveryInfo));
      history.push({
        pathname: '/confirm',
        search: history.location.search
      })
    });

  }

  return <Formik
    initialValues={{
      paymentMethod: '選択してください', deliveryDate: null, deliveryTime: '-1'
    }} // TODO: change it
    onSubmit={handleSubmit}
    component={PaymentFormComponentWraper} >
  </Formik>
}

export default connect((state) => ({
  cartId: getCartIdSelector(state),
  paymentConfig: getPaymentConfigSelector(state)
}))(PaymentForm);
