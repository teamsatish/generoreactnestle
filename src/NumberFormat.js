import React from 'react'

function NumberFormat (props) {
  const number = props.number
  return new Intl.NumberFormat().format(number)
}

export default NumberFormat
