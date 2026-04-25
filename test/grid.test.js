import { getGame, setGame } from '../src/scripts/game'
import { getHeight, getWidth, setHeight, setWidth, updateGrid, createGridCell, createGridRow, addRowTop, addRowBottom, addColumnLeft, addColumnRight } from '../src/scripts/grid'

const makeGame = (height = 3, width = 3) => ({
    letters: [],
    grid: {
        height,
        width,
        rows: Array.from({ length: height }, () => Array(width).fill('')),
    },
})

beforeEach(() => {
    localStorage.clear()
    setGame(makeGame())
    document.querySelector('#words__grid tbody').innerHTML = ''
})

describe('getHeight / getWidth', () => {
    it('reads height from game state', () => {
        expect(getHeight()).toBe(3)
    })

    it('reads width from game state', () => {
        expect(getWidth()).toBe(3)
    })
})

describe('setHeight / setWidth', () => {
    it('persists height to game state', () => {
        setHeight(7)
        expect(getGame().grid.height).toBe(7)
    })

    it('persists width to game state', () => {
        setWidth(5)
        expect(getGame().grid.width).toBe(5)
    })
})

describe('updateGrid', () => {
    it('saves a letter at the correct position', () => {
        updateGrid('A', 1, 2)
        expect(getGame().grid.rows[1][2]).toBe('A')
    })

    it('does not affect other cells', () => {
        updateGrid('Z', 0, 0)
        expect(getGame().grid.rows[1][2]).toBe('')
    })
})

describe('createGridCell', () => {
    it('creates a td with correct row and col attributes', () => {
        const cell = createGridCell(1, 2, false)
        expect(cell.tagName).toBe('TD')
        expect(cell.dataset.row).toBe('1')
        expect(cell.dataset.col).toBe('2')
    })

    it('populates cell value when stored letter exists', () => {
        const game = makeGame()
        game.grid.rows[0][0] = 'X'
        setGame(game)
        const cell = createGridCell(0, 0, true)
        expect(cell.dataset.value).toBe('X')
        expect(cell.classList.contains('used')).toBe(true)
    })

    it('leaves cell empty when stored=false', () => {
        const game = makeGame()
        game.grid.rows[0][0] = 'X'
        setGame(game)
        const cell = createGridCell(0, 0, false)
        expect(cell.dataset.value).toBeUndefined()
        expect(cell.classList.contains('used')).toBe(false)
    })
})

describe('createGridRow', () => {
    it('creates a tr with the specified number of cells', () => {
        const row = createGridRow(4, 0, false)
        expect(row.tagName).toBe('TR')
        expect(row.querySelectorAll('td')).toHaveLength(4)
    })
})

describe('addRowTop', () => {
    it('increases grid height by 1', () => {
        addRowTop()
        expect(getGame().grid.height).toBe(4)
    })

    it('adds a row to the top of the DOM', () => {
        const tbody = document.querySelector('#words__grid tbody')
        // seed a row so we can verify insertion position
        tbody.appendChild(createGridRow(3, 0, false))
        addRowTop()
        expect(tbody.querySelectorAll('tr')).toHaveLength(2)
        expect(tbody.firstChild.querySelectorAll('td')).toHaveLength(3)
    })
})

describe('addRowBottom', () => {
    it('increases grid height by 1', () => {
        addRowBottom()
        expect(getGame().grid.height).toBe(4)
    })
})

describe('addColumnLeft', () => {
    it('increases grid width by 1', () => {
        const tbody = document.querySelector('#words__grid tbody')
        tbody.appendChild(createGridRow(3, 0, false))
        addColumnLeft()
        expect(getGame().grid.width).toBe(4)
    })
})

describe('addColumnRight', () => {
    it('increases grid width by 1', () => {
        const tbody = document.querySelector('#words__grid tbody')
        tbody.appendChild(createGridRow(3, 0, false))
        addColumnRight()
        expect(getGame().grid.width).toBe(4)
    })
})
