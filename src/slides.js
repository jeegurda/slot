import { deadzone, textShiftModifier } from './params'
import { isMobile } from './utils'

const space = document.querySelector('.space')
const textSlides = Array.from(document.querySelectorAll('.text-content'))
const mediaSlides = Array.from(document.querySelectorAll('.media-content'))
const totalSlides = Math.max(textSlides.length, mediaSlides.length)
const slidesContainer = document.querySelector('.slides')

let activeSlide = null

const activateSlide = id => {
  if (id === activeSlide) {
    return
  }

  if (mediaSlides[activeSlide]) {
    mediaSlides[activeSlide].classList.remove('active')

    const video = mediaSlides[activeSlide].querySelector('video')

    video.pause()
  }

  if (id !== null) {
    mediaSlides[id].classList.add('active')

    const video = mediaSlides[id].querySelector('video')

    video.play()
  }

  if (textSlides[activeSlide]) {
    textSlides[activeSlide].classList.remove('active')
  }

  if (id != null) {
    textSlides[id].classList.add('active')
  }

  activeSlide = id
}

// Piecewise function
const transformShift = (raw, modifier) => {
  const premodified = (() => {
    const deadzoneStart = (1 - deadzone) / 2

    if (raw < deadzoneStart) {
      return raw / deadzoneStart // return 0..1 for the start of the function
    } else if (raw > deadzoneStart + deadzone) {
      return (1 - raw) / deadzoneStart // return 1..0 for the end of the function
    } else {
      return 1 // flat 1 in the middle of the function
    }
  })()

  return 1 - modifier + premodified * modifier
}

const shiftSlides = (currentSlide, currentScroll) => {
  if (currentSlide === null) {
    return
  }

  // Reverse for even slides (slides already moved by default, so moving negative is actually moving at its original place)
  const sign = currentSlide % 2 === 1 ? 1 : -1

  const rawShift = (currentScroll % window.innerHeight) / window.innerHeight

  const mediaShiftDistance = (slidesContainer.clientWidth - mediaSlides[currentSlide].clientWidth) / 2
  const textShiftDistance = (slidesContainer.clientWidth - textSlides[currentSlide].clientWidth) / 2

  // Media goes opposite side
  const mediaShift = -sign * transformShift(rawShift, 1) * mediaShiftDistance
  const textShift = sign * transformShift(rawShift, textShiftModifier) * textShiftDistance
  const opacityShift = transformShift(rawShift, 1)

  mediaSlides[currentSlide].style.transform = `translateX(${mediaShift}px)`
  textSlides[currentSlide].style.transform = `translateX(${textShift}px)`

  textSlides[currentSlide].style.opacity = opacityShift
}

const handleScroll = () => {
  const minScroll = window.innerHeight * (0.5 + deadzone / 2)
  const maxScroll = window.innerHeight * totalSlides - minScroll

  let currentScroll = document.documentElement.scrollTop + minScroll

  // Max scroll that slides will react to
  const limitedScroll = Math.min(
    currentScroll,
    maxScroll
  )

  // Scroll is past the limit, compensate its max scroll by the scroll distance last slide was viewport-fixed
  if (currentScroll > limitedScroll) {
    currentScroll = currentScroll - (1 - deadzone) / 2 * window.innerHeight
  }

  // Next slide to be selected
  let currentSlide = Math.floor(currentScroll / window.innerHeight)

  if (currentSlide > totalSlides - 1) {
    currentSlide = null
  }

  activateSlide(currentSlide)
  shiftSlides(currentSlide, limitedScroll)
}

const resizeSpace = () => {
  // Compensate deadzone-altered initial scroll
  space.style.height = `${window.innerHeight * (totalSlides - 1) - window.innerHeight * deadzone}px`
}

const init = () => {
  window.addEventListener('scroll', () => {
    if (isMobile()) {
      return
    }

    handleScroll()
  })

  window.addEventListener('resize', () => {
    if (isMobile()) {
      return
    }

    resizeSpace()
    handleScroll()
  })

  resizeSpace()
  handleScroll()
}

export default init
