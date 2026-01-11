import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dropOldIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const db = mongoose.connection.db;
    const collection = db.collection("departments");

    // Get all indexes
    const indexes = await collection.indexes();
    console.log("Current indexes:", indexes);

    // Drop the code_1 index if it exists
    try {
      await collection.dropIndex("code_1");
      console.log("✅ Dropped code_1 index");
    } catch (error) {
      if (error.code === 27) {
        console.log("⚠️ code_1 index doesn't exist (already dropped)");
      } else {
        throw error;
      }
    }

    console.log("✅ Migration completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

dropOldIndexes();
