"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import {
  getAllProjects,
  requestAccess,
  getAccessRequests,
  approveAccess,
} from "../../services/projectService";
import { getCurrentUser } from "../../services/authService";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);
    fetchProjects();

    if (currentUser.role === "admin") {
      fetchRequests();
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getAllProjects();
      console.log(data);
      setProjects(data.projects);
    } catch (error) {
      console.error("Failed to fetch projects");
    }
  };

  const fetchRequests = async () => {
    try {
      const data = await getAccessRequests();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests");
    }
  };

  const handleRequestAccess = async (projectId) => {
    try {
      await requestAccess(projectId);
      alert("Access requested successfully");
    } catch (error) {
      alert("Failed to request access");
    }
  };

  const handleApproveAccess = async (requestId) => {
    try {
      await approveAccess(requestId);
      alert("Access approved");
      fetchRequests(); // Refresh requests
    } catch (error) {
      alert("Failed to approve access");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {user.role === "admin" && requests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Pending Access Requests
            </h2>
            <div className="bg-white p-4 rounded-lg shadow">
              {requests.map((req) => (
                <div
                  key={req._id}
                  className="flex justify-between items-center border-b py-2 last:border-0"
                >
                  <div>
                    <p>
                      <strong>User:</strong> {req.user.name} ({req.user.email})
                    </p>
                    <p>
                      <strong>Project:</strong> {req.project.title}
                    </p>
                  </div>
                  <button
                    onClick={() => handleApproveAccess(req._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-4">Available Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-2">{project.description}</p>
              <p className="font-semibold">
                Price: {project.price ? `$${project.price}` : "Hidden"}
              </p>

              {user.role === "associate" && !project.price && (
                <button
                  onClick={() => handleRequestAccess(project._id)}
                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Request Access
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
