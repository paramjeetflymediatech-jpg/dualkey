import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Gallery = sequelize.define(
  "Gallery",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("image", "360"),
      defaultValue: "image",
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "All",
    },
  },
  {
    timestamps: true,
  },
);

export default Gallery;
