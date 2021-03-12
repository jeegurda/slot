import { wordsInterval } from './params'

let activeWord = null
const words = Array.from(document.querySelectorAll('.dynamic-word p'))

const changeWord = id => {
  if (words[activeWord]) {
    words[activeWord].classList.remove('active')
  }
  words[id].classList.add('active')

  activeWord = id
}

const init = () => {
  changeWord(0)
}

const start = () => {
  setInterval(() => {
    changeWord((activeWord + 1) % words.length)
  }, wordsInterval)
}

export {
  init,
  start
}
