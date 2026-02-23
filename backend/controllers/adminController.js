import { Op } from "sequelize";
import Inquiry from "../models/Inquiry.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import { ProjectAccess } from "../models/index.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalProjects = await Project.count();
    const pendingRequests = await ProjectAccess.count({
      where: { status: "pending" },
    });
    const totalInquiries = await Inquiry.count();

    const latestUsers = await User.findAll({
      where: { role: { [Op.ne]: "admin" } },
      limit: 5,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password"] },
    });

    res.json({
      totalUsers,
      totalProjects,
      pendingRequests,
      totalInquiries,
      latestUsers,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
