import * as dynamicWords from './dynamic-words'
import addFormEvents from './form'
import headerTheming from './header-theming'
import loadMedia from './load-media'
import initSlides from './slides'
import videoPlayback from './video-playback'
import * as init from './init'

const initApp = () => {
  dynamicWords.init()
  addFormEvents()

  loadMedia()
    .finally(() => {
      init.resetPosition()

      // Resize page
      initSlides()

      /* Calls that require page to have a final height and scroll position */
      headerTheming()
      videoPlayback()

      // Ready to appear
      init.hideLoader()
      dynamicWords.start()
    })
}

initApp()
