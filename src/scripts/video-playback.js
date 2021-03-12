import { isMobile } from './utils'

const watchScrollMedia = media => {
  const checkMediaPosition = () => {
    media.forEach(el => {
      const onPage = (
        el.getBoundingClientRect().top < window.innerHeight &&
        el.getBoundingClientRect().bottom > 0
      )

      if (onPage) {
        el.play()
          .catch(reason => console.log('Playback failed: %o', reason))
      } else {
        el.pause()
      }
    })
  }

  window.addEventListener('scroll', checkMediaPosition)
  window.addEventListener('resize', checkMediaPosition)
  checkMediaPosition()
}

const videoPlayback = () => {
  const pageMedia = Array.from(document.querySelectorAll('.page-media'))
  const slidesMedia = Array.from(document.querySelectorAll('.media-content video'))

  if (isMobile()) {
    watchScrollMedia(slidesMedia.concat(pageMedia))
  } else {
    watchScrollMedia(pageMedia)
  }
}

export default videoPlayback
