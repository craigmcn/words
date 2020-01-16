// https://deanhume.com/displaying-a-new-version-available-progressive-web-app/
let newWorker
document.getElementById('reload').addEventListener('click', e => {
  e.preventDefault()
  newWorker.postMessage({ action: 'skipWaiting' })
  window.location.reload()
})
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      newWorker = reg.installing
      newWorker.addEventListener('statechange', () => {
        switch (newWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              document.getElementById('notification').removeAttribute('hidden')
            }
            break
        }
      })
    })
  })
}

/* Data */
const dice = [
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
  ['B', 'F', 'O', 'R', 'U', ''],
  ['H', 'I', 'L', 'O', 'S', 'X'],
  ['F', 'L', 'O', 'R', 'Z', ''],
  ['A', 'C', 'D', 'E', 'N', 'P'],
  ['U', 'U', 'U', 'U', 'U', 'U'],
  ['A', 'C', 'G', 'R', 'S', 'T'],
  ['G', 'I', 'L', 'M', 'R', 'W'],
  ['A', 'B', 'L', 'M', 'O', 'Q'],
  ['A', 'E', 'G', 'M', 'R', 'S'],
  ['A', 'D', 'E', 'O', 'T', 'V'],
  ['A', 'D', 'E', 'J', 'P', 'V'],
]

/* Initial setup and Reset */
const $letters = document.getElementById('letters__list')
const $words = document.getElementById('words__grid')

let gridHeight = 10,
  gridWidth = 10

const roll = () => {
  const letters = []
  $letters.innerHTML = ''
  dice.forEach(d => {
    letters.push(d[Math.floor(Math.random() * d.length)])
  })
  letters.sort()
  letters.forEach(l => {
    const newLetter = document.createElement('li')
    newLetter.className = 'letters__item'
    newLetter.dataset.value = l
    newLetter.innerText = l
    newLetter.draggable = true
    initDragging(newLetter)
    $letters.appendChild(newLetter)
  })
  resetGrid()
}

const resetGrid = () => {
  $words.innerHTML = ''
  for (let i = 0; i < gridHeight; i++) {
    $words.appendChild(createGridRow())
  }

  ;[...document.querySelectorAll('.letters__item')].forEach(el => {
    el.classList.remove('used')
    el.draggable = true
  })
  setComplete()
}

/* Dragging and Dropping */
let dragSource, dropTarget

const getDragSource = el =>
  el.classList.contains('words__cell') ? el : el.closest('ul')
const isDragSource = el =>
  el.classList.contains('words__cell') || el.classList.contains('letters__item')
const getDropTarget = getDragSource
const isDropTarget = el =>
  el.classList.contains('words__cell') || !!el.closest('ul')

const handleDragStart = e => {
  //console.log("handleDragStart", e);
  const el = e.target
  if (el.draggable) {
    dragSource = getDragSource(el)
    dragSource.dataset.transfer = el.dataset.value
  }
  const touch = e.targetTouches
  if (el.dataset) {
    if (touch) {
      const touchLocation = touch[0]
      el.dataset.pageX = touchLocation.pageX - window.scrollX
      el.dataset.pageY = touchLocation.pageY - window.scrollY
    } else {
      el.dataset.pageX = e.x
      el.dataset.pageY = e.y
    }
  }
}

const handleDragEnd = e => {
  //console.log("handleDragEnd", e);
  if (e.dataTransfer.dropEffect !== 'none' && dropTarget !== dragSource) {
    handleDropEffect(e.target)
  }
  clearDragOver()
}

const handleDropEffect = el => {
  //console.log("handleDropEffect", el);
  dragSource && dragSource.removeAttribute('data-transfer')
  if (el && el.classList.contains('letters__item')) {
    el.classList.add('used')
    el.draggable = false
    setComplete()
  } else if (el && el.classList.contains('words__cell')) {
    el.innerText = ''
    el.removeAttribute('data-value')
    el.removeAttribute('draggable')
    el.classList.remove('used')
    removeDragging(el)
  }
  dragSource = undefined
}

const handleTouchMove = e => {
  //console.log("handleTouchMove", e);
  e.preventDefault()
  const el = e.target
  const touchLocation = e.targetTouches[0]
  el.dataset.pageX = touchLocation.pageX - window.scrollX
  el.dataset.pageY = touchLocation.pageY - window.scrollY

  const touchElement = document.elementFromPoint(
    el.dataset.pageX,
    el.dataset.pageY
  )
  const dragoverElement = document.querySelector('.dragover')
  touchElement && touchElement.classList.add('dragover')
  if (dragoverElement && touchElement !== dragoverElement) {
    dragoverElement.classList.remove('dragover')
  }
}

const handleTouchEnd = e => {
  //console.log("handleTouchEnd", e);
  const el = e.target
  const dropElement = document.elementFromPoint(
    el.dataset.pageX,
    el.dataset.pageY
  )
  dropTarget = getDropTarget(dropElement)
  if (dropElement && isDropTarget(dropElement) && dropTarget !== dragSource) {
    doDrop(dropElement)
    handleDropEffect(el)
  }
  clearDragOver()
}

const handleDragOver = e => {
  //console.log("handleDragOver", e);
  e.preventDefault()
  isDropTarget(e.target) && getDropTarget(e.target).classList.add('dragover')
}

const handleDragLeave = e => {
  //console.log("handleDragLeave", e);
  let el = e.target
  if (!el.classList) el = el.parentElement
  el.classList.remove('dragover')
}

