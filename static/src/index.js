import dynamicWords from './dynamic-words'
import headerTheming from './header-theming'
import initSlides from './slides'
import { isMobile } from './utils'

const loadMedia = () => {
  const sources = Array.from(document.querySelectorAll('source[data-src]'))
  const slideVideos = Array.from(document.querySelectorAll('.slides video'))

  sources.map(s => (s.src = s.getAttribute('data-src')))

  const loadVideos = slideVideos.map(el => new Promise(resolve => {
    el.addEventListener('loadedmetadata', resolve)
    el.addEventListener('loadeddata', resolve)
    el.load()
  }))

  return Promise.race([
    Promise.all(loadVideos).then(() => 1),
    new Promise(resolve => setTimeout(resolve, 5000)).then(() => 2)
  ])
}

const hideLoader = () => {
  document.querySelector('.loader').classList.add('done')

  if (!isMobile()) {
    document.querySelector('.root').classList.add('initialized')
  }
}

const addFormEvents = () => {
  const formEl = document.querySelector('.form')
  const showFormButtons = Array.from(document.querySelectorAll('.form-show-button'))
  const hideFormButtons = Array.from(document.querySelectorAll('.form-hide-button'))

  const showForm = () => {
    formEl.classList.add('open')
    setTimeout(() => {
      formEl.querySelector('input').focus()
    }, 100)
  }

  const hideForm = () => {
    formEl.classList.remove('open')
  }

  hideFormButtons.map(el => el.addEventListener('click', hideForm))
  showFormButtons.map(el => el.addEventListener('click', showForm))

  formEl.addEventListener('click', e => {
    if (e.target === e.currentTarget) {
      hideForm()
    }
  })

  const select = document.querySelector('select')
  const selectValue = document.querySelector('.select-value')

  const setSelectValue = value => {
    selectValue.innerHTML = value
  }

  select.addEventListener('change', e => {
    setSelectValue(e.target.options[e.target.selectedIndex].innerHTML)
  })

  const form = document.querySelector('.beta-access-form')

  form.addEventListener('submit', e => {
    e.preventDefault()

    // Form action here

    // form.checkValidity();

    form.classList.add('done')
  })
}

const initApp = () => {
  dynamicWords.init()

  const minTimer = new Promise(resolve => setTimeout(resolve, 1000))

  Promise
    .all([
      loadMedia(),
      minTimer
    ])
    .finally(() => {
      if (!isMobile()) {
        document.documentElement.scrollTop = 0
      }
      initSlides()
      addFormEvents()
      headerTheming()
      hideLoader()

      videoPlayback()

      dynamicWords.start()
    })
}

initApp()
