import Post from "../models/Post.js";
import fs from "fs";
import path from "path";

// Create Post (Admin)
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? `/${req.file.path.replace(/\\/g, "/")}` : null;

    // Assuming req.user.id exists from auth middleware
    const post = await Post.create({
      title,
      content,
      image,
      authorId: req.user.id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Posts (with pagination)
export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Post.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      posts: rows,
      pages: Math.ceil(count / limit),
      currentPage: page,
      totalPosts: count,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Single Post
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Post (Admin)
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const { title, content } = req.body;
    let image = post.image;

    if (req.file) {
      // Delete old image if exists
      if (post.image) {
        const __dirname = path.resolve();
        const oldPath = path.join(
          __dirname,
          post.image.startsWith("/") ? post.image.substring(1) : post.image,
        );
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (err) {
            console.error("Failed to delete old post image:", err);
          }
        }
      }
      image = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    await post.update({ title, content, image });
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Post (Admin)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Physical cleanup
    if (post.image) {
      const __dirname = path.resolve();
      const filePath = path.join(
        __dirname,
        post.image.startsWith("/") ? post.image.substring(1) : post.image,
      );
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          // Try to remove project folder if it's empty
          const dirPath = path.dirname(filePath);
          if (
            dirPath.includes("blog") &&
            fs.readdirSync(dirPath).length === 0
          ) {
            fs.rmdirSync(dirPath);
          }
        } catch (err) {
          console.error("Failed to delete post file or folder:", err);
        }
      }
    }

    await post.destroy();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
