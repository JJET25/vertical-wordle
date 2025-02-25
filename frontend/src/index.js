let dictionary = [];

const state = {
    secret: '',
    grid: Array(6).fill().map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,
};

async function fetchWord() {
    try {
        const response = await fetch('http://localhost:5005/api/words/random');
        const data = await response.json();
        state.secret = data.word.toUpperCase();
    } catch (error) {
        console.error('Error fetching word:', error);
        alert('Failed to load the word. Try again!');
    }
}

async function saveGameResult(won) {
    try {
        await fetch('http://localhost:5005/api/words/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                player: 'Guest',
                word: state.secret,
                attempts: state.currentRow + 1,
                won
            })
        });
    } catch (error) {
        console.error('Error saving game result:', error);
    }
}

function updateGrid() {
    for (let i = 0; i < state.grid.length; i++) {
        for (let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

function drawBox(container, row, col, letter = '') {
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = letter;

    container.appendChild(box);
    return box;
}

function drawGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'grid';

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            drawBox(grid, i, j);
        }
    }

    container.appendChild(grid);
}

function registerKeyBoardEvents() {
    document.body.onkeydown = (e) => {
        const key = e.key.toUpperCase();
        if (key === 'ENTER') {
            if (state.currentCol === 5) {
                const word = getCurrentWord();
                if (word.length === 5) {
                    revealWord(word);
                    state.currentRow++;
                    state.currentCol = 0;
                } else {
                    alert('Not a valid word.');
                }
            }
        }
        if (key === 'BACKSPACE') {
            removeLetter();
        }
        if (isLetter(key)) {
            addLetter(key);
        }

        updateGrid();
    };
}

function getCurrentWord() {
    return state.grid[state.currentRow].join('');
}

function revealWord(guess) {
    const row = state.currentRow;
    let correctCount = 0;

    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;

        if (letter === state.secret[i]) {
            box.classList.add('right');
            correctCount++;
        } else if (state.secret.includes(letter)) {
            box.classList.add('wrong');
        } else {
            box.classList.add('empty');
        }
    }

    const isWinner = correctCount === 5;
    const isGameOver = state.currentRow === 5;

    if (isWinner) {
        alert('Congratulations! You guessed the word!');
        saveGameResult(true);
    } else if (isGameOver) {
        alert(`Better luck next time! The word was ${state.secret}.`);
        saveGameResult(false);
    }
}

function isLetter(key) {
    return key.length === 1 && /^[A-Z]$/.test(key);
}

function addLetter(letter) {
    if (state.currentCol === 5) return;
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

function removeLetter() {
    if (state.currentCol === 0) return;
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
}

async function startup() {
    const game = document.getElementById('game');
    drawGrid(game);
    registerKeyBoardEvents();
    await fetchWord();
}

startup();