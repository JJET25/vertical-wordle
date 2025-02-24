import mongoose from 'mongoose';

const WordSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        unique: true,
    }
});

export default mongoose.model('Word', WordSchema);