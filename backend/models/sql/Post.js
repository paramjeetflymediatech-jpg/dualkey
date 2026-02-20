import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import User from "./User.js";

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Foreign key 'authorId' will be added by association in index.js
  },
  {
    timestamps: true,
  },
);

export default Post;
