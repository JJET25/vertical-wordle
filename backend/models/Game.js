import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
    player: { type: String, required: true },
    word: { type: String, required: true },
    attempts: { type: Number, required: true },
    won: { type: Boolean, required: true },
    date: { type: Date, default: Date.now }
});

export default mongoose.model('Game', GameSchema);