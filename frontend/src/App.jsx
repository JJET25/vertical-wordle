import React, { useState, useEffect } from "react";
import './style.css';

const Game = () => {
    const [state, setState] = useState({
        secret: '',
        grid: Array(5).fill().map(() => Array(5).fill('')),
        currentRow: 0,
        currentCol: 0,
    });

    useEffect(() => {
        fetchWord();
    }, []);

    const fetchWord = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/words/random`);;
            console.log("Response from backend:", response);
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                alert('Failed to load the word. Try again!');
                return;
            }
            const data = await response.json();
            console.log("Data from backend:", data);
            setState((prevState) => ({
                ...prevState,
                secret: data.word.toUpperCase(),
            }));
            console.log("Secret word:", data.word.toUpperCase());
        } catch (error) {
            console.error('Error fetching word:', error);
            alert('Failed to load the word. Try again!');
        }
    };

    const saveGameResult = async (won) => {
        try {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/words/game`, {
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
            // ...
        }
    };

    const updateGrid = () => {
        return (
            <div className="grid">
                {state.grid.map((row, i) => (
                    <div key={i} className="grid-row">
                        {row.slice(0, 5).map((letter, j) => (
                            <div key={j} className={`box ${letter ? 'filled' : ''}`} id={`box${i}${j}`}>
                                {letter}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    const handleKeyDown = (e) => {
        const key = e.key.toUpperCase();
        if (key === 'ENTER') {
            if (state.currentCol === 5) {
                const word = getCurrentWord();
                if (word.length === 5) {
                    revealWord(word);
                    setState(prevState => ({
                        ...prevState,
                        currentRow: prevState.currentRow + 1,
                        currentCol: 0,
                    }));
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
    };

    const getCurrentWord = () => state.grid[state.currentRow].join('');

    const revealWord = async (guess) => {
        const row = state.currentRow;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/words/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ word: guess.toLowerCase() })
            });

            const data = await response.json();

            if (!data.valid) {
                alert('Not a valid word.');
                return;
            }

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
        } catch (error) {
            console.error('Error validating word:', error);
            alert('An error occurred during validation.');
        }
    };

    const isLetter = (key) => key.length === 1 && /^[A-Z]$/.test(key);

    const addLetter = (letter) => {
        if (state.currentCol === 5) return;
        const newGrid = [...state.grid];
        newGrid[state.currentRow][state.currentCol] = letter;
        setState(prevState => ({
            ...prevState,
            grid: newGrid,
            currentCol: prevState.currentCol + 1
        }));
    };

    const removeLetter = () => {
        if (state.currentCol === 0) return;
        const newGrid = [...state.grid];
        newGrid[state.currentRow][state.currentCol - 1] = '';
        setState(prevState => ({
            ...prevState,
            grid: newGrid,
            currentCol: prevState.currentCol - 1
        }));
    };

    useEffect(() => {
        document.body.onkeydown = handleKeyDown;
    }, [state]);

    return (
        <div className="game-container">
            <h1 className = "h1">VERTICAL WORDLE</h1>
            <div id="game">{updateGrid()}</div>
            <button className = 'button' onClick={() => saveGameResult(false)}>END GAME</button>
        </div>
    );
};

export default Game;