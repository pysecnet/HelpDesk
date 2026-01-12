// testDB.js
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config(); // Load .env

const testConnection = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected:", conn.connection.host);
    process.exit(0); // Exit successfully
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Exit with failure
  }
};

testConnection();
