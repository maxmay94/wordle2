/*-------------------------------- Constants --------------------------------*/

import { getWord, getWordIndex, setWord, checkWord } from "../Data/word-list.js"
const ltrs = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
  'Z', 'X', 'C', 'V', 'B', 'N', 'M']

/*---------------------------- Variables (state) ----------------------------*/

let secretWord, wordIndex, challengeWordID
let currentGuess = []
let prevTurns = []
let difficulty = 1
let solve = false

/*------------------------ Cached Element References ------------------------*/

const squares = document.querySelectorAll('.square')
const keys = document.querySelectorAll('.key')

const gameBoard = document.querySelector('#main-game-area')
const keyBoard = document.querySelector('#keyboard')

const resetBtn = document.getElementById('reset-btn')
const challengeBtn = document.getElementById('challenge-button')
const challengeTextBox = document.getElementById('challenge-id')
const shareBtn = document.getElementById('share-button')

const lvl1Btn = document.getElementById('lvl-1')
const lvl2Btn = document.getElementById('lvl-2')
const lvl3Btn = document.getElementById('lvl-3')
const lvl4Btn = document.getElementById('lvl-4')
const lvl5Btn = document.getElementById('lvl-5')

const modalText = document.getElementById('modal-text')

const myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'))
const modalTitle = document.querySelector('.modal-title')


/*----------------------------- Event Listeners -----------------------------*/

gameBoard.addEventListener('click', handleClick)
resetBtn.addEventListener('click', init)
challengeBtn.addEventListener('click', challenge)
shareBtn.addEventListener('click', renderModal)

lvl1Btn.addEventListener('click', changeLvl)
lvl2Btn.addEventListener('click', changeLvl)
lvl3Btn.addEventListener('click', changeLvl)
lvl4Btn.addEventListener('click', changeLvl)
lvl5Btn.addEventListener('click', changeLvl)

/*-------------------------------- Functions --------------------------------*/

init()

function init() {
  keyBoard.addEventListener('click', handleClick)
  document.addEventListener('keydown', handleKeydown)
  modalText.textContent = ''
  solve = false
  shareBtn.setAttribute("hidden", true)

  challengeWordID ? secretWord = setWord(challengeWordID).toUpperCase() : secretWord = getWord(difficulty).toUpperCase()
   
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

  challengeWordID = null
}

function changeLvl(evt) {
  difficulty = parseInt(evt.target.id.substring(4))
  init()
}

function challenge() {
  challengeWordID = challengeTextBox.value
  init()
}

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

  if (currentGuess.join('') === secretWord) {
    setTimeout(() => renderModal(), 2000)
    solve = true
    shareBtn.removeAttribute("hidden")
  }
}

function renderModal() {
  if (solve) {
    myModal.toggle()
    keyBoard.removeEventListener('click', handleClick, false)
    document.removeEventListener('keydown', handleKeydown, false)

    let myString = ''

    prevTurns.length > 1 ? modalTitle.textContent = `Congratulations! It took you ${prevTurns.length} turns to solve!` : modalTitle.textContent = `Woah!! You solved in 1 turn!`

    prevTurns.forEach((turn) => {
      turn.forEach((hitMiss) => {
        if(hitMiss === 'miss') myString += ('⬜️ ')
        else if(hitMiss === 'almost') myString += ('🟧 ')
        else if(hitMiss === 'correct') myString += ('🟩 ')
      })
      myString += ('<br>')
    })
    myString += ('<br>Use code: ' + wordIndex)
    modalText.innerHTML = myString
  }
}