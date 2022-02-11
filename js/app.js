/*-------------------------------- Constants --------------------------------*/



/*---------------------------- Variables (state) ----------------------------*/

let turnNum = 0
let currentGuess = []
let prevTurns = []
let secretWord = 'bread'

/*------------------------ Cached Element References ------------------------*/

const squares = document.querySelectorAll('.square')
// const keys = document.querySelectorAll('.key')

const gameBoard = document.querySelector('#main-game-area')
const keyBoard = document.querySelector('#keyboard')

/*----------------------------- Event Listeners -----------------------------*/

gameBoard.addEventListener('click', handleClick)
keyBoard.addEventListener('click', handleClick)

/*-------------------------------- Functions --------------------------------*/

function handleClick(evt) {
  let keyClick = evt.target.id
  if(evt.target.id === 'delete') {
    renderDelete()
  } else if (evt.target.id === 'enter') {
    checkGuess()
  } else if (evt.target.className === 'key') {
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
    console.log('2Much')
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
  if(currentGuess.length === 5) {
    
  }
  else {
    return
  }
}