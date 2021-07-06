const readline = require('readline-sync');
const BOARD = [];
const NUMBER_OF_SQUARES = 9;
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], //rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], //columns
  [0, 4, 8], [2, 4, 6]]; //diagonal

function prompt(string) {
  console.log(`${string}`);
}

function userResponse() {
  readline.question('Press "enter" to continue..');
  console.clear();
}

function getRandomUserPlayer() {
  let player = ['x', 'o'][Math.floor(Math.random() * 2)];
  return player;
}

function printCurrentBoard() {
  prompt("-Current-   --Move---");
  prompt("--Board--   -Options-");
  prompt(`${BOARD[0]} | ${BOARD[1]} | ${BOARD[2]}   1 | 2 | 3`);
  prompt("---------   ---------");
  prompt(`${BOARD[3]} | ${BOARD[4]} | ${BOARD[5]}   4 | 5 | 6`);
  prompt("---------   ---------");
  prompt(`${BOARD[6]} | ${BOARD[7]} | ${BOARD[8]}   7 | 8 | 9`);
  prompt("");
}

function getMoveIndex(userPlayer, currentPlayer) {
  if (userPlayer === currentPlayer) {
    return getMoveIndexFromUser();
  } else {
    return getMoveIndexFromComputer(currentPlayer, userPlayer);
  }
}

function getMoveIndexFromUser() {
  while (true) {
    console.clear();
    printCurrentBoard();
    prompt('Select a move: 1-9');
    let userMoveSection = readline.question();
    console.clear();
    let moveIndex = Number(userMoveSection) - 1;
    if (isValidMove(moveIndex)) {
      return moveIndex;
    }
  }
}

function getMoveIndexFromComputer(CPUMark, humanMark) {
  while (true) {
    let computerWinIndex = twoInARowIndex(CPUMark);
    if (computerWinIndex !== null) return computerWinIndex;

    let humanWinIndex = twoInARowIndex(humanMark);
    if (humanWinIndex !== null) return humanWinIndex;

    if (BOARD[4] === ' ') return 4;

    let randomMoveIndex = Math.floor(BOARD.length * Math.random());
    if (isValidMove(randomMoveIndex)) {
      return randomMoveIndex;
    }
  }
}

function twoInARowIndex(playerMark) {
  let match = null;
  WIN_LINES.forEach((winLine) => {
    let emptySpace = null;
    let playerMarkCounter = 0;
    winLine.forEach(space => {
      if (BOARD[space] === playerMark) playerMarkCounter += 1;
      if (BOARD[space] === ' ') emptySpace = space;
      if ((emptySpace !== null) && (playerMarkCounter === 2)) {
        match = emptySpace;
      }
    });
  });
  return match;
}

function isValidMove(moveIndex) {
  return !!(moveIndex >= 0 && moveIndex <= 8 && BOARD[moveIndex] === ' ');
}

function isWinState() {
  let xWins = WIN_LINES.map(winLine => {
    return winLine.every(moveIndex => BOARD[moveIndex] === 'x');
  }).includes(true);
  let oWins = WIN_LINES.map(winLine => {
    return winLine.every(moveIndex => BOARD[moveIndex] === 'o');
  }).includes(true);
  return !!(xWins || oWins);
}

function isBoardFull() {
  return BOARD.every(space => {
    return (space === 'x' || space === 'o');
  });
}

function declareWinner(currentPlayer) {
  console.clear();
  prompt(`${currentPlayer} Wins!`);
  prompt('');
  printCurrentBoard();
  userResponse();
}

function declareDraw() {
  console.clear();
  prompt(`It's a Draw!`);
  printCurrentBoard();
  userResponse();
}

function doesUserWantToPlayAgain() {
  while (true) {
    console.clear();
    prompt("Would you like to play again? (y/n)");
    let response = readline.question();
    if (response === 'y') return true;
    if (response === 'n') return false;
    console.clear();
    prompt(`${response} is not a valid response.`);
    userResponse();
  }
}

console.clear();

prompt('Welcome to Tic Tac Toe!');
prompt('');

let playAgain = true;

while (playAgain) {

  for (let space = 0; space < NUMBER_OF_SQUARES; space++) {
    BOARD[space] = " ";
  }

  let userPlayer = getRandomUserPlayer();
  prompt(`You are player "${userPlayer}"`);
  prompt('Player "x" goes first.');
  prompt("");
  userResponse();

  let currentPlayer = 'x';
  let moveIndex;

  while (true) {
    printCurrentBoard();
    prompt(`It is ${currentPlayer}'s turn`);

    moveIndex = getMoveIndex(userPlayer, currentPlayer);
    console.clear();

    BOARD[moveIndex] = currentPlayer;

    if (isWinState()) {
      declareWinner(currentPlayer);
      break;
    } else if (isBoardFull()) {
      declareDraw();
      break;
    } else {
      currentPlayer = (currentPlayer === 'x') ? 'o' : 'x';
    }
  }

  playAgain = doesUserWantToPlayAgain();
  console.clear();
  if (!playAgain) prompt("Thank you for playing. Goodbye!");
}