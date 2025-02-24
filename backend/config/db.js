import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            console.error("Error: MONGO_URI environment variable is not defined.");
            process.exit(1);
        }

        console.log("Connecting to MongoDB...");
        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};