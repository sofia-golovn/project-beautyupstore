import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.set('autoIndex', false); 
        
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Error connecting to MONGODB", error.message);
        process.exit(1);
    }
};