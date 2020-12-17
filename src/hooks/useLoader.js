import { useEffect } from 'react'
import { getShowLoaderSelector } from '../store/selectors';
import { useSelector } from 'react-redux';

function useLoader() {

  const showLoader = useSelector(getShowLoaderSelector);
  const loaderElements = document.getElementsByClassName('loading-mask')

  useEffect(() => {
    console.log(showLoader);
    if (showLoader) {
      for (let i = 0; i < loaderElements.length; i++) {
        loaderElements[i].style.display = 'block'
      }

      console.log('is Showing loader...')
    } else {
      for (let i = 0; i < loaderElements.length; i++) {
        loaderElements[i].style.display = 'none'
      }
      console.log('is hiding loader...')
    }


  }, [showLoader, loaderElements])
}

export default useLoader;
