export function cleanupOrderStorage() {
  localStorage.removeItem('lp_order')
  localStorage.removeItem('CART_ID')
  localStorage.removeItem('delivery_info')
  localStorage.removeItem('cart_quantity')
  localStorage.removeItem('lp_items')
}

export function cleanupToken() {
  localStorage.removeItem('BEARER_TOKEN')
}