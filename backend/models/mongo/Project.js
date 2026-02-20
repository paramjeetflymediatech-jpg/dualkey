import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    description: String,
    location: String,
    price: Number,
    category: {
      type: String,
      enum: ["Dual Key", "Terrace", "Land"],
      default: "Dual Key",
    },
    images: [String],
    restrictedDetails: {
      financialBreakdown: String,
      documents: [String],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Project", projectSchema);
