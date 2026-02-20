import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    description: String,
    location: {
      address: String,
      city: String,
      state: String,
      country: String,
      postcode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    developer: String,
    type: String,
    status: String,
    totalUnits: Number,
    availableUnits: Number,
    priceRange: {
      min: Number,
      max: Number,
      currency: String,
    },
    features: [String],
    amenitiesNearby: [String],
    completionDate: Date,
    associateOnly: {
      type: Boolean,
      default: false,
    },
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
