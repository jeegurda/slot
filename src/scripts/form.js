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

export default addFormEvents
