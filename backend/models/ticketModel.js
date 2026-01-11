import mongoose from "mongoose";

// Comment Schema
const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      enum: ["student", "admin", "department"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isInternal: {
      type: Boolean,
      default: false, // Internal comments only visible to admin/dept
    },
  },
  { timestamps: true }
);

// Attachment Schema
const attachmentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number, // in bytes
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploadedByName: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// History/Timeline Schema
const historySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "created",
        "status_changed",
        "assigned",
        "priority_changed",
        "comment_added",
        "file_uploaded",
        "updated"
      ],
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    performedByName: {
      type: String,
      required: true,
    },
    performedByRole: {
      type: String,
      enum: ["student", "admin", "department"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    oldValue: {
      type: String,
    },
    newValue: {
      type: String,
    },
  },
  { timestamps: true }
);

// Main Ticket Schema
const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    category: {
      type: String,
      required: true,
      enum: [
        "Technical Issue",
        "Academic Query",
        "Administrative Help",
        "Enrollment",
        "Financial Aid",
        "Library Services",
        "IT Support",
        "Other"
      ],
    },

    description: { type: String, required: true, trim: true },

    // Auto-increment ticket number
    ticketNo: { type: Number, unique: true },

    // ✅ NEW: Priority field
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },

    // Student contact info
    studentEmail: {
      type: String,
      required: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Enter valid email",
      ],
    },
    studentPhone: {
      type: String,
      required: true,
      match: [/^0\d{3}-\d{7}$/, "Enter valid phone number (e.g. 0316-3280715)"],
    },

    // Student identification - Updated to include DVM, CPT, CPD
    studentRollNumber: {
      type: String,
      required: true,
      uppercase: true,
    },
    studentDepartment: {
      type: String,
      uppercase: true,
      enum: ["CS", "IT", "EE", "ME", "CE", "SE", "AI", "DS", "CY", "DVM", "CPT", "CPD"],
    },
    studentYear: {
      type: String,
    },

    // Linked user who created the ticket
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Reference to the user (for backwards compatibility)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Ticket status
    status: {
      type: String,
      enum: ["Open", "Assigned", "In Progress", "Closed"],
      default: "Open",
    },

    // Assigned Department
    assignedDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    // Who handled it (optional)
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    resolvedAt: { type: Date, default: null },

    // ✅ NEW: Comments array
    comments: [commentSchema],

    // ✅ NEW: Attachments array
    attachments: [attachmentSchema],

    // ✅ NEW: History/Timeline array
    history: [historySchema],
  },
  { timestamps: true }
);

// Auto-increment ticket number before saving
ticketSchema.pre("save", async function (next) {
  if (this.isNew && !this.ticketNo) {
    try {
      const lastTicket = await this.constructor
        .findOne()
        .sort({ ticketNo: -1 });
      this.ticketNo = lastTicket ? lastTicket.ticketNo + 1 : 1001;
      
      // Add creation history entry
      if (this.createdBy) {
        const User = mongoose.model("User");
        const creator = await User.findById(this.createdBy);
        if (creator) {
          this.history.push({
            action: "created",
            performedBy: this.createdBy,
            performedByName: creator.fullname,
            performedByRole: creator.role,
            description: `Ticket created by ${creator.fullname}`,
          });
        }
      }
    } catch (err) {
      console.error("Error generating ticket number:", err);
    }
  }
  next();
});

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;