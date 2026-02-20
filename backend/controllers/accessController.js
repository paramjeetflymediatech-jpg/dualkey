import { ProjectAccess, User, Project } from "../models/index.js";

export const requestAccess = async (req, res) => {
  try {
    const { projectId } = req.body;
    const userId = req.user.id;

    const existingRequest = await ProjectAccess.findOne({
      where: { userId, projectId },
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Access already requested" });
    }

    const accessRequest = await ProjectAccess.create({
      userId,
      projectId,
      status: "pending",
    });

    res.status(201).json(accessRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAccessRequests = async (req, res) => {
  try {
    const requests = await ProjectAccess.findAll({
      where: { status: "pending" },
      include: [
        { model: User, attributes: ["name", "email"] },
        { model: Project, attributes: ["title"] },
      ],
    });
    console.log(requests);

    // Transform logic if needed, or return as is (Sequelize structure)
    // Frontend expects array of requests
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const approveAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ProjectAccess.findByPk(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "approved";
    await request.save();

    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
