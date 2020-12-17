import OrderConfirmPage from './components/pages/OrderConfirmPage';
import ProductLandingPage from './components/pages/ProductLandingPage';

export default () => [
  {
    path: "/",
    exact: true,
    component: ProductLandingPage,
    meta: { isAuth: false },
  },
  {
    path: "/confirm",
    exact: true,
    component: OrderConfirmPage,
    meta: { isAuth: false },
  }
]