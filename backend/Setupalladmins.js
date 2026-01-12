// setupAllAdmins.js
// Run: node setupAllAdmins.js
// Creates all admin users and their respective departments

import mongoose from "mongoose";
import dotenv from "dotenv";
import Department from "./models/departmentModel.js";
import User from "./models/userModel.js";
import bcrypt from "bcryptjs";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/unidesk";

// ============ DEPARTMENT CONFIGURATIONS ============

// DVM Admin departments
const DVM_DEPARTMENTS = [
  { name: "Veterinary Medicine", description: "General veterinary medicine and surgery" },
  { name: "Animal Sciences", description: "Animal nutrition, breeding, genetics" },
  { name: "Poultry Science", description: "Poultry production and health" },
  { name: "Livestock Management", description: "Farm animal management" },
  { name: "Clinical Sciences", description: "Veterinary clinics and hospitals" },
  { name: "Pathology Lab", description: "Disease diagnosis and lab services" },
  { name: "DVM Examination", description: "DVM exam schedules and results" },
  { name: "DVM Administration", description: "DVM administrative matters" },
];

// CPD Admin departments (Career & Professional Development + CPT)
const CPD_DEPARTMENTS = [
  { name: "Career Counseling", description: "Career guidance and counseling services" },
  { name: "Internship Cell", description: "Internship placements and coordination" },
  { name: "Job Placement", description: "Job opportunities and recruitment" },
  { name: "Professional Training", description: "Workshops, certifications, skill development" },
  { name: "Industry Liaison", description: "Corporate relations and partnerships" },
  { name: "Alumni Relations", description: "Alumni network and events" },
  { name: "Entrepreneurship Cell", description: "Startup support and incubation" },
  { name: "CPT Programs", description: "Curricular Practical Training programs" },
];

