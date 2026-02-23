import { Brochure } from "../models/index.js";
import fs from "fs";
import path from "path";

// Get all brochures
export const getAllBrochures = async (req, res) => {
  try {
    const brochures = await Brochure.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(brochures);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Create Brochure (Admin)
export const createBrochure = async (req, res) => {
  try {
    const { title, category } = req.body;

    // Check if main file exists in req.files
    const file = req.files?.["file"]?.[0];
    const thumbnail = req.files?.["thumbnail"]?.[0];

    if (!file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }

    const normalizedFilePath = file.path.replace(/\\/g, "/");
    const normalizedThumbnailPath = thumbnail
      ? thumbnail.path.replace(/\\/g, "/")
      : null;

    const brochure = await Brochure.create({
      title,
      category: category || "General",
      file: normalizedFilePath,
      thumbnail: normalizedThumbnailPath,
    });

    res.status(201).json(brochure);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create brochure" });
  }
};

// Delete Brochure (Admin)
export const deleteBrochure = async (req, res) => {
  try {
    const brochure = await Brochure.findByPk(req.params.id);
    if (!brochure) {
      return res.status(404).json({ message: "Brochure not found" });
    }

    // Physical file deletion (PDF)
    const filePath = path.resolve(brochure.file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Physical file deletion (Thumbnail)
    if (brochure.thumbnail) {
      const thumbPath = path.resolve(brochure.thumbnail);
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath);
      }
    }

    await brochure.destroy();
    res.json({ message: "Brochure deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
