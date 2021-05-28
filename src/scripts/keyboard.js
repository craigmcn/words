import { roll } from './game'
import {
    addRowTop,
    addRowBottom,
    addColumnLeft,
    addColumnRight,
    resetGrid,
} from './grid'
import { toggleButtonText, toggleHeaderFooter } from './toggle'

export const handleKeyboard = e => {
    if (e.ctrlKey) {
        e.preventDefault()

        switch (e.keyCode) {
            case 13: // Enter
                roll()
                break
            case 36: // Home
                resetGrid()
                break
            case 37: // Arrow left
                addColumnLeft()
                break
            case 38: // Arrow up
                addRowTop()
                break
            case 39: // Arrow right
                addColumnRight()
                break
            case 40: // Arrow down
                addRowBottom()
                break
            case 46: // Delete
                toggleHeaderFooter()
                break
            case 32: // Space
                toggleButtonText()
                break
            default:
                return
        }
    }
}
