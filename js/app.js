/*-------------------------------- Constants --------------------------------*/



/*---------------------------- Variables (state) ----------------------------*/

let turnNum = 0
let currentGuess = []
let prevTurns = []
let secretWord = 'bread'.toLocaleUpperCase()

/*------------------------ Cached Element References ------------------------*/

const squares = document.querySelectorAll('.square')
const keys = document.querySelectorAll('.key')

const gameBoard = document.querySelector('#main-game-area')
const keyBoard = document.querySelector('#keyboard')

/*----------------------------- Event Listeners -----------------------------*/

gameBoard.addEventListener('click', handleClick)
keyBoard.addEventListener('click', handleClick)

/*-------------------------------- Functions --------------------------------*/

function handleClick(evt) {
  let keyClick = evt.target.id
  if (keyClick === 'delete') {
    renderDelete()
  } else if (keyClick === 'enter') {
    checkGuess()
  } else if (evt.target.className.includes('key')) {
    renderKey(keyClick)
  } else if (evt.target.className === 'square') {
    renderBox(keyClick)
  }
}

function renderKey(keyClick) {
  if (currentGuess.length < 5) {
    squares[(prevTurns.length * 5) + (currentGuess.length)].textContent = keyClick
    currentGuess.push(keyClick)
  } else {
    ////////////////////////?
  }
}

function renderDelete() {
  currentGuess.pop()
  squares[(prevTurns.length * 5) + (currentGuess.length)].textContent = ''
  return
}

function renderEnter() {

}

function renderBox(keyClick) {
  console.log(keyClick)
  //come back to this
  //make it so user can edit a letter without deleting previous letters
}

function checkGuess() {
  if (currentGuess.length === 5) {
    currentGuess.forEach((letter, i) => {
      if(letter === secretWord[i]) {
        squares[(prevTurns.length * 5) + i].classList.add('correct')
        let idx = getKeyIndex(letter)
        keys[idx].classList.add('correct')
      } else if(secretWord.includes(letter)) {  // Update for edge cases // ex. only color one 'A' in 'PANDA' if secret word is 'BREAD'
        squares[(prevTurns.length * 5) + i].classList.add('almost')
        let idx = getKeyIndex(letter)
        keys[idx].classList.add('almost')
      } else {
        squares[(prevTurns.length * 5) + i].classList.add('miss')
        let idx = getKeyIndex(letter)
        keys[idx].classList.add('miss')
      }
    })
    turnNum++
    prevTurns.push(currentGuess)
    currentGuess = []
    return
  }
  else {
    return
  }
}

function getKeyIndex(char) {
  let index
  keys.forEach((key, idx) => {
    if(key.id === char) {index = idx}
  })
  return index
}