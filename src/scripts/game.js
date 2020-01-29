import { buildLetters } from './letters'
import { buildGrid } from './grid'
import { swapIcons, hideButtonText, hideHeaderFooter } from './toggle'

export const STORAGEID = 'game'

export const dice = [
  ['D', 'E', 'N', 'O', 'S', 'W'],
  ['A', 'E', 'F', 'J', 'R', 'Z'],
  ['E', 'G', 'K', 'L', 'U', 'Y'],
  ['D', 'I', 'K', 'O', 'P', 'W'],
  ['A', 'A', 'C', 'E', 'J', 'P'],
  ['B', 'F', 'I', 'O', 'R', 'X'],
  ['A', 'E', 'E', 'F', 'H', 'M'],
  ['A', 'A', 'C', 'I', 'O', 'T'],
  ['A', 'H', 'M', 'O', 'R', 'S'],
  ['A', 'B', 'I', 'L', 'T', 'Y'],
  ['A', 'D', 'N', 'T', 'W', 'Y'],
  ['A', 'D', 'E', 'I', 'L', 'O'],
  ['E', 'G', 'I', 'N', 'T', 'V'],
  ['D', 'K', 'N', 'O', 'T', 'U'],
  ['E', 'F', 'H', 'I', 'T', 'Y'],
  ['A', 'D', 'G', 'H', 'I', 'T'],
  ['A', 'D', 'E', 'H', 'N', 'T'],
  ['A', 'B', 'E', 'K', 'L', 'U'],
  ['A', 'E', 'M', 'P', 'S', 'Y'],
  ['E', 'H', 'I', 'N', 'P', 'S'],
  ['A', 'C', 'E', 'L', 'R', 'S'],
  ['B', 'F', 'O', 'R', 'U', ' '],
  ['H', 'I', 'L', 'O', 'S', 'X'],
  ['F', 'L', 'O', 'R', 'Z', ' '],
  ['A', 'C', 'D', 'E', 'N', 'P'],
  ['U', 'U', 'U', 'U', 'U', 'U'],
  ['A', 'C', 'G', 'R', 'S', 'T'],
  ['G', 'I', 'L', 'M', 'R', 'W'],
  ['A', 'B', 'L', 'M', 'O', 'Q'],
  ['A', 'E', 'G', 'M', 'R', 'S'],
  ['A', 'D', 'E', 'O', 'T', 'V'],
  ['A', 'D', 'E', 'J', 'P', 'V'],
]

export const defaultGame = {
  letters: [],
  grid: {
    height: 10,
    width: 10,
    rows: [],
  },
}

// Get game object from storage
export const getGame = () => {
  const game = window.localStorage.getItem(STORAGEID)
  if (game) return JSON.parse(game)
  return defaultGame
}

// Set game object in storage
export const setGame = game => {
  window.localStorage.setItem(STORAGEID, JSON.stringify(game))
  return game
}

export const setComplete = $letters => {
  $letters.classList.remove('complete')
  if (!document.querySelectorAll('.letters__item:not(.used)').length) {
    $letters.classList.add('complete')
    return true
  }
  return false
}

export const initialize = () => {
  // handle localStorage
  const compress = window.localStorage.getItem('compress')
  const iconsOnly = window.localStorage.getItem('iconsOnly')
  if (!!compress) {
    hideHeaderFooter()
    swapIcons(document.getElementById('toggleHeaderFooter'))
  }
  if (!!iconsOnly) {
    hideButtonText()
    swapIcons(document.getElementById('toggleButtonText'))
  }

  buildLetters()
  buildGrid({})
}

export const roll = () => {
  setGame(defaultGame)
  buildLetters(false)
  buildGrid({
    height: defaultGame.grid.height,
    width: defaultGame.grid.width,
    stored: false,
  })
}