async function setup() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // ============ STEP 1: Fix Department Index ============
    console.log("🔧 Fixing department indexes...\n");
    
    try {
      // Drop the old unique index on name only (if exists)
      await mongoose.connection.collection('departments').dropIndex('name_1');
      console.log("   ✅ Dropped old 'name_1' index");
    } catch (e) {
      console.log("   ℹ️  No 'name_1' index to drop (already fixed or doesn't exist)");
    }

    // ============ STEP 2: Update Existing Departments to MAIN category ============
    console.log("\n📁 Updating existing departments to MAIN category...");
    
    const updateResult = await Department.updateMany(
      { category: { $exists: false } },
      { $set: { category: "MAIN", isActive: true } }
    );
    console.log(`   ✅ Updated ${updateResult.modifiedCount} existing departments to MAIN category`);

    // Also update departments that have no category field
    await Department.updateMany(
      { category: null },
      { $set: { category: "MAIN" } }
    );

    // ============ STEP 3: Create DVM Reference Department ============
    console.log("\n🐄 Setting up DVM...");
    
    let dvmRefDept = await Department.findOne({ name: "DVM" });
    if (!dvmRefDept) {
      dvmRefDept = await Department.create({ 
        name: "DVM", 
        description: "DVM Admin Reference Department",
        category: "DVM",
        isActive: true
      });
      console.log("   ✅ Created DVM reference department");
    } else {
      dvmRefDept.category = "DVM";
      await dvmRefDept.save();
      console.log("   ℹ️  DVM department exists, updated category");
    }

    // Create DVM sub-departments
    for (const dept of DVM_DEPARTMENTS) {
      const existing = await Department.findOne({ name: dept.name, category: "DVM" });
      if (!existing) {
        await Department.create({ ...dept, category: "DVM", isActive: true });
        console.log(`   ✅ Created: ${dept.name}`);
      } else {
        console.log(`   ℹ️  Exists: ${dept.name}`);
      }
    }

    // ============ STEP 4: Create CPD Reference Department ============
    console.log("\n💼 Setting up CPD...");
    
    let cpdRefDept = await Department.findOne({ name: "CPD" });
    if (!cpdRefDept) {
      cpdRefDept = await Department.create({ 
        name: "CPD", 
        description: "CPD Admin Reference Department",
        category: "CPD",
        isActive: true
      });
      console.log("   ✅ Created CPD reference department");
    } else {
      cpdRefDept.category = "CPD";
      await cpdRefDept.save();
      console.log("   ℹ️  CPD department exists, updated category");
    }

    // Create CPD sub-departments
    for (const dept of CPD_DEPARTMENTS) {
      const existing = await Department.findOne({ name: dept.name, category: "CPD" });
      if (!existing) {
        await Department.create({ ...dept, category: "CPD", isActive: true });
        console.log(`   ✅ Created: ${dept.name}`);
      } else {
        console.log(`   ℹ️  Exists: ${dept.name}`);
      }
    }

    // ============ STEP 5: Create Admin Users ============
    console.log("\n👤 Setting up admin users...\n");

    // Delete existing DVM/CPD admins to recreate
    await User.deleteOne({ email: "dvm@unidesk.com" });
    await User.deleteOne({ email: "cpd@unidesk.com" });

    // Create DVM Admin
    const dvmHashedPassword = await bcrypt.hash("dvm123", 10);
    await User.create({
      fullname: "DVM Admin",
      email: "dvm@unidesk.com",
      password: dvmHashedPassword,
      role: "admin",
      departmentId: dvmRefDept._id,
    });
    console.log("✅ Created DVM Admin");
    console.log("   Email: dvm@unidesk.com");
    console.log("   Password: dvm123");

    // Create CPD Admin
    const cpdHashedPassword = await bcrypt.hash("cpd123", 10);
    await User.create({
      fullname: "CPD Admin",
      email: "cpd@unidesk.com",
      password: cpdHashedPassword,
      role: "admin",
      departmentId: cpdRefDept._id,
    });
    console.log("\n✅ Created CPD Admin");
    console.log("   Email: cpd@unidesk.com");
    console.log("   Password: cpd123");

    // ============ SUMMARY ============
    const mainCount = await Department.countDocuments({ category: "MAIN", isActive: true });
    const dvmCount = await Department.countDocuments({ category: "DVM", isActive: true });
    const cpdCount = await Department.countDocuments({ category: "CPD", isActive: true });

    console.log("\n" + "=".repeat(60));
    console.log("✅ SETUP COMPLETE!");
    console.log("=".repeat(60));
    console.log("\n📊 Department Summary:");
    console.log(`   MAIN Admin: ${mainCount} departments`);
    console.log(`   DVM Admin:  ${dvmCount} departments`);
    console.log(`   CPD Admin:  ${cpdCount} departments`);
    
    console.log("\n👤 Admin Accounts:");
    console.log("┌─────────────┬─────────────────────┬──────────┬─────────────────────┐");
    console.log("│ Admin       │ Email               │ Password │ Manages             │");
    console.log("├─────────────┼─────────────────────┼──────────┼─────────────────────┤");
    console.log("│ Main Admin  │ (your existing)     │ (yours)  │ CS,IT,SE,EE,ME,CE   │");
    console.log("│ DVM Admin   │ dvm@unidesk.com     │ dvm123   │ DVM students        │");
    console.log("│ CPD Admin   │ cpd@unidesk.com     │ cpd123   │ CPT & CPD students  │");
    console.log("└─────────────┴─────────────────────┴──────────┴─────────────────────┘");
    
    console.log("\n📝 Student Roll Number → Admin Routing:");
    console.log("   2K24-CS-1, 2K24-IT-1, etc.  → Main Admin");
    console.log("   2K24-DVM-1                  → DVM Admin");
    console.log("   2K24-CPT-1, 2K24-CPD-1      → CPD Admin");
    console.log("\n" + "=".repeat(60) + "\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    console.error(error);
    process.exit(1);
  }
}

setup();
