import apolloClient from "../apollo-client";
import { appConfig } from "../config";

class ApiService {
  query(query, options) {
    return apolloClient.query({
      query,
      ...options,
    })
  }

  mutate(mutation, options) {
    return apolloClient.mutate({
      mutation,
      ...options
    })
  }


  async getCitiesListFromPostCode(postalCode) {

    if (appConfig.isLocalDevelopment) {
      // TODO: Dummy City list for postcode 6510087
      return ["\u795e\u6238\u5e02\u4e2d\u592e\u533a \u5fa1\u5e78\u901a"]
    }
    const url = `${appConfig.serverUrl}/postal-detail/${postalCode}`;

    if (postalCode.length >= 7) {
      return fetch(url)
        .then((res) => res.json())
        .then(result => result.city)
    } else {
      return [];
    }
  }
}

export default new ApiService();
