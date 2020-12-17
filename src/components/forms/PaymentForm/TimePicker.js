import React from 'react';

export default function TimePicker({ deliveryTimeOptions, value, name, onChange, disabled = false }) {

  return <select
    name={name}
    className="form-control form-select select-manage"

    disabled={disabled} value={value} onChange={onChange}>
    {
      deliveryTimeOptions.map((time) => {
        return (<option key={time.value} value={time.value}>{time.label}</option>)
      })
    }
  </select>
}