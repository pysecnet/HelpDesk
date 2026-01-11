// backend/createAdmin.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/userModel.js";

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "cpd@unidesk.com" });
    if (existingAdmin) {
      console.log("⚠️ Admin user already exists!");
      console.log("📧 Email: cpd@unidesk.com");
      console.log("🔑 Password: admin123");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create admin user with all required fields
    const admin = await User.create({
      fullname: "Admin User CPD",
      email: "cpd@unidesk.com",
      password: hashedPassword,
      gender: "Other",
      dob: new Date("1990-01-01"), // ✅ Added required DOB field
                                    phone: "0300-0000000", // ✅ Added required phone field
                                    address: "Admin Office, University Campus",
                                    role: "admin",
    });

    console.log("✅ Admin user created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email:    admin@unidesk.com");
    console.log("🔑 Password: admin123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n⚠️  IMPORTANT: Change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdminUser();
