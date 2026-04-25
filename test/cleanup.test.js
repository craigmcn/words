import { cleanup } from '../src/scripts/cleanup'

beforeEach(() => {
    localStorage.clear()
})

describe('cleanup', () => {
    it('removes legacy compress key', () => {
        localStorage.setItem('craigmcn-words-compress', 'true')
        cleanup()
        expect(localStorage.getItem('craigmcn-words-compress')).toBeNull()
    })

    it('removes legacy icons-only key', () => {
        localStorage.setItem('craigmcn-words-icons-only', 'true')
        cleanup()
        expect(localStorage.getItem('craigmcn-words-icons-only')).toBeNull()
    })

    it('does not remove unrelated localStorage keys', () => {
        localStorage.setItem('compress', 'true')
        localStorage.setItem('game', '{}')
        cleanup()
        expect(localStorage.getItem('compress')).toBe('true')
        expect(localStorage.getItem('game')).toBe('{}')
    })
})
