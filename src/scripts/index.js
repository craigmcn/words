import { cleanup } from './cleanup'
import registerServiceWorker from './serviceWorker'
import { initialize, roll } from './game'
import {
    addRowTop,
    addRowBottom,
    addColumnLeft,
    addColumnRight,
    resetGrid,
} from './grid'
import { toggleButtonText, toggleHeaderFooter } from './toggle'
import { handleKeyboard } from './keyboard'
import tippy from 'tippy.js'

cleanup()
registerServiceWorker()

// handle controls
document.getElementById('roll').addEventListener('click', roll)
document.getElementById('reset').addEventListener('click', resetGrid)
document.getElementById('addRowTop').addEventListener('click', addRowTop)
document.getElementById('addRowBottom').addEventListener('click', addRowBottom)
document
    .getElementById('addColumnLeft')
    .addEventListener('click', addColumnLeft)
document
    .getElementById('addColumnRight')
    .addEventListener('click', addColumnRight)
document.addEventListener('keyup', handleKeyboard, false)
document
    .getElementById('toggleHeaderFooter')
    .addEventListener('click', toggleHeaderFooter)
document
    .getElementById('toggleButtonText')
    .addEventListener('click', toggleButtonText)

// initialize game board
initialize()

// initialize tooltips
tippy('[data-tippy-content]', { placement: 'right' })
