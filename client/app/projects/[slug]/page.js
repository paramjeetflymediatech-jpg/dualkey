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
    api.get(`/projects/slug/${slug}`).then((res) => {
      setProject(res.data);
    });
  }, [slug]);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl">{project.title}</h1>

      {!project.associateOnly ||
      (project.associateOnly && project.hasAccess) ||
      user?.role === "admin" ? (
        <div className="mt-4">
          {project.price ? (
            <h2 className="text-xl font-bold text-brand-blue">
              Price: ${project.price.toLocaleString()}
            </h2>
          ) : project.priceRange &&
            (project.priceRange.min || project.priceRange.max) ? (
            <h2 className="text-xl font-bold text-brand-blue">
              Price Range:{" "}
              {project.priceRange.min
                ? `$${Number(project.priceRange.min).toLocaleString()}`
                : "N/A"}{" "}
              -{" "}
              {project.priceRange.max
                ? `$${Number(project.priceRange.max).toLocaleString()}`
                : "N/A"}
            </h2>
          ) : (
            <h2 className="text-xl font-bold text-brand-gold text-brand-blue">
              Price: POA
            </h2>
          )}
        </div>
      ) : (
        <div className="mt-6 p-6 border-2 border-dashed border-gray-200 rounded-lg text-center">
          <p className="text-gray-600 mb-4">
            Pricing and restricted details are hidden for this exclusive
            project.
          </p>
          <button
            onClick={() =>
              api
                .post("/access", { projectId: project.id || project._id })
                .then(() => alert("Access requested!"))
            }
            className="bg-brand-blue text-white px-6 py-3 rounded font-bold hover:bg-opacity-90 transition"
          >
            Request Access
          </button>
        </div>
      )}
    </div>
  );
}
