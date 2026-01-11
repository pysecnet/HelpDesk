import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const fixDepartments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const db = mongoose.connection.db;
    const collection = db.collection("departments");

    // List all indexes
    console.log("📋 Current indexes:");
    const indexes = await collection.indexes();
    console.log(indexes);

    // Drop all indexes except _id
    for (const index of indexes) {
      if (index.name !== "_id_") {
        try {
          await collection.dropIndex(index.name);
          console.log(`✅ Dropped index: ${index.name}`);
        } catch (err) {
          console.log(`⚠️ Could not drop ${index.name}:`, err.message);
        }
      }
    }

    // Recreate only the necessary index
    await collection.createIndex({ name: 1 }, { unique: true });
    console.log("✅ Created name index");

    console.log("✅ Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

fixDepartments();
