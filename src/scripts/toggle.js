/* Toggle actions */
const header = document.getElementById('header')
const footer = document.getElementById('footer')
const buttonText = [...document.querySelectorAll('span.js-canHide')]

const showHeaderFooter = () => {
  window.localStorage.removeItem('compress')
  header.classList.remove('visually-hidden')
  footer.classList.remove('visually-hidden')
}

export const hideHeaderFooter = () => {
  window.localStorage.setItem('compress', 'true')
  header.classList.add('visually-hidden')
  footer.classList.add('visually-hidden')
}

export const toggleHeaderFooter = e => {
  const el = e.currentTarget
  if (header.classList.contains('visually-hidden')) {
    showHeaderFooter()
  } else {
    hideHeaderFooter()
  }
  swapIcons(el)
}

const showButtonText = () => {
  window.localStorage.removeItem('iconsOnly')
  buttonText.forEach(b => b.classList.remove('visually-hidden'))
}

export const hideButtonText = () => {
  window.localStorage.setItem('iconsOnly', 'true')
  buttonText.forEach(b => b.classList.add('visually-hidden'))
}

export const toggleButtonText = e => {
  const el = e.currentTarget
  if (buttonText[0].classList.contains('visually-hidden')) {
    showButtonText()
  } else {
    hideButtonText()
  }
  swapIcons(el)
}

// Swap icons
export const swapIcons = el => {
  ;[...el.querySelectorAll('svg')].forEach(s => {
    if (s.hasAttribute('hidden')) {
      s.removeAttribute('hidden')
    } else {
      s.setAttribute('hidden', true)
    }
  })
}
