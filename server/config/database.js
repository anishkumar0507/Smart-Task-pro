import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Please make sure MongoDB is running or check your MONGODB_URI in .env file');
    // Don't exit - let the server start, but database operations will fail
    // Uncomment the line below if you want the server to exit on DB connection failure
    // process.exit(1);
  }
};

export default connectDB;

