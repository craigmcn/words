import { dice, defaultGame, STORAGEID, getGame, setGame, setComplete } from '../src/scripts/game'

beforeEach(() => {
    localStorage.clear()
})

describe('dice', () => {
    it('has 32 entries', () => {
        expect(dice).toHaveLength(32)
    })

    it('each die has 6 faces', () => {
        dice.forEach(d => expect(d).toHaveLength(6))
    })

    it('all faces are single characters', () => {
        dice.forEach(d => d.forEach(face => expect(face).toHaveLength(1)))
    })
})

describe('defaultGame', () => {
    it('has an empty letters array', () => {
        expect(defaultGame.letters).toEqual([])
    })

    it('has a 10x10 grid', () => {
        expect(defaultGame.grid.height).toBe(10)
        expect(defaultGame.grid.width).toBe(10)
        expect(defaultGame.grid.rows).toEqual([])
    })
})

describe('getGame', () => {
    it('returns defaultGame when localStorage is empty', () => {
        expect(getGame()).toEqual(defaultGame)
    })

    it('returns parsed game from localStorage', () => {
        const state = { letters: [{ letter: 'A', used: false }], grid: { height: 5, width: 5, rows: [] } }
        localStorage.setItem(STORAGEID, JSON.stringify(state))
        expect(getGame()).toEqual(state)
    })
})

describe('setGame', () => {
    it('persists game state to localStorage', () => {
        const state = { letters: [], grid: { height: 3, width: 3, rows: [] } }
        setGame(state)
        expect(JSON.parse(localStorage.getItem(STORAGEID))).toEqual(state)
    })

    it('returns the game object', () => {
        const state = { letters: [], grid: defaultGame.grid }
        expect(setGame(state)).toBe(state)
    })
})

describe('setComplete', () => {
    let $letters

    beforeEach(() => {
        $letters = document.getElementById('letters__list')
        $letters.innerHTML = ''
    })

    it('adds complete class when all letter items are used', () => {
        const li = document.createElement('li')
        li.className = 'letters__item used'
        $letters.appendChild(li)
        setComplete($letters)
        expect($letters.classList.contains('complete')).toBe(true)
    })

    it('removes complete class when any letter item is unused', () => {
        $letters.classList.add('complete')
        const li = document.createElement('li')
        li.className = 'letters__item'
        $letters.appendChild(li)
        setComplete($letters)
        expect($letters.classList.contains('complete')).toBe(false)
    })

    it('returns true when complete', () => {
        expect(setComplete($letters)).toBe(true)
    })

    it('returns false when not complete', () => {
        const li = document.createElement('li')
        li.className = 'letters__item'
        $letters.appendChild(li)
        expect(setComplete($letters)).toBe(false)
    })
})
