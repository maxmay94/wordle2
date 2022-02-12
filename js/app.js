/*-------------------------------- Constants --------------------------------*/

import {getWord, checkWord} from "../Data/word-list.js"

/*---------------------------- Variables (state) ----------------------------*/

let turnNum = 0
let currentGuess = []
let prevTurns = []
// let secretWord = getWord(1).toUpperCase()
let secretWord = 'bread'.toUpperCase()
console.log(secretWord)

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
  let check = currentGuess.join('').toLocaleLowerCase()

  if (currentGuess.length === 5) {
    if(checkWord(check)) { 
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
      prevTurns.push(currentGuess) // maybe push thisTurn?? haven't decided yet. might make it easier to make a share emoji thing at the end
      renderGuess(thisTurn) 
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
  if(prevTurns.length === 0) r0.classList.add('animate__animated', 'animate__shakeX')
  if(prevTurns.length === 1) r1.classList.add('animate__animated', 'animate__shakeX')
  if(prevTurns.length === 2) r2.classList.add('animate__animated', 'animate__shakeX')
  if(prevTurns.length === 3) r3.classList.add('animate__animated', 'animate__shakeX')
  if(prevTurns.length === 4) r4.classList.add('animate__animated', 'animate__shakeX')
  if(prevTurns.length === 5) r5.classList.add('animate__animated', 'animate__shakeX')
}

function getKeyIndex(char) {
  let index
  keys.forEach((key, idx) => {
    if (key.id === char) { index = idx }
  })
  return index
}

function renderGuess(thisTurn) {
  let i = 0 
  squares[((prevTurns.length - 1) * 5) + i].classList.add('animate__animated', 'animate__flip', `${thisTurn[i]}`, 'shadow')
  i++
  //Do once first so it happens right on click instaed of waiting a second
  let timer = setInterval(function () {
    squares[((prevTurns.length - 1) * 5) + i].classList.add('animate__animated', 'animate__flip', `${thisTurn[i]}`, 'shadow')
    i++
    if(i === 5) {clearInterval(timer)}
  }, 750)
}