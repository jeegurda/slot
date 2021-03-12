const sources = Array.from(document.querySelectorAll('source[data-src]'))
const slideVideos = Array.from(document.querySelectorAll('.slides video'))

const loadMedia = () => {
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

const loadWithMinTimer = () => {
  const minTimer = new Promise(resolve => setTimeout(resolve, 1000))

  return Promise.all([
    loadMedia(),
    minTimer
  ])
}

export default loadWithMinTimer
