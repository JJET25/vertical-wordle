import mongoose from "mongoose";
import Game from "../models/Game.js";
import Word from "../models/Word.js";
import express from 'express';

const router = express.Router();

router.get('/random', async (req, res) => {
    try {
        const words = await Word.find();
        if (!words.length) {
            return res.status(404).json({ error: 'No words found' });
        }
        const randomWord = words[Math.floor(Math.random() * words.length)];
        res.json({ word: randomWord.word });
    } catch (error) {
        console.error('Error getting random word:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/validate', async (req, res) => {
    try {
        const { word } = req.body;
        if (!word) {
            return res.status(400).json({ error: 'Word is required' });
        }

        const foundWord = await Word.findOne({ word: word.toLowerCase() });

        if (foundWord) {
            res.json({ valid: true });
        } else {
            res.json({ valid: false });
        }
    } catch (error) {
        console.error('Error validating word:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/game', async (req, res) => {
    try {
        const { player, word, attempts, won } = req.body;
        const newGame = new Game({ player, word, attempts, won });
        await newGame.save();
        res.status(201).json({ message: 'Game saved successfully' });
    } catch (error) {
        console.error('Error saving game:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;