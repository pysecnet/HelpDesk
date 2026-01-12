// addRollNumber.js
// Script to add roll numbers to student users

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from './models/userModel.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Add roll number to a specific user
const addRollNumberToUser = async (email, rollNumber) => {
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return false;
    }

    if (user.role !== 'student') {
      console.log(`⚠️  User ${email} is not a student (role: ${user.role})`);
      return false;
    }

    user.rollNumber = rollNumber;
    await user.save();
    
    console.log(`✅ Roll number ${rollNumber} added to ${user.fullname} (${email})`);
    return true;
  } catch (error) {
    console.error(`❌ Error updating user ${email}:`, error.message);
    return false;
  }
};

// Add roll numbers to multiple users
const addRollNumbersToMultipleUsers = async (users) => {
  let successCount = 0;
  let failCount = 0;

  for (const userData of users) {
    const success = await addRollNumberToUser(userData.email, userData.rollNumber);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Successfully updated: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
};

// Main function
const main = async () => {
  await connectDB();

  console.log('🚀 Starting roll number assignment...\n');

  // ========================================
  // OPTION 1: Add roll number to single user
  // ========================================
  // Format: 2K26-IT-1 (Year in 2K format, Department Code, Student Number)
  await addRollNumberToUser('saifali@student.com', '2K21-IT-1');

  // ========================================
  // OPTION 2: Add roll numbers to multiple users
  // ========================================
  // Uncomment below to add roll numbers to multiple users at once
  // Format: 2K26-IT-1 (Year in 2K format, Department Code, Student Number)
  /*
  const usersToUpdate = [
    { email: 'saifali@student.com', rollNumber: '2K21-IT-1' },
    { email: 'john@student.com', rollNumber: '2K22-CS-15' },
    { email: 'jane@student.com', rollNumber: '2K21-SE-23' },
    { email: 'mike@student.com', rollNumber: '2K23-EE-7' },
    // Add more users here...
  ];

  await addRollNumbersToMultipleUsers(usersToUpdate);
  */

  // ========================================
  // OPTION 3: Update all students without roll numbers
  // ========================================
  // Uncomment below to auto-generate roll numbers for all students
  // Format: 2K24-IT-1 (Year in 2K format, Department Code, Student Number)
  /*
  const studentsWithoutRollNumber = await User.find({ 
    role: 'student', 
    rollNumber: { $exists: false } 
  });

  console.log(`Found ${studentsWithoutRollNumber.length} students without roll numbers\n`);

  let counter = 1;
  for (const student of studentsWithoutRollNumber) {
    // Auto-generate roll number: 2K24-IT-1, 2K24-IT-2, etc.
    const rollNumber = `2K24-IT-${counter}`;
    student.rollNumber = rollNumber;
    await student.save();
    console.log(`✅ Assigned ${rollNumber} to ${student.fullname} (${student.email})`);
    counter++;
  }
  */

  console.log('\n✅ Script completed!');
  process.exit(0);
};

// Run the script
main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});