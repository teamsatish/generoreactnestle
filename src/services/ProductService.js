import { get } from 'lodash';
import ApiService from "./ApiService";
import MagentoQueries from "../queries";
import { store } from "../store/store";
import { setProduct } from '../store/appStore/product';

class ProductService {
  async fetchProductDetails() {
    const { data: response } = await ApiService.query(MagentoQueries.GET_ALL_PRODUCTS, {
      variables: {
        sku: window.drupalSettings.sku,
      }
    }
    );
    const product = get(response, 'products.items.0', null);
    if (product) {
      console.log('App.js useLazyQuery Fetch Projects')
      store.dispatch(setProduct(product));
    } else {
      console.error(`Failed to fetch product detail for sku ${window.drupalSettings.sku}`)
    }
  }
}

export default new ProductService();
