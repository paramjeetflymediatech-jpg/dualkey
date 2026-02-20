"use client";

import { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import api from "../../../services/api";
import { AuthContext } from "../../../context/AuthContext.js";

export default function ProjectDetails() {
  const { slug } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);

  useEffect(() => {
    api.get(`/projects/${slug}`).then(res => {
      setProject(res.data);
    });
  }, [slug]);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl">{project.title}</h1>

      {project.price ? (
        <h2 className="text-xl">Price: ${project.price}</h2>
      ) : (
        <div>
          <p>Pricing hidden</p>
          <button
            onClick={() =>
              api.post("/access", { projectId: project._id })
            }
            className="bg-blue-500 text-white px-4 py-2"
          >
            Request Access
          </button>
        </div>
      )}
    </div>
  );
}
