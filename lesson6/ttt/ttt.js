const readline = require('readline-sync');
const board = [];
const X_MARK = 'x';
const O_MARK = 'o';
const EMPTY_MARK = " ";
const NUMBER_OF_SQUARES = 9;
const GRAND_WIN_SCORE = 3;
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], //rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], //columns
  [0, 4, 8], [2, 4, 6]]; //diagonal

let totalScore = {
  cpu: 0,
  user: 0,
};

let round = 1;

function prompt(string) {
  console.log(`${string}`);
}

function userResponse() {
  readline.question('\nPress "enter" to continue..');
  console.clear();
}

function welcomeMessage() {
  prompt('Welcome to Tic Tac Toe!\n');
  prompt('Each win counts as a point.');
  prompt(`First to ${GRAND_WIN_SCORE} points wins.`);
  userResponse();
}

function displayScore(userPlayer, cpuPlayer) {
  prompt(`    ROUND ${round}     `);
  prompt(`---------------`);
  prompt('     SCORE     ');
  prompt(`Player ${totalScore.user} | CPU ${totalScore.cpu}`);
  prompt(`---------------`);
  if (userPlayer === X_MARK) prompt('You move first.\n');
  if (cpuPlayer === X_MARK) prompt('Computer moves first\n');
  userResponse();
}

function initializeBoard() {
  for (let space = 0; space < NUMBER_OF_SQUARES; space++) {
    board[space] = EMPTY_MARK;
  }
}

function playRound() {
  let userPlayer = getRandomUserPlayer();
  let cpuPlayer = userPlayer === X_MARK ? O_MARK : X_MARK;

  displayScore(userPlayer, cpuPlayer);

  let currentPlayer = X_MARK;
  let moveIndex;

  while (true) {
    printCurrentBoard();

    moveIndex = getMoveIndex(userPlayer, cpuPlayer, currentPlayer);
    console.clear();

    board[moveIndex] = currentPlayer;

    let roundOver = isRoundOver(currentPlayer, userPlayer);

    if (roundOver) break;

    currentPlayer = (currentPlayer === X_MARK) ? O_MARK : X_MARK;
  }
}

function isRoundOver(currentPlayer, userPlayer) {
  if (isWinState()) {
    let didUserWin = currentPlayer === userPlayer;
    declareWinner(didUserWin);
    addPointToWinner(didUserWin);
    return true;
  } else if (isBoardFull()) {
    declareDraw();
    return true;
  } else {
    return false;
  }
}

function getRandomUserPlayer() {
  let player = [X_MARK, O_MARK][Math.floor(Math.random() * 2)];
  return player;
}

function printCurrentBoard() {
  prompt("-Current-   --Move---");
  prompt("--Board--   -Options-");
  prompt(`${board[0]} | ${board[1]} | ${board[2]}   1 | 2 | 3`);
  prompt("---------   ---------");
  prompt(`${board[3]} | ${board[4]} | ${board[5]}   4 | 5 | 6`);
  prompt("---------   ---------");
  prompt(`${board[6]} | ${board[7]} | ${board[8]}   7 | 8 | 9`);
  prompt("");
}

function getMoveIndex(userPlayer, cpuPlayer, currentPlayer) {
  if (userPlayer === currentPlayer) {
    return getMoveIndexFromUser(userPlayer, cpuPlayer);
  } else {
    return getMoveIndexFromComputer(currentPlayer, userPlayer);
  }
}

function getMoveIndexFromUser(user, cpu) {
  while (true) {
    console.clear();
    prompt(` PLAYER: ${user.toUpperCase()} | CPU: ${cpu.toUpperCase()}`);
    prompt("---------------------\n");
    printCurrentBoard();
    prompt('Select a move: 1-9');
    let userMoveSelection = readline.question();
    console.clear();
    let moveIndex = Number(userMoveSelection) - 1;
    if (isValidMove(moveIndex)) {
      return moveIndex;
    }
    prompt(`${userMoveSelection} is not a valid Selection`);
    userResponse();
  }
}

function getMoveIndexFromComputer(cpuMark, humanMark) {
  while (true) {
    let computerWinIndex = twoInARowIndex(cpuMark);
    if (computerWinIndex !== null) return computerWinIndex;

    let humanWinIndex = twoInARowIndex(humanMark);
    if (humanWinIndex !== null) return humanWinIndex;

    if (board[4] === ' ') return 4;

    let randomMoveIndex = Math.floor(board.length * Math.random());
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
      if (board[space] === playerMark) playerMarkCounter += 1;
      if (board[space] === EMPTY_MARK) emptySpace = space;
      if ((emptySpace !== null) && (playerMarkCounter === 2)) {
        match = emptySpace;
      }
    });
  });
  return match;
}

function isValidMove(moveIndex) {
  return (moveIndex >= 0 && moveIndex <= 8 && board[moveIndex] === EMPTY_MARK);
}

function isWinState() {
  let xWins = WIN_LINES.map(winLine => {
    return winLine.every(moveIndex => board[moveIndex] === X_MARK);
  }).includes(true);
  let oWins = WIN_LINES.map(winLine => {
    return winLine.every(moveIndex => board[moveIndex] === O_MARK);
  }).includes(true);
  return !!(xWins || oWins);
}

function isBoardFull() {
  return board.every(space => {
    return (space === X_MARK || space === O_MARK);
  });
}

function declareWinner(didUserWin) {
  console.clear();
  let winnerMessage = didUserWin ? '------You Won!-----\n' : '--Computer Wins!--\n';
  prompt(winnerMessage);
  printCurrentBoard();
  userResponse();
}

function addPointToWinner(didUserWin) {
  if (didUserWin) totalScore.user += 1;
  if (!didUserWin) totalScore.cpu += 1;
}

function declareDraw() {
  console.clear();
  prompt(`---It's a Draw!---\n`);
  printCurrentBoard();
  userResponse();
}

function doesUserWantToPlayAgain() {
  while (true) {
    console.clear();
    prompt("Would you like to play again? (y/n)");
    let response = readline.question();
    if (['y', 'yes'].includes(response.toLowerCase())) return true;
    if (['n', 'no'].includes(response.toLowerCase())) return false;
    console.clear();
    prompt(`${response} is not a valid response.`);
    userResponse();
  }
}

function displayGrandWinner() {
  console.clear();
  if (totalScore.user === GRAND_WIN_SCORE) {
    prompt("***You are the GRAND WINNER!***\n");
  } else {
    prompt("***Computer is the GRAND WINNER!***\n");
  }
  prompt("--FINAL SCORE--");
  prompt(`Player ${totalScore.user} | CPU ${totalScore.cpu}\n`);
  prompt(`Total Rounds: ${round}.`);
  userResponse();
}

function playTourney() {
  console.clear();

  welcomeMessage();

  while (!Object.values(totalScore).includes(GRAND_WIN_SCORE)) {
    initializeBoard();
    playRound();
    round += 1;
  }

  displayGrandWinner();
}

let playAgain = true;
while (playAgain) {
  totalScore.cpu = 0;
  totalScore.user = 0;
  round = 1;
  playTourney();
  playAgain = doesUserWantToPlayAgain();
}
