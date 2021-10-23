import {
    setComplete,
} from './game'
import {
    $letters,
    updateLetter,
} from './letters'
import {
    updateGrid,
} from './grid'

/* Dragging and Dropping */
let dragSource, dropTarget

const getDragSource = el =>
    el.classList.contains('words__cell') ? el : el.closest('ul')
const getDropTarget = getDragSource
const isDropTarget = el =>
    el.classList.contains('words__cell') || !!el.closest('ul')

const handleDragStart = (e) => {
    // console.log('handleDragStart', e)
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

const handleDragEnd = (e) => {
    // console.log('handleDragEnd', e)
    if (e.dataTransfer.dropEffect !== 'none' && dropTarget !== dragSource) {
        handleDropEffect(e.target)
    }
    clearDragOver()
}

const handleDropEffect = (el) => {
    // console.log('handleDropEffect', el)
    dragSource && dragSource.removeAttribute('data-transfer')
    if (el && el.classList.contains('letters__item')) {
        el.classList.add('used')
        el.draggable = false
        setComplete($letters)
        updateLetter(el.dataset.value, true)
    } else if (el && el.classList.contains('words__cell')) {
        el.innerText = ''
        el.removeAttribute('data-value')
        el.removeAttribute('draggable')
        el.classList.remove('used')
        removeDragging(el)
        updateGrid('', el.dataset.row, el.dataset.col)
    }
    el.removeAttribute('data-page-x')
    el.removeAttribute('data-page-y')
    dragSource = undefined
}

const handleTouchMove = (e) => {
    // console.log('handleTouchMove', e)
    e.preventDefault()
    const el = e.target
    const touchLocation = e.targetTouches[0]
    el.dataset.pageX = touchLocation.pageX - window.scrollX
    el.dataset.pageY = touchLocation.pageY - window.scrollY

    const touchElement = document.elementFromPoint(
        el.dataset.pageX,
        el.dataset.pageY,
    )
    const dragoverElement = document.querySelector('.dragover')
    touchElement && touchElement.classList.add('dragover')
    if (dragoverElement && touchElement !== dragoverElement) {
        dragoverElement.classList.remove('dragover')
    }
}

const handleTouchEnd = (e) => {
    // console.log('handleTouchEnd', e)
    const el = e.target
    const dropElement = document.elementFromPoint(
        el.dataset.pageX,
        el.dataset.pageY,
    )
    dropTarget = getDropTarget(dropElement)
    if (dropElement && isDropTarget(dropElement) && dropTarget !== dragSource) {
        doDrop(dropElement)
        handleDropEffect(el)
    }
    clearDragOver()
}

const handleDragOver = (e) => {
    // console.log('handleDragOver', e)
    e.preventDefault()
    isDropTarget(e.target) && getDropTarget(e.target).classList.add('dragover')
}

const handleDragLeave = (e) => {
    // console.log('handleDragLeave', e)
    let el = e.target
    if (!el.classList) el = el.parentElement
    el.classList.remove('dragover')
}

const handleDrop = (e) => {
    // console.log('handleDrop', e)
    e.preventDefault()
    doDrop(e.target)
    clearDragOver()
}

const doDrop = (el) => {
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
                updateGrid(data, el.dataset.row, el.dataset.col)
            } else {
                handleReturn(data)
            }
        }
    }
}

// dropped back onto letter list
const handleReturn = (data) => {
    // console.log('handleReturn', data)
    const letterItem = $letters.querySelector(
        `.letters__item.used[data-value="${data}"]`,
    )
    if (letterItem) {
        letterItem.classList.remove('used')
        letterItem.draggable = true
    }
    setComplete($letters)
    updateLetter(data, false)
}

const clearDragOver = () => {
    const dragOverElement = document.querySelector('.dragover')
    dragOverElement && dragOverElement.classList.remove('dragover')
}

export const initDragging = (el) => {
    el.addEventListener('touchstart', handleDragStart, {
        passive: true,
    })
    el.addEventListener('dragstart', handleDragStart)
    el.addEventListener('touchmove', handleTouchMove)
    el.addEventListener('touchend', handleTouchEnd, {
        passive: true,
    })
    el.addEventListener('dragend', handleDragEnd)
}

const removeDragging = (el) => {
    el.removeEventListener('touchstart', handleDragStart)
    el.removeEventListener('dragstart', handleDragStart)
    el.removeEventListener('touchmove', handleTouchMove)
    el.removeEventListener('touchend', handleTouchEnd)
    el.removeEventListener('dragend', handleDragEnd)
}

export const initDropping = (el) => {
    el.addEventListener('dragover', handleDragOver)
    el.addEventListener('dragleave', handleDragLeave)
    el.addEventListener('drop', handleDrop)
}
