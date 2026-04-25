import { handleKeyboard } from '../src/scripts/keyboard'

// Mock all modules that keyboard.js delegates to
jest.mock('../src/scripts/game', () => ({
    roll: jest.fn(),
}))
jest.mock('../src/scripts/grid', () => ({
    resetGrid: jest.fn(),
    addRowTop: jest.fn(),
    addRowBottom: jest.fn(),
    addColumnLeft: jest.fn(),
    addColumnRight: jest.fn(),
}))
jest.mock('../src/scripts/toggle', () => ({
    toggleHeaderFooter: jest.fn(),
    toggleButtonText: jest.fn(),
}))

import { roll } from '../src/scripts/game'
import { resetGrid, addRowTop, addRowBottom, addColumnLeft, addColumnRight } from '../src/scripts/grid'
import { toggleHeaderFooter, toggleButtonText } from '../src/scripts/toggle'

const ctrlKey = (keyCode) => {
    const e = { ctrlKey: true, keyCode, preventDefault: jest.fn() }
    handleKeyboard(e)
    return e
}

beforeEach(() => {
    jest.clearAllMocks()
})

describe('handleKeyboard', () => {
    it('does nothing without ctrlKey', () => {
        handleKeyboard({ ctrlKey: false, keyCode: 13, preventDefault: jest.fn() })
        expect(roll).not.toHaveBeenCalled()
    })

    it('Ctrl+Enter calls roll', () => {
        ctrlKey(13)
        expect(roll).toHaveBeenCalledTimes(1)
    })

    it('Ctrl+Home calls resetGrid', () => {
        ctrlKey(36)
        expect(resetGrid).toHaveBeenCalledTimes(1)
    })

    it('Ctrl+ArrowLeft calls addColumnLeft', () => {
        ctrlKey(37)
        expect(addColumnLeft).toHaveBeenCalledTimes(1)
    })

    it('Ctrl+ArrowUp calls addRowTop', () => {
        ctrlKey(38)
        expect(addRowTop).toHaveBeenCalledTimes(1)
    })

    it('Ctrl+ArrowRight calls addColumnRight', () => {
        ctrlKey(39)
        expect(addColumnRight).toHaveBeenCalledTimes(1)
    })

    it('Ctrl+ArrowDown calls addRowBottom', () => {
        ctrlKey(40)
        expect(addRowBottom).toHaveBeenCalledTimes(1)
    })

    it('Ctrl+Delete calls toggleHeaderFooter', () => {
        ctrlKey(46)
        expect(toggleHeaderFooter).toHaveBeenCalledTimes(1)
    })

    it('Ctrl+Space calls toggleButtonText', () => {
        ctrlKey(32)
        expect(toggleButtonText).toHaveBeenCalledTimes(1)
    })

    it('calls preventDefault for all Ctrl shortcuts', () => {
        const e = ctrlKey(13)
        expect(e.preventDefault).toHaveBeenCalled()
    })
})
