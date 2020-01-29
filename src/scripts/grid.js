import { getGame, setGame } from './game'
import { resetLetters } from './letters'
import { initDragging, initDropping } from './dragDrop'

const $words = document.getElementById('words__grid').querySelector('tbody')

// Get and set grid height from game object
export const getHeight = () => {
  const game = getGame()
  const {
    grid: { height },
  } = game
  return height
}

export const setHeight = height => {
  const game = getGame()
  setGame({
    ...game,
    grid: {
      ...game.grid,
      height,
    },
  })
}

// Get and set grid width from game object
export const getWidth = () => {
  const game = getGame()
  const {
    grid: { width },
  } = game
  return width
}

export const setWidth = width => {
  const game = getGame()
  setGame({
    ...game,
    grid: {
      ...game.grid,
      width,
    },
  })
}

/* Create and update grid */
export const buildGrid = props => {
  const { height = getHeight(), width = getWidth(), stored = true } = props
  const game = getGame()
  $words.innerHTML = ''
  for (let r = 0; r < height; r++) {
    if (!game.grid.rows[r]) game.grid.rows[r] = Array(game.grid.width).fill('')
    setGame(game)
    $words.appendChild(createGridRow(width, r, stored))
  }
}

export const resetGrid = () => {
  const game = getGame()
  game.grid.rows = Array(game.grid.height)
    .fill()
    .map(() => Array(game.grid.width).fill(''))
  setGame(game)
  resetLetters()
  buildGrid({})
}

export const updateGrid = (letter, row, column) => {
  const game = getGame()
  game.grid.rows[row][column] = letter
  setGame(game)
}

const indexGrid = () => {
  ;[...$words.querySelectorAll('tr')].forEach((tr, r) => {
    ;[...tr.querySelectorAll('td')].forEach((td, c) => {
      td.dataset.row = r
      td.dataset.col = c
    })
  })
}

export const createGridCell = (r, c, stored = true) => {
  const {
    grid: { rows },
  } = getGame()
  const cell = document.createElement('td')
  cell.className = 'words__cell'
  cell.dataset.row = r
  cell.dataset.col = c
  if (stored && rows[r][c]) {
    cell.dataset.value = rows[r][c]
    cell.innerText = rows[r][c]
    cell.classList.add('used')
    cell.draggable = true
    initDragging(cell)
  }
  initDropping(cell)
  return cell
}

export const createGridRow = (width, r, stored = true) => {
  const row = document.createElement('tr')
  for (let c = 0; c < width; c++) {
    row.appendChild(createGridCell(r, c, stored))
  }
  return row
}

const addRow = (direction = 'top') => {
  const game = getGame()
  if (direction === 'top') {
    $words.insertBefore(
      createGridRow(game.grid.width, 0),
      $words.firstChild,
      false
    )
    game.grid.rows.unshift(Array(game.grid.width).fill(''))
  } else {
    $words.appendChild(createGridRow(game.grid.width, game.grid.height, false))
    game.grid.rows.push(Array(game.grid.width).fill(''))
  }
  setGame(game)
  setHeight(++game.grid.height)
  indexGrid()
}

const addColumn = (direction = 'left') => {
  const game = getGame()
  let width = getWidth()
  ;[...$words.querySelectorAll('tr')].forEach((tr, r) => {
    if (direction === 'left') {
      tr.insertBefore(createGridCell(r, 0, false), tr.firstChild)
      game.grid.rows[r].unshift('')
    } else {
      tr.appendChild(createGridCell(r, width, false))
      game.grid.rows[r].push('')
    }
  })
  setGame(game)
  setWidth(++width)
  indexGrid()
}

export const addRowTop = () => {
  addRow('top')
}

export const addRowBottom = () => {
  addRow('bottom')
}

export const addColumnLeft = () => {
  addColumn('left')
}

export const addColumnRight = () => {
  addColumn('right')
}
