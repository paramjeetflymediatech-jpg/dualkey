import Inquiry from "../models/Inquiry.js";

// Create Inquiry
export const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const newInquiry = await Inquiry.create({ name, email, phone, message });
    res.status(201).json(newInquiry);
  } catch (error) {
    res.status(500).json({ message: "Failed to submit inquiry" });
  }
};

// Get Inquiries (Admin)
export const getInquiries = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Inquiry.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      inquiries: rows,
      pages: Math.ceil(count / limit),
      currentPage: page,
      totalInquiries: count,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Inquiry Status
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByPk(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    inquiry.status = status;
    await inquiry.save();
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
};
