// setupDVMandCPD.js
// Run: node setupDVMandCPD.js
// Creates DVM and CPD departments + admin users (role: "admin")

import mongoose from "mongoose";
import dotenv from "dotenv";
import Department from "./models/departmentModel.js";
import User from "./models/userModel.js";
import bcrypt from "bcryptjs";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/unidesk";

async function setup() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // ============ Create DVM Department ============
    let dvmDept = await Department.findOne({ name: "DVM" });
    if (!dvmDept) {
      dvmDept = await Department.create({ name: "DVM" });
      console.log("✅ Created DVM Department");
    } else {
      console.log("ℹ️  DVM Department already exists");
    }

    // ============ Create CPD Department ============
    let cpdDept = await Department.findOne({ name: "CPD" });
    if (!cpdDept) {
      cpdDept = await Department.create({ name: "CPD" });
      console.log("✅ Created CPD Department");
    } else {
      console.log("ℹ️  CPD Department already exists");
    }

    // ============ Delete existing DVM/CPD admins if any (to recreate cleanly) ============
    await User.deleteOne({ email: "dvm@unidesk.com" });
    await User.deleteOne({ email: "cpd@unidesk.com" });
    console.log("🗑️  Cleaned up any existing DVM/CPD admin accounts");

    // ============ Create DVM Admin (role: admin) ============
    const dvmHashedPassword = await bcrypt.hash("dvm123", 10);
    const dvmAdmin = await User.create({
      fullname: "DVM Admin",
      email: "dvm@unidesk.com",
      password: dvmHashedPassword,
      role: "admin",
      departmentId: dvmDept._id,
    });
    console.log("✅ Created DVM Admin (role: admin)");

    // ============ Create CPD Admin (role: admin) ============
    const cpdHashedPassword = await bcrypt.hash("cpd123", 10);
    const cpdAdmin = await User.create({
      fullname: "CPD Admin",
      email: "cpd@unidesk.com",
      password: cpdHashedPassword,
      role: "admin",
      departmentId: cpdDept._id,
    });
    console.log("✅ Created CPD Admin (role: admin)");

    console.log("\n========================================");
    console.log("✅ Setup Complete!");
    console.log("========================================");
    console.log("\nDVM Admin:");
    console.log("  Email: dvm@unidesk.com");
    console.log("  Password: dvm123");
    console.log("  Role: admin (sees AdminDashboard)");
    console.log("  Sees tickets from: DVM students only");
    console.log("\nCPD Admin:");
    console.log("  Email: cpd@unidesk.com");
    console.log("  Password: cpd123");
    console.log("  Role: admin (sees AdminDashboard)");
    console.log("  Sees tickets from: CPT and CPD students");
    console.log("\nMain Admin (existing):");
    console.log("  Sees: ALL tickets from ALL departments");
    console.log("========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    console.error(error);
    process.exit(1);
  }
}

setup();