import { Difficulty, GameState } from './gameState.js';
import { GameController } from './gameController.js';

let timer;
let time = 0;

let gameController = new GameController();
let difficulty = Difficulty.EASY;

// Select elements from the DOM

// Menu Screen
const easyButton         = document.querySelector('#easyBtn');
const hardButton         = document.querySelector('#hardBtn');
const startButton        = document.querySelector('#startGameBtn');
const menuLeaderboardBtn = document.querySelector('#menuLeaderboardBtn');
const loadGameBtn        = document.querySelector('#loadGameBtn');

// Description Screen
const descriptionBtn     = document.querySelector('#descriptionBtn');
const descriptionCloseBtn= document.querySelector('#descriptionCloseBtn');

// Leaderboard Screen
const leaderboardCloseBtn = document.querySelector('#leaderboardCloseBtn');

// Game Screen
const pauseResumeBtn     = document.querySelector('#pauseResumeGameBtn');
const restartGameBtn     = document.querySelector('#restartGameBtn');
const backToMenuBtn      = document.querySelector('#backToMenuBtn');
const saveGameBtn        = document.querySelector('#saveGameBtn');

// screens
const menuScreen         = document.querySelector('#menuScreen');
const descriptionScreen  = document.querySelector('#descriptionScreen');
const leaderboardScreen  = document.querySelector('#leaderBoardScreen');
const gameScreen         = document.querySelector('#gameScreen');

 /* Event Listeners */

// Menu Screen
easyButton.addEventListener('click', () => toggleDifficulty(easyButton, Difficulty.EASY, hardButton));
hardButton.addEventListener('click', () => toggleDifficulty(hardButton, Difficulty.HARD, easyButton));
descriptionBtn.addEventListener('click', showDescriptionScreen);
loadGameBtn.addEventListener('click', loadGame);
startButton.addEventListener('click', startGame);
menuLeaderboardBtn.addEventListener('click', () => {
    menuScreen.style.display = 'none';
    displayLeaderboard();
});

// Game Screen
pauseResumeBtn.addEventListener('click', pauseResumeGame);
restartGameBtn.addEventListener('click', restartGame);
backToMenuBtn.addEventListener('click', backToMenu);
saveGameBtn.addEventListener('click', saveGame); // Attach saveGame function to the button

// Description Screen
descriptionCloseBtn.addEventListener('click', showMenuScreen);

// Leaderboard Screen
leaderboardCloseBtn.addEventListener('click', showMenuScreen);

/* Custom Events */
document.addEventListener('solutionFound', gameOver);

// Functions
function toggleDifficulty(selectedButton, selectedDifficulty, otherButton) {
    difficulty = selectedDifficulty;
    gameController.init(difficulty);
    selectedButton.classList.add('active');
    otherButton.classList.remove('active');
}

function backToMenu() { 
    gameScreen.style.display = 'none';
    menuScreen.style.display = 'flex';
}

function restartGame() {
    clearInterval(timer);
    time = 0;
    document.querySelector('#time').textContent = '00:00';

    // Change the pause/resume button text
    pauseResumeBtn.textContent = 'SZÜNET';
    gameController.isRunning = true;
    // Make sure the user can interact with the game board
    gameController.render.container.style.pointerEvents = 'auto';

    gameController.restartGame();
    setTimer();
}

function showDescriptionScreen() {
    menuScreen.style.display = 'none';
    descriptionScreen.style.display = 'flex';
}

function showMenuScreen() {
    descriptionScreen.style.display = 'none';
    leaderboardScreen.style.display = 'none';
    menuScreen.style.display = 'flex';
}

// function to save the current game state to local storage
function saveGame() {
    const playerName  = document.querySelector('#playerName').textContent;
    const currentTime = document.querySelector('#time').textContent;
    const gameState     = gameController.gameState.serialize();

    const savedGame = {
        playerName,
        time: currentTime,
        difficulty,
        gameState
    };

    localStorage.setItem('savedGame', JSON.stringify(savedGame));
}

