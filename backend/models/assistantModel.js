import mongoose from "mongoose";

const assistantSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true, unique: true },
    answer: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] }, // optional for categorization
  },
  { timestamps: true }
);

// Text index for efficient searching
assistantSchema.index({ question: "text", answer: "text" });

const AssistantQA = mongoose.model("AssistantQA", assistantSchema);
export default AssistantQA;
