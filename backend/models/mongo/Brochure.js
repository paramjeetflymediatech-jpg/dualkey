import mongoose from "mongoose";

const brochureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    category: {
      type: String,
      default: "General",
    },
  },
  { timestamps: true },
);

const Brochure = mongoose.model("Brochure", brochureSchema);
export default Brochure;
