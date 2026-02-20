import User from "./User.js";
import Project from "./Project.js";
import Post from "./Post.js";
import Inquiry from "./Inquiry.js";
import Gallery from "./Gallery.js";
import ProjectAccess from "./ProjectAccess.js";

// Associations
User.hasMany(Post, { foreignKey: "authorId" });
Post.belongsTo(User, { foreignKey: "authorId" });

User.hasMany(ProjectAccess, { foreignKey: "userId" });
ProjectAccess.belongsTo(User, { foreignKey: "userId" });

Project.hasMany(ProjectAccess, { foreignKey: "projectId" });
ProjectAccess.belongsTo(Project, { foreignKey: "projectId" });



export { User, Project, Post, Inquiry, Gallery, ProjectAccess };
