import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Project = sequelize.define(
  "Project",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // 🔥 New structured location
    location: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        address: "",
        city: "",
        state: "",
        country: "",
        postcode: "",
        coordinates: {
          lat: null,
          lng: null,
        },
      },
    },

    developer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalUnits: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    availableUnits: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    priceRange: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        min: null,
        max: null,
        currency: "AUD",
      },
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    amenitiesNearby: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    completionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    associateOnly: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM("Dual Key", "Terrace", "Land"),
      defaultValue: "Dual Key",
    },
    // Storing images as JSON array since MySQL 5.7+ supports JSON.
    // Fallback: If older MySQL, stringify/parse manually or use a separate table.
    // Assuming modern MySQL for now.
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    // Storing restricted details as JSON
    restrictedDetails: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
  },
  {
    timestamps: true,
  },
);

export default Project;
