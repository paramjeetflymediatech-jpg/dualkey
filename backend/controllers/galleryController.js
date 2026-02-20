import Gallery from "../models/Gallery.js";
import fs from "fs";
import path from "path";

// Get all gallery items
export const getGalleryItems = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12; // Default 12 for grid
    const offset = (page - 1) * limit;

    const { count, rows } = await Gallery.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      gallery: rows,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Add a gallery item (image or 360)
export const createGalleryItem = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  const { type, caption, category } = req.body;

  try {
    const galleryItem = await Gallery.create({
      image: `/uploads/${req.file.filename}`,
      type: type || "image",
      caption,
      category: category || "All",
    });

    res.status(201).json(galleryItem);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a gallery item
export const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Attempt to delete file from uploads
    const filePath = path.join(path.resolve(), item.image);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await item.destroy();
    res.json({ message: "Item removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
