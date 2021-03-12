const textShiftModifier = 0.3; // relative to the media
const deadzone = 0.3; // in screens
const wordsInterval = 2000;
const isMobile = () => window.innerWidth < 1024;

const mediaShiftModifier = 1;

let activeWord = null;
const words = Array.from(document.querySelectorAll('.dynamic-word p'));

const changeWord = id => {
  if (words[activeWord]) {
    words[activeWord].classList.remove('active');
  }
  words[id].classList.add('active');

  activeWord = id;
};

const initDynamicWords = () => {
  changeWord(0);
};

const startDynamicWords = () => {
  setInterval(() => {
    changeWord((activeWord + 1) % words.length)
  }, wordsInterval);
};

const textSlides = Array.from(document.querySelectorAll('.text-content'));
const mediaSlides = Array.from(document.querySelectorAll('.media-content'));
const space = document.querySelector('.space');
const totalSlides = Math.max(textSlides.length, mediaSlides.length);

let activeSlide = null;
const activateSlide = id => {
  if (id === activeSlide) {
    return;
  }

  if (mediaSlides[activeSlide]) {
    mediaSlides[activeSlide].classList.remove('active');

    const video = mediaSlides[activeSlide].querySelector('video');

    video.pause();
  }

  if (id !== null) {
    mediaSlides[id].classList.add('active');

    const video = mediaSlides[id].querySelector('video');

    video.play();
  }

  if (textSlides[activeSlide]) {
    textSlides[activeSlide].classList.remove('active');
  }

  if (id != null) {
    textSlides[id].classList.add('active');
  }

  activeSlide = id;
}

const transformShift = (raw, modifier) => {
  const premodified = (() => {
    const deadzoneStart = (1 - deadzone) / 2;

    if (raw < deadzoneStart) {
      return raw / deadzoneStart; // return 0..1 for the start of the function
    } else if (raw > deadzoneStart + deadzone) {
      return (1 - raw) / deadzoneStart; // return 1..0 for the end of the function
    } else {
      return 1; // flat 1 in the middle of the function
    }
  })();

  return 1 - modifier + premodified * modifier;
}

const slidesContainer = document.querySelector('.slides');

const shiftSlides = (currentSlide, currentScroll) => {
  if (currentSlide === null) {
    return
  }

  // Reverse for even slides (slides already moved by default, so moving negative is actually moving at its original place)
  const sign = currentSlide % 2 === 1 ? 1 : -1;

  const rawShift = (currentScroll % window.innerHeight) / window.innerHeight;

  const mediaShiftDistance = (slidesContainer.clientWidth - mediaSlides[currentSlide].clientWidth) / 2;
  const textShiftDistance = (slidesContainer.clientWidth - textSlides[currentSlide].clientWidth) / 2;

  // Media goes opposite side
  const mediaShift = -sign * transformShift(rawShift, mediaShiftModifier) * mediaShiftDistance;
  const textShift = sign * transformShift(rawShift, textShiftModifier) * textShiftDistance;
  const opacityShift = transformShift(rawShift, 1);

  mediaSlides[currentSlide].style.transform = `translateX(${mediaShift}px)`;
  textSlides[currentSlide].style.transform = `translateX(${textShift}px)`;

  textSlides[currentSlide].style.opacity = opacityShift;
}

const resizeSpace = () => {
  // Compensate deadzone-altered initial scroll
  space.style.height = `${window.innerHeight * (totalSlides - 1) - window.innerHeight * deadzone}px`;
}

const watchScrollMedia = media => {
  const checkMediaPosition = () => {
    media.forEach(el => {
      const onPage = (
        el.getBoundingClientRect().top < window.innerHeight &&
        el.getBoundingClientRect().bottom > 0
      );

      if (onPage) {
        el.play()
          .catch(reason => console.log('Playback failed: %o', reason));
      } else {
        el.pause();
      }
    });
  };

  window.addEventListener('scroll', checkMediaPosition);
  window.addEventListener('resize', checkMediaPosition);
  checkMediaPosition();
}

const videoPlayback = () => {
  const pageMedia = Array.from(document.querySelectorAll('.page-media'));
  const slidesMedia = Array.from(document.querySelectorAll('.media-content video'));

  if (isMobile()) {
    watchScrollMedia(slidesMedia.concat(pageMedia));
  } else {
    watchScrollMedia(pageMedia);
  }
}

