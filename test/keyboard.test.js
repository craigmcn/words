import { handleKeyboard } from '../src/scripts/keyboard'
import { vi } from 'vitest'

// Mock all modules that keyboard.js delegates to
vi.mock('../src/scripts/game', () => ({
  roll: vi.fn(),
}))
vi.mock('../src/scripts/grid', () => ({
  resetGrid: vi.fn(),
  addRowTop: vi.fn(),
  addRowBottom: vi.fn(),
  addColumnLeft: vi.fn(),
  addColumnRight: vi.fn(),
}))
vi.mock('../src/scripts/toggle', () => ({
  toggleHeaderFooter: vi.fn(),
  toggleButtonText: vi.fn(),
}))

import { roll } from '../src/scripts/game'
import { resetGrid, addRowTop, addRowBottom, addColumnLeft, addColumnRight } from '../src/scripts/grid'
import { toggleHeaderFooter, toggleButtonText } from '../src/scripts/toggle'

const ctrlKey = (keyCode) => {
  const e = { ctrlKey: true, keyCode, preventDefault: vi.fn() }
  handleKeyboard(e)
  return e
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('handleKeyboard', () => {
  it('does nothing without ctrlKey', () => {
    handleKeyboard({ ctrlKey: false, keyCode: 13, preventDefault: vi.fn() })
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
