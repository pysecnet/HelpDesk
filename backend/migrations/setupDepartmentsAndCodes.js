// migrations/setupDepartmentsAndCodes.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import Department from "../models/departmentModel.js";

dotenv.config();

const departmentsData = [
  {
    name: "Information Technology",
    code: "IT",
    description: "Department of Information Technology",
  },
  {
    name: "Computer Science",
    code: "CS",
    description: "Department of Computer Science",
  },
  {
    name: "Software Engineering",
    code: "SE",
    description: "Department of Software Engineering",
  },
  {
    name: "Electrical Engineering",
    code: "EE",
    description: "Department of Electrical Engineering",
  },
  {
    name: "Mechanical Engineering",
    code: "ME",
    description: "Department of Mechanical Engineering",
  },
  {
    name: "Civil Engineering",
    code: "CE",
    description: "Department of Civil Engineering",
  },
  {
    name: "Business Administration",
    code: "BBA",
    description: "Department of Business Administration",
  },
  {
    name: "Mathematics",
    code: "MATH",
    description: "Department of Mathematics",
  },
  {
    name: "Physics",
    code: "PHY",
    description: "Department of Physics",
  },
  {
    name: "Chemistry",
    code: "CHEM",
    description: "Department of Chemistry",
  },
];

const setupDepartments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    console.log("\n🔄 Setting up departments...\n");

    for (const deptData of departmentsData) {
      // Check if department exists by name or code
      let department = await Department.findOne({
        $or: [{ name: deptData.name }, { code: deptData.code }],
      });

      if (department) {
        // Update existing department with code if missing
        if (!department.code) {
          department.code = deptData.code;
          department.description = deptData.description;
          await department.save();
          console.log(`✅ Updated: ${deptData.name} (${deptData.code})`);
        } else {
          console.log(`⏭️  Exists: ${deptData.name} (${deptData.code})`);
        }
      } else {
        // Create new department
        department = await Department.create(deptData);
        console.log(`✅ Created: ${deptData.name} (${deptData.code})`);
      }
    }

    console.log("\n✅ Department setup complete!");

    // Display all departments
    const allDepartments = await Department.find().sort({ name: 1 });
    console.log("\n📋 All Departments:");
    console.log("━".repeat(60));
    allDepartments.forEach((dept) => {
      console.log(`${dept.code.padEnd(8)} | ${dept.name}`);
    });
    console.log("━".repeat(60));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

setupDepartments();
