import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    type: {
      type: String,
      enum: ["image", "360"],
      default: "image",
    },
    caption: String,
    category: {
      type: String,
      default: "All",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Gallery", gallerySchema);
