import dotenv from "dotenv";
import {
  User as UserSql,
  Project as ProjectSql,
  Post as PostSql,
  Inquiry as InquirySql,
  Gallery as GallerySql,
  ProjectAccess as ProjectAccessSql,
  Brochure as BrochureSql,
} from "./sql/index.js";

import UserMongo from "./mongo/User.js";
import ProjectMongo from "./mongo/Project.js";
import PostMongo from "./mongo/Post.js";
import InquiryMongo from "./mongo/Inquiry.js";
import GalleryMongo from "./mongo/Gallery.js";
import ProjectAccessMongo from "./mongo/ProjectAccess.js";
import BrochureMongo from "./mongo/Brochure.js";

dotenv.config();

const dbType = process.env.DB_TYPE || "mysql";

let User, Project, Post, Inquiry, Gallery, ProjectAccess, Brochure;

import { withSqlCompat } from "./mongo/compat.js";

if (dbType === "mysql") {
  User = UserSql;
  Project = ProjectSql;
  Post = PostSql;
  Inquiry = InquirySql;
  Gallery = GallerySql;
  ProjectAccess = ProjectAccessSql;
  Brochure = BrochureSql;
} else {
  User = withSqlCompat(UserMongo);
  Project = withSqlCompat(ProjectMongo);
  Post = withSqlCompat(PostMongo);
  Inquiry = withSqlCompat(InquiryMongo);
  Gallery = withSqlCompat(GalleryMongo);
  ProjectAccess = withSqlCompat(ProjectAccessMongo);
  Brochure = withSqlCompat(BrochureMongo);
}

export {
  User,
  Project,
  Post,
  Inquiry,
  Gallery,
  ProjectAccess,
  Brochure,
  dbType,
};
