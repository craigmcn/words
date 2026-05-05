import {
  hideHeaderFooter,
  toggleHeaderFooter,
  hideButtonText,
  toggleButtonText,
  swapIcons,
} from '../src/scripts/toggle'

beforeEach(() => {
  localStorage.clear()
  document.getElementById('header').className = ''
  document.getElementById('footer').className = ''
  document.querySelectorAll('span.js-canHide').forEach((el) => {
    el.className = 'js-canHide'
  })
})

describe('hideHeaderFooter', () => {
  it('adds visually-hidden to header and footer', () => {
    hideHeaderFooter()
    expect(
      document.getElementById('header').classList.contains('visually-hidden'),
    ).toBe(true)
    expect(
      document.getElementById('footer').classList.contains('visually-hidden'),
    ).toBe(true)
  })

  it('sets compress in localStorage', () => {
    hideHeaderFooter()
    expect(localStorage.getItem('compress')).toBe('true')
  })
})

describe('toggleHeaderFooter', () => {
  it('hides header/footer when visible', () => {
    toggleHeaderFooter()
    expect(
      document.getElementById('header').classList.contains('visually-hidden'),
    ).toBe(true)
  })

  it('shows header/footer when hidden', () => {
    document.getElementById('header').classList.add('visually-hidden')
    document.getElementById('footer').classList.add('visually-hidden')
    toggleHeaderFooter()
    expect(
      document.getElementById('header').classList.contains('visually-hidden'),
    ).toBe(false)
  })

  it('removes compress from localStorage when showing', () => {
    localStorage.setItem('compress', 'true')
    document.getElementById('header').classList.add('visually-hidden')
    document.getElementById('footer').classList.add('visually-hidden')
    toggleHeaderFooter()
    expect(localStorage.getItem('compress')).toBeNull()
  })
})

describe('hideButtonText', () => {
  it('adds visually-hidden to button text spans', () => {
    hideButtonText()
    document.querySelectorAll('span.js-canHide').forEach((el) => {
      expect(el.classList.contains('visually-hidden')).toBe(true)
    })
  })

  it('sets iconsOnly in localStorage', () => {
    hideButtonText()
    expect(localStorage.getItem('iconsOnly')).toBe('true')
  })
})

describe('toggleButtonText', () => {
  it('hides button text when visible', () => {
    toggleButtonText()
    document.querySelectorAll('span.js-canHide').forEach((el) => {
      expect(el.classList.contains('visually-hidden')).toBe(true)
    })
  })

  it('shows button text when hidden', () => {
    document.querySelectorAll('span.js-canHide').forEach((el) => {
      el.classList.add('visually-hidden')
    })
    toggleButtonText()
    document.querySelectorAll('span.js-canHide').forEach((el) => {
      expect(el.classList.contains('visually-hidden')).toBe(false)
    })
  })
})

describe('swapIcons', () => {
  it('toggles hidden attribute on SVG children', () => {
    const btn = document.getElementById('toggleHeaderFooter')
    const [first, second] = btn.querySelectorAll('svg')
    const firstWasHidden = first.hasAttribute('hidden')
    const secondWasHidden = second.hasAttribute('hidden')
    swapIcons(btn)
    expect(first.hasAttribute('hidden')).toBe(!firstWasHidden)
    expect(second.hasAttribute('hidden')).toBe(!secondWasHidden)
  })
})
