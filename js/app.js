/*-------------------------------- Constants --------------------------------*/

import { getWord, getWordIndex, setWord, checkWord } from "../Data/word-list.js"
const ltrs = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
  'Z', 'X', 'C', 'V', 'B', 'N', 'M']

  const synth1 = new Audio('Audio/synth-1.m4a')
  const synth2 = new Audio('Audio/synth-2.m4a')
  const synthRisers = new Audio('Audio/synth-risers.m4a')
  const fullTrack = new Audio('Audio/full-track.m4a')

  // const userData = {
  //   turn1: 0,
  //   turn2: 0,
  //   turn3: 0,
  //   turn4: 0,
  //   turn5: 0,
  //   turn6: 0,
  //   fail: 0
  // }

/*---------------------------- Variables (state) ----------------------------*/

let secretWord, wordIndex, challengeWordID, totalStats
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
const newGame = document.getElementById('new-game-modal-button')
const challengeBtn = document.getElementById('challenge-button')
const challengeTextBox = document.getElementById('challenge-id')
const shareBtn = document.getElementById('share-button')
const clipBoardBtn = document.getElementById('clipboard-button')
const musicBtn = document.getElementById('music-button')

const statsBtn = document.getElementById('stats-btn')
const clearStatsBtn = document.getElementById('clear-stats-btn')

const lvl1Btn = document.getElementById('lvl-1')
const lvl2Btn = document.getElementById('lvl-2')
const lvl3Btn = document.getElementById('lvl-3')
const lvl4Btn = document.getElementById('lvl-4')
const lvl5Btn = document.getElementById('lvl-5')

const prog1 = document.getElementById('prog-1')
const prog2 = document.getElementById('prog-2')
const prog3 = document.getElementById('prog-3')
const prog4 = document.getElementById('prog-4')
const prog5 = document.getElementById('prog-5')
const prog6 = document.getElementById('prog-6')

const modalText = document.getElementById('modal-text')
const modalTitle = document.querySelector('.modal-title')
const myModal = new bootstrap.Modal(document.getElementById('share-modal'))

const statsModalBody = document.getElementById('stats-modal-body')
const statsModal = new bootstrap.Modal(document.getElementById('stats-modal'))

const toastMsg = document.getElementById('toast-message')
const toastLiveExample = document.getElementById('liveToast')

/*----------------------------- Event Listeners -----------------------------*/

gameBoard.addEventListener('click', handleClick)
resetBtn.addEventListener('click', init)
newGame.addEventListener('click', init)
challengeBtn.addEventListener('click', challenge)
shareBtn.addEventListener('click', renderModal)
musicBtn.addEventListener('click', soundTrack)
clipBoardBtn.addEventListener('click', copyToClipboard)

statsBtn.addEventListener('click', renderStats)

clearStatsBtn.addEventListener('click', () => {
  localStorage.clear()
  // updateStats()
  console.log(localStorage)
})

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
 
  var toast = new bootstrap.Toast(toastLiveExample)
  toastMsg.textContent = `You've changed to Level ${difficulty}`
  toast.show()

  init()
}

function challenge() {
  challengeWordID = challengeTextBox.value

  var toast = new bootstrap.Toast(toastLiveExample)
  toastMsg.textContent = `You've accepted a challenge!`
  toast.show()

  init()
}

