/*-------------------------------- Constants --------------------------------*/

import { getWord, getWordIndex, setWord, checkWord } from "../Data/word-list.js"
const ltrs = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
  'Z', 'X', 'C', 'V', 'B', 'N', 'M']

/*---------------------------- Variables (state) ----------------------------*/

let turnNum
let currentGuess = []
let prevTurns = []
let secretWord
let wordIndex
let difficulty, challengeWord


/*------------------------ Cached Element References ------------------------*/

const squares = document.querySelectorAll('.square')
const keys = document.querySelectorAll('.key')

const gameBoard = document.querySelector('#main-game-area')
const keyBoard = document.querySelector('#keyboard')

const resetBtn = document.getElementById("reset-btn")

/*----------------------------- Event Listeners -----------------------------*/

gameBoard.addEventListener('click', handleClick)
keyBoard.addEventListener('click', handleClick)
document.addEventListener('keydown', handleKeydown)
resetBtn.addEventListener('click', init)

/*-------------------------------- Functions --------------------------------*/


init()

function init() {
  // num ? secretWord = setWord(num).toUpperCase() : secretWord = getWord(1).toUpperCase()
  secretWord = getWord(1).toUpperCase()
  wordIndex = getWordIndex(secretWord.toLowerCase())
  console.log(secretWord)
  currentGuess = []
  prevTurns = []

  clearAnimation()
  squares.forEach((square) => {
    square.textContent = ''
    square.className = 'square'
  })

  keys.forEach((key) => {
    key.className = 'key shadow'
  })
}

/*
  FUNCTIONS TO CHANGE DIFFICULTY AND SET CHALLENGE WORD
*/

function handleKeydown(evt) {
  clearAnimation()
  let press = evt.key
  press = press.toUpperCase()
  if (press === 'BACKSPACE') {
    renderDelete()
  } else if (press === 'ENTER') {
    checkGuess()
  } else if (ltrs.includes(press)) {
    renderKey(press)
  } else {
    return
  }
}

function handleClick(evt) {
  let keyClick = evt.target.id
  clearAnimation()
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
  }
}

function renderDelete() {
  currentGuess.pop()
  squares[(prevTurns.length * 5) + (currentGuess.length)].textContent = ''
  return
}

function renderBox(keyClick) {
  console.log(keyClick)
  //come back to this
  //make it so user can edit a letter without deleting previous letters
}

function checkGuess() {
  let thisTurn = []
  let check = currentGuess.join('').toLowerCase()

  if (currentGuess.length === 5) {
    if (checkWord(check)) {
      currentGuess.forEach((letter, i) => {

        if (letter === secretWord[i]) {
          thisTurn.push('correct')
          let idx = getKeyIndex(letter)
          keys[idx].classList.add('correct')

        } else if (secretWord.includes(letter)) {  // Update for edge cases // ex. only color one 'A' in 'PANDA' if secret word is 'BREAD'
          thisTurn.push('almost')
          let idx = getKeyIndex(letter)
          keys[idx].classList.add('almost')

        } else {
          thisTurn.push('miss')
          let idx = getKeyIndex(letter)
          keys[idx].classList.add('miss')
        }
      })
      turnNum++
      prevTurns.push(thisTurn)

      check === secretWord.toLowerCase() ? renderTurn(thisTurn, true) : renderTurn(thisTurn, false)

      currentGuess = []
      return
    }
    else {
      renderWrong()
      return
    }
  }
}

function clearAnimation() {
  r0.classList.remove('animate__animated', 'animate__shakeX')
  r1.classList.remove('animate__animated', 'animate__shakeX')
  r2.classList.remove('animate__animated', 'animate__shakeX')
  r3.classList.remove('animate__animated', 'animate__shakeX')
  r4.classList.remove('animate__animated', 'animate__shakeX')
  r5.classList.remove('animate__animated', 'animate__shakeX')
}

function renderWrong() {
  if (prevTurns.length === 0) r0.classList.add('animate__animated', 'animate__shakeX')
  if (prevTurns.length === 1) r1.classList.add('animate__animated', 'animate__shakeX')
  if (prevTurns.length === 2) r2.classList.add('animate__animated', 'animate__shakeX')
  if (prevTurns.length === 3) r3.classList.add('animate__animated', 'animate__shakeX')
  if (prevTurns.length === 4) r4.classList.add('animate__animated', 'animate__shakeX')
  if (prevTurns.length === 5) r5.classList.add('animate__animated', 'animate__shakeX')
}

function getKeyIndex(char) {
  let index
  keys.forEach((key, idx) => {
    if (key.id === char) { index = idx }
  })
  return index
}

function renderTurn(thisTurn, bool) {
  let i = 0
  let animation
  let time

  bool ? animation = 'animate__shakeY' : animation = 'animate__flip'
  bool ? time = 250 : time = 750

  //Do once first so it happens right on click instaed of waiting a second
  squares[((prevTurns.length - 1) * 5) + i].classList.add('animate__animated', animation, `${thisTurn[i]}`, 'shadow')
  i++
  let timer = setInterval(function () {
    squares[((prevTurns.length - 1) * 5) + i].classList.add('animate__animated', animation, `${thisTurn[i]}`, 'shadow')
    i++
    if (i === 5) { clearInterval(timer) }
  }, time)


   // add function for renderWin that pops a modal up and offers share challenge
}