import Project from "../models/Project.js";
import ProjectAccess from "../models/ProjectAccess.js";

export const createProject = async (req, res) => {
  const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
  try {
    const { title, description, price, category, location, restrictedDetails } =
      req.body;
    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const project = await Project.create({
      title,
      slug: title.toLowerCase().replace(/ /g, "-"),
      description,
      location,
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

    res.json({
      projects: rows,
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
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Single Project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
