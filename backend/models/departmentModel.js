import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    // Category determines which admin can see/manage this department
    // MAIN = Main Admin (IT departments like CS, IT, SE, EE, ME, CE)
    // DVM = DVM Admin (DVM-related departments)
    // CPD = CPD Admin (CPD-related departments)
    category: {
      type: String,
      enum: ["MAIN", "DVM", "CPD"],
      default: "MAIN",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);
export default Department;
