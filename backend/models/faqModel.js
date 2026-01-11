import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true, unique: true },
    answer: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Text index for search
faqSchema.index({ question: "text", answer: "text" });

const FAQ = mongoose.model("FAQ", faqSchema);
export default FAQ;
