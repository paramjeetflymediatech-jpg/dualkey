import Project from "../models/Project.js";
import ProjectAccess from "../models/ProjectAccess.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      restrictedDetails,
      developer,
      type,
      status,
      totalUnits,
      availableUnits,
      priceRange,
      features,
      amenitiesNearby,
      completionDate,
      associateOnly,
    } = req.body;
    const images = req.files
      ? req.files.map((file) => `/${file.path.replace(/\\/g, "/")}`)
      : [];

    const project = await Project.create({
      title,
      slug: title.toLowerCase().replace(/ /g, "-"),
      description,
      location:
        location && typeof location === "string"
          ? JSON.parse(location)
          : location,
      developer,
      type,
      status,
      totalUnits,
      availableUnits,
      priceRange:
        priceRange && typeof priceRange === "string"
          ? JSON.parse(priceRange)
          : priceRange,
      features:
        features && typeof features === "string"
          ? JSON.parse(features)
          : features,
      amenitiesNearby:
        amenitiesNearby && typeof amenitiesNearby === "string"
          ? JSON.parse(amenitiesNearby)
          : amenitiesNearby,
      completionDate,
      associateOnly: associateOnly === "true" || associateOnly === true,
      category,
      images, // Sequelize handles JSON stringification if configured, but let's be safe
      restrictedDetails: restrictedDetails ? JSON.parse(restrictedDetails) : {},
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Projects
export const getAllProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { category, location } = req.query;
    const where = {};
    if (category) where.category = category;
    if (location) where.location = location;

    const { count, rows } = await Project.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    let hasGlobalAccess = false;
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id || decoded._id;
        const user = await User.findByPk(userId);
        if (user?.role === "admin") hasGlobalAccess = true;
      } catch (err) {
        // Silent fail for token verification in index list
      }
    }

    const sanitizedRows = await Promise.all(
      rows.map(async (project) => {
        let accessStatus = "none";
        if (hasGlobalAccess) {
          accessStatus = "approved";
        } else if (userId) {
          const access = await ProjectAccess.findOne({
            where: { userId, projectId: project.id },
          });
          if (access) accessStatus = access.status;
        }

        const projectData = project.toJSON();
        projectData.hasAccess = accessStatus === "approved";
        projectData.accessStatus = accessStatus;

        if (project.associateOnly && accessStatus !== "approved") {
          delete projectData.priceRange;
          delete projectData.restrictedDetails;
        }
        return projectData;
      }),
    );

    res.json({
      projects: sanitizedRows,
      pages: Math.ceil(count / limit),
      currentPage: page,
      totalProjects: count,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Single Project by Slug
export const getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ where: { slug: req.params.slug } });
    if (!project) return res.status(404).json({ message: "Project not found" });

    let accessStatus = "none";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (user) {
          if (user.role === "admin") {
            accessStatus = "approved";
          } else {
            const access = await ProjectAccess.findOne({
              where: {
                userId: user.id || user._id,
                projectId: project.id || project._id,
              },
            });
            if (access) accessStatus = access.status;
          }
        }
      } catch (err) {
        console.error(
          "Token verification failed in getProjectBySlug:",
          err.message,
        );
      }
    }

    const projectData = project.toJSON ? project.toJSON() : project;
    projectData.hasAccess = accessStatus === "approved";
    projectData.accessStatus = accessStatus;

    // Redact sensitive info ONLY if associateOnly is true AND no access is granted
    if (project.associateOnly && accessStatus !== "approved") {
      delete projectData.priceRange;
      delete projectData.restrictedDetails;
    }

    res.json(projectData);
  } catch (error) {
    console.error("Error in getProjectBySlug:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Single Project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    let accessStatus = "none";
    if (req.user) {
      if (req.user.role === "admin") {
        accessStatus = "approved";
      } else {
        const access = await ProjectAccess.findOne({
          where: {
            userId: req.user.id || req.user._id,
            projectId: project.id || project._id,
          },
        });
        if (access) accessStatus = access.status;
      }
    }

    const projectData = project.toJSON ? project.toJSON() : project;
    projectData.hasAccess = accessStatus === "approved";
    projectData.accessStatus = accessStatus;

    // Redact sensitive info ONLY if associateOnly is true AND no access is granted
    if (project.associateOnly && accessStatus !== "approved") {
      delete projectData.priceRange;
      delete projectData.restrictedDetails;
    }

    res.json(projectData);
  } catch (error) {
    console.error("Error in getProjectById:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
// Update Project
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const {
      title,
      description,
      category,
      location,
      restrictedDetails,
      developer,
      type,
      status,
      totalUnits,
      availableUnits,
      priceRange,
      features,
      amenitiesNearby,
      completionDate,
      associateOnly,
    } = req.body;

    const updates = {
      title,
      description,
      category,
      developer,
      type,
      status,
      totalUnits,
      availableUnits,
      completionDate,
      associateOnly: associateOnly === "true" || associateOnly === true,
    };

    if (location) {
      updates.location =
        typeof location === "string" ? JSON.parse(location) : location;
    }
    if (priceRange) {
      updates.priceRange =
        typeof priceRange === "string" ? JSON.parse(priceRange) : priceRange;
    }
    if (features) {
      updates.features =
        typeof features === "string" ? JSON.parse(features) : features;
    }
    if (amenitiesNearby) {
      updates.amenitiesNearby =
        typeof amenitiesNearby === "string"
          ? JSON.parse(amenitiesNearby)
          : amenitiesNearby;
    }
    if (restrictedDetails) {
      updates.restrictedDetails =
        typeof restrictedDetails === "string"
          ? JSON.parse(restrictedDetails)
          : restrictedDetails;
    }

    const existingImagesList = req.body.images
      ? typeof req.body.images === "string"
        ? JSON.parse(req.body.images)
        : req.body.images
      : project.images || [];

    // Identify and delete removed images
    const removedImages = (project.images || []).filter(
      (img) => !existingImagesList.includes(img),
    );

    const __dirname = path.resolve();
    removedImages.forEach((img) => {
      const filePath = path.join(
        __dirname,
        img.startsWith("/") ? img.substring(1) : img,
      );
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`Failed to delete file: ${filePath}`, err);
        }
      }
    });

    let currentImages = [...existingImagesList];

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(
        (file) => `/${file.path.replace(/\\/g, "/")}`,
      );
      currentImages = [...currentImages, ...newImages];
    }

    updates.images = currentImages;

    await Project.update(updates, { where: { id: req.params.id } });
    if (title) {
      await Project.update(
        { slug: title.toLowerCase().replace(/ /g, "-") },
        { where: { id: req.params.id } },
      );
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Delete associated images from disk
    const __dirname = path.resolve();
    if (project.images && Array.isArray(project.images)) {
      project.images.forEach((img) => {
        const filePath = path.join(
          __dirname,
          img.startsWith("/") ? img.substring(1) : img,
        );
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            console.error(
              `Failed to delete file while deleting project: ${filePath}`,
              err,
            );
          }
        }
      });
    }

    await project.destroy();

    // After destroying the project record, try to remove the project folder if it's empty or exists
    try {
      // Determine folder name from slug or images
      const folderName =
        project.slug ||
        (project.images && project.images[0]
          ? project.images[0].split("/projects/")[1]?.split("/")[0]
          : null);
      if (folderName) {
        const dirPath = path.join(__dirname, "uploads", "projects", folderName);
        if (fs.existsSync(dirPath)) {
          fs.rmSync(dirPath, { recursive: true, force: true });
        }
      }
    } catch (err) {
      console.error("Failed to delete project folder:", err);
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
