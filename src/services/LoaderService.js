import { store } from "../store/store";
import { setShowLoader, setHideLoader } from "../store/appStore/loader";

class LoaderService {
  showLoader() {
    store.dispatch(setShowLoader())
  }

  hideLoader() {
    store.dispatch(setHideLoader())
  }
}

export default new LoaderService()
