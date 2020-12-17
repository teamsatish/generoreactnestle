import React, { useMemo } from "react";
import {defaultPaymentMethod} from './defaultValues';

export default function ShowPaymentDescription({ paymentMethod, paymentMethods }) {
  const paymentMethodsMap = useMemo(() => {
    return new Map([
      defaultPaymentMethod,
      ...paymentMethods].map(paymentMethod => [paymentMethod.title, paymentMethod]))
  }, [paymentMethods]);
  return paymentMethodsMap.get(paymentMethod).description && <div className="payment-method" dangerouslySetInnerHTML={{ __html: paymentMethodsMap.get(paymentMethod).description }} ></div>
}
