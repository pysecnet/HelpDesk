import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    
    // Roll Number - Required for students only
    rollNumber: {
      type: String,
      trim: true,
      uppercase: true,
      validate: {
        validator: function(v) {
          // Only validate if user is a student
          if (this.role === 'student') {
            // Format: 2k26-IT-1 or 2K26-CS-1 (includes DVM, CPT, CPD)
            return /^2k\d{2}-(CS|IT|EE|ME|CE|SE|DVM|CPT|CPD)-\d+$/i.test(v);
          }
          return true;
        },
        message: 'Invalid roll number format. Use format like: 2K26-IT-1, 2K26-DVM-1, 2K26-CPD-1'
      }
    },
    
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: function() {
        return this.role === 'student';
      },
    },
    
    dob: { 
      type: Date,
      required: function() {
        return this.role === 'student';
      }
    },
    
    address: { 
      type: String, 
      trim: true,
      required: function() {
        return this.role === 'student';
      }
    },
    
    phone: {
      type: String,
      required: function() {
        return this.role === 'student';
      },
      validate: {
        validator: function(v) {
          // Only validate phone format if provided
          if (!v) return true;
          return /^0\d{3}-\d{7}$/.test(v);
        },
        message: "Enter valid phone number (e.g. 0316-3280715)"
      }
    },
    
    role: {
      type: String,
      enum: ["student", "admin", "department"],
      default: "student",
    },
    
    // Link department users to Department collection
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
  },
  { timestamps: true }
);

// Add unique index for roll number
userSchema.index({ rollNumber: 1 }, { unique: true, sparse: true });

const User = mongoose.model("User", userSchema);
export default User;