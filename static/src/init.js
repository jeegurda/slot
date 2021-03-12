import { isMobile } from './utils'

const hideLoader = () => {
  document.querySelector('.loader').classList.add('done')
  if (!isMobile()) {
    document.querySelector('.root').classList.add('initialized')
  }
}

const resetPosition = () => {
  if (!isMobile()) {
    document.documentElement.scrollTop = 0
  }
}

export {
  hideLoader,
  resetPosition
}
