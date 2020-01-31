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

export const toggleHeaderFooter = () => {
  if (header.classList.contains('visually-hidden')) {
    showHeaderFooter()
  } else {
    hideHeaderFooter()
  }
  swapIcons(document.getElementById('toggleHeaderFooter'))
}

const showButtonText = () => {
  window.localStorage.removeItem('iconsOnly')
  buttonText.forEach(b => b.classList.remove('visually-hidden'))
}

export const hideButtonText = () => {
  window.localStorage.setItem('iconsOnly', 'true')
  buttonText.forEach(b => b.classList.add('visually-hidden'))
}

export const toggleButtonText = () => {
  if (buttonText[0].classList.contains('visually-hidden')) {
    showButtonText()
  } else {
    hideButtonText()
  }
  swapIcons(document.getElementById('toggleButtonText'))
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