function handleKeydown(evt) {
  clearAnimation()
  let press = evt.key

  if(press) press = press.toUpperCase()
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

  let secretObj = secretWord.split('').reduce((obj, num) => {
    if(obj[num]) {obj[num]++} 
    else {obj[num] = 1}
    return obj
  }, {})

  if (currentGuess.length === 5) {
    if (checkWord(check)) {

      currentGuess.forEach((letter, i) => {
        if (letter === secretWord[i]) { 

          secretObj[letter]--
          thisTurn.push('correct')
          let idx = getKeyIndex(letter)
          keys[idx].classList.add('correct')

        } else if (secretWord.includes(letter) && secretObj[letter] > 0) { 

          secretObj[letter]--
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
    updateStats()
    shareBtn.removeAttribute("hidden")
  } else if (prevTurns.length === 6) {
    setTimeout(() => renderModal(), 2000)
    shareBtn.removeAttribute("hidden")
  }
}

function renderModal() {
  if (solve) { 
    prevTurns.length > 1 ? modalTitle.textContent = `Congratulations! It took you ${prevTurns.length} turns to solve!` : modalTitle.textContent = `Woah!! You solved in 1 turn!`
  } else {
    modalTitle.textContent = `Dang, you didn't get it this time. The word was ${secretWord}...`
  }


  myModal.toggle()
  keyBoard.removeEventListener('click', handleClick, false)
  document.removeEventListener('keydown', handleKeydown, false)
  let myString = ''

  prevTurns.forEach((turn) => {
    turn.forEach((hitMiss) => {
      if (hitMiss === 'miss') myString += ('⬜️ ')
      else if (hitMiss === 'almost') myString += ('🟧 ')
      else if (hitMiss === 'correct') myString += ('🟩 ')
    })
    myString += ('<br>')
  })
  myString += ('Use code: ' + wordIndex)
  modalText.innerHTML = myString
}

function renderStats() {
  console.log('RENDER STATS')
  statsModal.toggle()
  let numPlays = getNumPlays()

  console.log(localStorage)

  if(localStorage['turn1']) { 
    prog1.style.width = `${(parseInt(localStorage['turn1']) / numPlays) * 100}%`
    prog1.textContent = `${parseInt(localStorage['turn1'])}`
  }
  if(localStorage['turn2']) { 
    prog2.style.width = `${(parseInt(localStorage['turn2']) / numPlays) * 100}%`
    prog2.textContent = `${parseInt(localStorage['turn2'])}`
  }
  if(localStorage['turn3']) { 
    prog3.style.width = `${(parseInt(localStorage['turn3']) / numPlays) * 100}%`
    prog3.textContent = `${parseInt(localStorage['turn3'])}`
  }
  if(localStorage['turn4']) { 
    prog4.style.width = `${(parseInt(localStorage['turn4']) / numPlays) * 100}%`
    prog4.textContent = `${parseInt(localStorage['turn4'])}`
  }
  if(localStorage['turn5']) { 
    prog5.style.width = `${(parseInt(localStorage['turn5']) / numPlays) * 100}%`
    prog5.textContent = `${parseInt(localStorage['turn5'])}`
  }
  if(localStorage['turn6']) { 
    prog6.style.width = `${(parseInt(localStorage['turn6']) / numPlays) * 100}%`
    prog6.textContent = `${parseInt(localStorage['turn6'])}`
  }

}

function copyToClipboard() {
  let newClip = modalText.innerHTML
  function updateClipboard(newClip) {
    navigator.clipboard.writeText(newClip).then(function () {
    }, function () {
      console.log('Clip Failed')
    });
  }
  newClip += ('<br>https://maxmay94.github.io/wordle2/')
  newClip = newClip.replaceAll('<br>', '\n')
  updateClipboard(newClip)
}

function soundTrack() {
  let bpm = setInterval(function () {
    if(prevTurns.length === 0) synth1.play()
    else if(prevTurns.length === 1) synth2.play()
    else if(prevTurns.length === 2) {
      synth2.pause()
      synth2.currentTime = 0
      synthRisers.play()
    }
    else {
      synthRisers.pause()
      synthRisers.currentTime = 0
      fullTrack.play()
    }
  }, 0)
}

function updateStats() {
  let temp = (parseInt(localStorage[`turn${prevTurns.length}`]))

  if(!temp) {
    localStorage.setItem(`turn${prevTurns.length}`, 1)
  } else {
    temp++
    localStorage.setItem(`turn${prevTurns.length}`, temp)
  }
}

function getNumPlays() {
  let plays = 0
  for(let [key, value] of Object.entries(localStorage)) {
    plays += parseInt(value)
  }
  return plays
}
