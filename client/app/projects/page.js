"use client";

import { useEffect, useState } from "react";
import { getAllProjects } from "../../services/projectService";
import { image_url } from "../../services/contentService";
import Navbar from "../../components/Navbar";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="grid grid-cols-3 gap-6 p-10 container mx-auto">
        {projects.map((project) => (
          <div key={project._id} className="border p-4 bg-white rounded shadow">
            {project.images && project.images.length > 0 && (
              <img
                src={image_url + project.images[0]}
                alt={project.title}
                className="w-full h-48 object-cover mb-4"
              />
            )}
            <h2 className="text-xl font-bold">{project.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
