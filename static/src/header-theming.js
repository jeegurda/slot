import { isMobile } from './utils'

const headerTheming = () => {
  const plans = document.querySelector('.plans')
  const header = document.querySelector('header')

  const handleScroll = () => {
    if (isMobile()) {
      return
    }

    const overPlans = (
      plans.getBoundingClientRect().top - header.clientHeight / 2 < 0 &&
      plans.getBoundingClientRect().bottom - header.clientHeight / 2 > 0
    )

    if (overPlans) {
      header.classList.add('over-plans')
    } else {
      header.classList.remove('over-plans')
    }
  }

  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleScroll)
  handleScroll()
}

export default headerTheming