function loadGame() {
    const savedGame = JSON.parse(localStorage.getItem('savedGame'));
    if (!savedGame)
        return;

    const playerName = savedGame.playerName;
    const currentTime = savedGame.time;
    const gameState = savedGame.gameState;

    gameController.initWithGameState(GameState.deserialize(gameState));

    menuScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    document.querySelector('#playerName').textContent = playerName;
    document.querySelector('#time').textContent = currentTime;
    clearInterval(timer);

    // enable the user to interact with the game board
    gameController.render.container.style.pointerEvents = 'auto';
    gameController.isRunning = true;

    time = timeStringToSeconds(currentTime);

    // Change the pause/resume button text
    pauseResumeBtn.textContent = 'SZÜNET';

    setTimer();
}

function setTimer() {
    timer = setInterval(() => {
        document.querySelector('#time').textContent = secondsToTime(++time);
    }, 1000);
}

function startGame() {
    const playerName = document.querySelector('#usernameInput').value;
    if (!playerName) {
        document.querySelector('#usernameInput').placeholder = 'ADD MEG A NEVED!';
        return;
    }
    
    gameController.init(difficulty);

    // set the pauseResumeBtn text to 'PAUSE GAME'
    pauseResumeBtn.textContent = 'SZÜNET';

    menuScreen.style.display = 'none';
    document.querySelector('#gameScreen').style.display = 'flex';
    document.querySelector('#playerName').textContent = playerName;
    document.querySelector('#time').textContent = secondsToTime(time);
    clearInterval(timer);

    document.querySelector('#time').textContent = '00:00';
    gameController.isRunning = true;

    time = 0;

    // enable the user to interact with the game board
    gameController.render.container.style.pointerEvents = 'auto';

    setTimer();
}

function secondsToTime(seconds) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const remainingSeconds = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
}

function gameOver() {
    clearInterval(timer);
    // disable the user from interacting with the game board
    gameController.render.container.style.pointerEvents = 'none';

    const playerName = document.querySelector('#playerName').textContent;
    const time = document.querySelector('#time').textContent;
    const leaderboard = JSON.parse(localStorage.getItem(`${difficulty}leaderboard`)) || [];
    leaderboard.push({ playerName, time });
    localStorage.setItem(`${difficulty}leaderboard`, JSON.stringify(leaderboard));

    setTimeout(() => {
        document.querySelector('#gameScreen').style.display = 'none';
        leaderboardScreen.style.display = 'flex';
        displayLeaderboard();
    }, 1000);
}

function toggleUserInteraction() {
    gameController.render.container.style.pointerEvents = gameController.render.container.style.pointerEvents === 'none' ? 'auto' : 'none';
}

function pauseResumeGame() {
    if (gameController.isRunning) {
        gameController.isRunning = false;
        pauseResumeBtn.textContent = 'FOLYTATÁS';
        clearInterval(timer);
        toggleUserInteraction();
    }

    else {
        gameController.isRunning = true;
        pauseResumeBtn.textContent = 'SZÜNET';

        // resume the timer somehow and allow the user to interact with the game board
        setTimer();
        toggleUserInteraction();
    }
}

function timeStringToSeconds(time) {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
}

function displayLeaderboard() {
    leaderboardScreen.style.display = 'flex';
    const leaderboard = JSON.parse(localStorage.getItem(`${difficulty}leaderboard`)) || [];
    const leaderboardTable = document.querySelector('#leaderboardTable');
    leaderboardTable.innerHTML = '';

    leaderboard.sort((a, b) => timeStringToSeconds(a.time) - timeStringToSeconds(b.time));

    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.playerName}</td>
            <td>${entry.time}</td>
        `;
        if (entry.playerName === document.querySelector('#playerName').textContent) {
            row.classList.add('highlight');
            row.querySelectorAll('td').forEach(td => td.classList.add('highlight'));
        }
        leaderboardTable.appendChild(row);
    });
}
