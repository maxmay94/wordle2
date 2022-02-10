/*-------------------------------- Constants --------------------------------*/



/*---------------------------- Variables (state) ----------------------------*/



/*------------------------ Cached Element References ------------------------*/

const squares = document.querySelectorAll('.square')
const keys = document.querySelectorAll('.key')
const gameBoard = document.querySelector('#main-game-area')
const mainTitle = document.getElementById('main-title')

/*----------------------------- Event Listeners -----------------------------*/

gameBoard.addEventListener('click', handleClick)

/*-------------------------------- Functions --------------------------------*/


function handleClick(evt) {
  
  console.log(evt.target)
}