const handleDrop = e => {
  //console.log("handleDrop", e);
  e.preventDefault()
  doDrop(e.target)
  clearDragOver()
}

const doDrop = el => {
  if (dragSource) {
    const data = dragSource.dataset.transfer
    dropTarget = getDropTarget(el)
    dropTarget.classList.remove('dragover')
    if (data !== undefined && dropTarget !== dragSource) {
      if (el.classList.contains('words__cell')) {
        // dropped onto word grid
        if (el.dataset.value) handleReturn(el.dataset.value)
        el.classList.add('used')
        el.dataset.value = data
        el.draggable = true
        el.innerText = data
        initDragging(el)
      } else {
        handleReturn(data)
      }
    }
  }
}

// dropped back onto letter list
const handleReturn = data => {
  //console.log("handleReturn", data)
  const letterItem = $letters.querySelector(
    `.letters__item.used[data-value="${data}"]`
  )
  if (letterItem) {
    letterItem.classList.remove('used')
    letterItem.draggable = true
  }
  setComplete()
}

const setComplete = () => {
  if (!document.querySelectorAll('.letters__item:not(.used)').length) {
    $letters.classList.add('complete')
  } else {
    $letters.classList.remove('complete')
  }
}

const clearDragOver = () => {
  const dragOverElement = document.querySelector('.dragover')
  dragOverElement && dragOverElement.classList.remove('dragover')
}

const initDragging = el => {
  el.addEventListener('touchstart', handleDragStart, { passive: true })
  el.addEventListener('dragstart', handleDragStart)
  el.addEventListener('touchmove', handleTouchMove)
  el.addEventListener('touchend', handleTouchEnd, { passive: true })
  el.addEventListener('dragend', handleDragEnd)
}

const removeDragging = el => {
  el.removeEventListener('touchstart', handleDragStart)
  el.removeEventListener('dragstart', handleDragStart)
  el.removeEventListener('touchmove', handleTouchMove)
  el.removeEventListener('touchend', handleTouchEnd)
  el.removeEventListener('dragend', handleDragEnd)
}

const initDropping = el => {
  el.addEventListener('dragover', handleDragOver)
  el.addEventListener('dragleave', handleDragLeave)
  el.addEventListener('drop', handleDrop)
}

const createGridCell = () => {
  const cell = document.createElement('td')
  cell.className = 'words__cell'
  initDropping(cell)
  return cell
}

/* Create and update grid */
const createGridRow = () => {
  const row = document.createElement('tr')
  for (let j = 0; j < gridWidth; j++) {
    row.appendChild(createGridCell())
  }
  return row
}

const addRow = (direction = 'top') => {
  if (direction === 'top') {
    $words.insertBefore(createGridRow(), $words.firstChild)
  } else {
    $words.appendChild(createGridRow())
  }
  gridHeight++
}

const addColumn = (direction = 'left') => {
  ;[...$words.querySelectorAll('tr')].forEach(el => {
    if (direction === 'left') {
      el.insertBefore(createGridCell(), el.firstChild)
    } else {
      el.appendChild(createGridCell())
    }
  })
  gridWidth++
}

const addRowTop = () => {
  addRow('top')
}

const addRowBottom = () => {
  addRow('bottom')
}

const addColumnLeft = () => {
  addColumn('left')
}

const addColumnRight = () => {
  addColumn('right')
}

/* Action buttons */
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
document.getElementById('toggleHeaderFooter').addEventListener('click', e => {
  const el = e.currentTarget
  const header = document.getElementById('header')
  const footer = document.getElementById('footer')
  if (header.classList.contains('visually-hidden')) {
    window.localStorage.removeItem('compress')
    header.classList.remove('visually-hidden')
    footer.classList.remove('visually-hidden')
  } else {
    window.localStorage.setItem('compress', 'true')
    header.classList.add('visually-hidden')
    footer.classList.add('visually-hidden')
  }
  ;[...el.querySelectorAll('svg')].forEach(s => {
    if (s.hasAttribute('hidden')) {
      s.removeAttribute('hidden')
    } else {
      s.setAttribute('hidden', true)
    }
  })
})
document.getElementById('toggleButtonText').addEventListener('click', e => {
  const el = e.currentTarget
  const buttonText = [...document.querySelectorAll('span.js-canHide')]
  const footer = document.getElementById('footer')
  if (buttonText[0].classList.contains('visually-hidden')) {
    window.localStorage.removeItem('iconsOnly')
    buttonText.forEach(b => b.classList.remove('visually-hidden'))
  } else {
    window.localStorage.setItem('iconsOnly', 'true')
    buttonText.forEach(b => b.classList.add('visually-hidden'))
  }
  ;[...el.querySelectorAll('svg')].forEach(s => {
    if (s.hasAttribute('hidden')) {
      s.removeAttribute('hidden')
    } else {
      s.setAttribute('hidden', true)
    }
  })
})

// on load
// handle localStorage
const compress = window.localStorage.getItem('compress')
const iconsOnly = window.localStorage.getItem('iconsOnly')
if (!!compress) {
  header.classList.add('visually-hidden')
  footer.classList.add('visually-hidden')
}
if (!!iconsOnly) {
  ;[...document.querySelectorAll('span.js-canHide')].forEach(b =>
    b.classList.add('visually-hidden')
  )
}
initDropping(document.getElementById('letters'))
roll()