const handleScroll = () => {
  const minScroll = window.innerHeight * (0.5 + deadzone / 2);
  const maxScroll = window.innerHeight * totalSlides - minScroll;

  let currentScroll = document.documentElement.scrollTop + minScroll;

  // Max scroll that slides will react to
  const limitedScroll = Math.min(
    currentScroll,
    maxScroll
  );

  // Scroll is past the limit, compensate its max scroll by the scroll distance last slide was viewport-fixed
  if (currentScroll > limitedScroll) {
    currentScroll = currentScroll - (1 - deadzone) / 2 * window.innerHeight;
  }

  // Next slide to be selected
  let currentSlide = Math.floor(currentScroll / window.innerHeight);

  if (currentSlide > totalSlides - 1) {
    currentSlide = null
  }

  activateSlide(currentSlide);
  shiftSlides(currentSlide, limitedScroll);
}

const addWindowEvents = () => {
  window.addEventListener('scroll', () => {
    if (isMobile()) {
      return;
    }

    handleScroll();
  });

  window.addEventListener('resize', () => {
    if (isMobile()) {
      return;
    }

    resizeSpace();
    handleScroll();
  });
}

const loadMedia = () => {
  const sources = Array.from(document.querySelectorAll('source[data-src]'));
  const slideVideos = Array.from(document.querySelectorAll('.slides video'));

  sources.map(s => s.src = s.getAttribute('data-src'));

  const loadVideos = slideVideos.map(el => new Promise(res => {
    el.addEventListener('loadedmetadata', res);
    el.addEventListener('loadeddata', res);
    el.load();
  }))

  return Promise.race([
    Promise.all(loadVideos).then(() => 1),
    new Promise(res => setTimeout(res, 5000)).then(() => 2)
  ])
};

const hideLoader = () => {
  document.querySelector('.loader').classList.add('done');

  if (!isMobile()) {
    document.querySelector('.root').classList.add('initialized');
  }
};

const minTimer = new Promise(res => setTimeout(res, 1000));

const addFormEvents = () => {
  const formEl = document.querySelector('.form');
  const showFormButtons = Array.from(document.querySelectorAll('.form-show-button'));
  const hideFormButtons = Array.from(document.querySelectorAll('.form-hide-button'));

  const showForm = () => {
    formEl.classList.add('open');
    setTimeout(() => {
      formEl.querySelector('input').focus();
    }, 100);
  }

  const hideForm = () => {
    formEl.classList.remove('open');
  }

  hideFormButtons.map(el => el.addEventListener('click', hideForm));
  showFormButtons.map(el => el.addEventListener('click', showForm));

  formEl.addEventListener('click', e => {
    if (e.target === e.currentTarget) {
      hideForm();
    }
  });

  const select = document.querySelector('select');
  const selectValue = document.querySelector('.select-value');

  const setSelectValue = value => {
    selectValue.innerHTML = value;
  }

  select.addEventListener('change', e => {
    setSelectValue(e.target.options[e.target.selectedIndex].innerHTML);
  });

  const form = document.querySelector('.beta-access-form');

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Form action here

    // form.checkValidity();

    form.classList.add('done');
  });
};

const headerTheming = () => {
  const plans = document.querySelector('.plans');
  const header = document.querySelector('header');

  const handleScroll = () => {
    if (isMobile()) {
      return;
    }

    const overPlans = (
      plans.getBoundingClientRect().top - header.clientHeight / 2 < 0 &&
      plans.getBoundingClientRect().bottom - header.clientHeight / 2 > 0
    );

    if (overPlans) {
      header.classList.add('over-plans');
    } else {
      header.classList.remove('over-plans');
    }
  };

  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleScroll);
  handleScroll();
};

Promise
  .all([
    loadMedia(),
    minTimer
  ])
  .finally(() => {
    if (!isMobile()) {
      document.documentElement.scrollTop = 0;
    }
    handleScroll();
    addWindowEvents();
    addFormEvents();
    headerTheming();
    hideLoader();

    videoPlayback();

    startDynamicWords();
  });

resizeSpace();
initDynamicWords();
