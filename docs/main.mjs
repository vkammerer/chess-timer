import { chessTimer } from "./chessTimer.mjs";

const playersDiv = document.querySelector("#players");
const playersDivs = Array.from(document.querySelectorAll('#players > div > span'));

const setPlayersDiv = playerIndex => playersDiv.className = `player_${playerIndex}`;

const setPlayerDiv = (playerIndex, player) =>
  playersDivs[playerIndex].innerText = 100 - Math.floor(player.elapsed / 1000);

const myTimer = chessTimer({
  period: 1000,
  increment: 5000,
  count: playersDivs.length,
  cb: ({ playerIndex, players }) => {
    playersDivs.forEach((_, i) => setPlayerDiv(i, players[i]));
    setPlayersDiv(playerIndex);
  },
});

const playButton = document.querySelector("#play");
const pauseButton = document.querySelector("#pause");
const nextButton = document.querySelector("#next");

playButton.addEventListener("click", myTimer.play);
pauseButton.addEventListener("click", myTimer.pause);
nextButton.addEventListener("click", myTimer.next);
