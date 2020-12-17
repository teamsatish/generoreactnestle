import React from 'react';
import { cloneDeep } from 'lodash';

import DatePicker, { registerLocale } from 'react-datepicker';
import ja from 'date-fns/locale/ja';
registerLocale('ja', ja);

export default function DatePickerElement({ deliveryDates: fetchedDeliveryDates, value, onChange, disabled = false }) {
  let excluded_dates = [];
  let deliveryDates = cloneDeep(fetchedDeliveryDates);

  // If max and min dates are not defined, set current date.
  if (!deliveryDates.max_date) {
    deliveryDates.max_date = new Date()
  } else {
    deliveryDates.max_date = new Date(deliveryDates.max_date)
  }
  if (!deliveryDates.min_date) {
    deliveryDates.min_date = new Date();
  } else {
    deliveryDates.min_date = new Date(deliveryDates.min_date);
  }
  // Format the date to the required Date object.
  if (deliveryDates.unavailable_date) {
    deliveryDates.unavailable_date.map((date) => {
      excluded_dates.push(new Date(date))
    });
  }
  return (
    <DatePicker
      locale="ja"
      dateFormat="yyyy-MM-dd"
      selected={value}
      onChange={onChange}
      minDate={deliveryDates.min_date}
      maxDate={deliveryDates.max_date}
      excludeDates={excluded_dates}
      placeholderText="指定なし"
      disabled={disabled}
      closeOnScroll={true}
    />
  );
}
