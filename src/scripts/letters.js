import { dice, getGame, setGame, setComplete } from './game'
import { initDragging, initDropping } from './dragDrop'

export const $letters = document.getElementById('letters__list')

const getLetters = (stored = true) => {
  const game = getGame()
  if (stored && game.letters.length) return game.letters

  const letters = []
  dice.forEach(d => {
    letters.push({
      letter: d[Math.floor(Math.random() * d.length)],
      used: false,
    })
  })
  letters.sort((a, b) =>
    a.letter === b.letter ? 0 : a.letter > b.letter ? 1 : -1
  )
  setGame({
    ...game,
    letters,
  })
  return letters
}

export const buildLetters = (stored = true) => {
  $letters.innerHTML = ''
  getLetters(stored).forEach(l => {
    const letter = document.createElement('li')
    letter.className = 'letters__item'
    letter.dataset.value = l.letter
    letter.innerText = l.letter
    letter.draggable = !l.used
    if (l.used) letter.classList.add('used')
    initDragging(letter)
    $letters.appendChild(letter)
  })
  initDropping(document.getElementById('letters'))
  setComplete($letters)
}

export const resetLetters = () => {
  const game = getGame()
  const letters = game.letters
  ;[...document.querySelectorAll('.letters__item')].forEach(el => {
    el.classList.remove('used')
    el.draggable = true
  })
  letters.forEach(l => (l.used = false))
  setComplete($letters)
  setGame({
    ...game,
    letters,
  })
}

export const updateLetter = (letter, used) => {
  const game = getGame()
  const letters = game.letters
  const l = letters.length
  for (let i = 0; i < l; i++) {
    if (letters[i].letter === letter && letters[i].used === !used) {
      letters[i].used = used
      break
    }
  }
  setGame({
    ...game,
    letters,
  })
}
