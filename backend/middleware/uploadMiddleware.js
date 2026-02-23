import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let baseFolder = "projects";
    let subFolder = "general";

    // Determine base folder from URL
    if (req.baseUrl.includes("/gallery")) {
      baseFolder = "gallery";
      subFolder = req.body.category
        ? req.body.category.toLowerCase().replace(/ /g, "-")
        : "general";
    } else if (req.baseUrl.includes("/posts")) {
      baseFolder = "blog";
      subFolder = req.body.title
        ? req.body.title.toLowerCase().replace(/ /g, "-")
        : "general";
    } else if (req.baseUrl.includes("/brochures")) {
      baseFolder = "brochures";
      subFolder = req.body.category
        ? req.body.category.toLowerCase().replace(/ /g, "-")
        : "general";
    } else {
      // Default to projects
      if (req.body.title) {
        subFolder = req.body.title.toLowerCase().replace(/ /g, "-");
      } else if (req.params.slug) {
        subFolder = req.params.slug;
      } else if (req.params.id) {
        subFolder = `project-${req.params.id}`;
      }
    }

    const dir = path.join("uploads", baseFolder, subFolder);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png/;
  const isImage = allowedImageTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const isPDF = path.extname(file.originalname).toLowerCase() === ".pdf";

  // Allow images for all contexts
  if (isImage) {
    return cb(null, true);
  }

  // Allow PDF specifically for brochures or if specifically needed
  if (isPDF && req.baseUrl.includes("/brochures")) {
    return cb(null, true);
  }

  cb(
    new Error(
      "Only .jpeg, .jpg, and .png are allowed! (.pdf allowed for brochures)",
    ),
  );
};

export const upload = multer({
  storage,
  fileFilter,
});
