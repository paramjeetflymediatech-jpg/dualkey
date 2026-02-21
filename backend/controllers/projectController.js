import Project from "../models/Project.js";
import ProjectAccess from "../models/ProjectAccess.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const createProject = async (req, res) => {
  const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
  try {
    const {
      title,
      description,
      price,
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
      ? req.files.map((file) => `/uploads/${file.filename}`)
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
      price,
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
        userId = decoded.id;
        const user = await User.findByPk(userId);
        if (user?.role === "admin") hasGlobalAccess = true;
      } catch (err) {}
    }

    const sanitizedRows = await Promise.all(
      rows.map(async (project) => {
        let projectHasAccess = hasGlobalAccess;
        if (!projectHasAccess && userId) {
          const access = await ProjectAccess.findOne({
            where: { userId, projectId: project.id, status: "approved" },
          });
          if (access) projectHasAccess = true;
        }

        const projectData = project.toJSON();
        projectData.hasAccess = projectHasAccess;

        if (project.associateOnly && !projectHasAccess) {
          delete projectData.price;
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

    let hasAccess = false;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (user) {
          if (user.role === "admin") {
            hasAccess = true;
          } else {
            const access = await ProjectAccess.findOne({
              where: {
                userId: user.id || user._id,
                projectId: project.id || project._id,
                status: "approved",
              },
            });
            if (access) hasAccess = true;
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
    projectData.hasAccess = hasAccess;

    // Redact sensitive info ONLY if associateOnly is true AND no access is granted
    if (project.associateOnly && !hasAccess) {
      delete projectData.price;
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

    let hasAccess = false;
    if (req.user) {
      if (req.user.role === "admin") {
        hasAccess = true;
      } else {
        const access = await ProjectAccess.findOne({
          where: {
            userId: req.user.id || req.user._id,
            projectId: project.id || project._id,
            status: "approved",
          },
        });
        if (access) hasAccess = true;
      }
    }

    const projectData = project.toJSON ? project.toJSON() : project;
    projectData.hasAccess = hasAccess;

    // Redact sensitive info ONLY if associateOnly is true AND no access is granted
    if (project.associateOnly && !hasAccess) {
      delete projectData.price;
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
      price,
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
      price,
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

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      // Append new images to existing ones or replace? Usually replace or append.
      // For now, let's append.
      const existingImages = project.images || [];
      updates.images = [...existingImages, ...newImages];
    }

    // Also support removing images if passed in body?
    // For simplicity, let's stick to appending new ones for now,
    // or replacing if the user sends a specific flag.
    // A more complex image management might be needed later.

    await project.update(updates);
    if (title) {
      await project.update({ slug: title.toLowerCase().replace(/ /g, "-") });
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

    await project.destroy();
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
