import { ApolloProvider, useMutation, useQuery } from '@apollo/client'
import MagentoQueries from './../../queries'


export function GetCartData(cartId) {
    return useQuery(MagentoQueries.GET_CART, {
      variables: { 'cartId': cartId }
    }[cartId])
   
  }

