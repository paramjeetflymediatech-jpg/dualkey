"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getProjectById,
  deleteProject,
} from "../../../../services/projectService";

export default function ProjectDetails({ params }) {
  const [project, setProject] = useState(null);
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id]);

  const fetchProject = async (projectId) => {
    try {
      const data = await getProjectById(projectId);
      console.log(data);
      setProject(data);
    } catch (error) {
      console.error("Failed to fetch project");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        router.push("/admin/projects");
      } catch (error) {
        console.error("Failed to delete project");
        alert("Failed to delete project");
      }
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <div className="space-x-2">
          <Link
            href={`/admin/projects/edit/${project.id || project._id}`}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
          <Link
            href="/admin/projects"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to List
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Details</h2>
          <p>
            <strong>Category:</strong> {project.category}
          </p>
          <p>
            <strong>Type:</strong> {project.type}
          </p>
          <p>
            <strong>Status:</strong> {project.status}
          </p>
          <p>
            <strong>Price:</strong> $
            {project.price ? project.price.toLocaleString() : "POA"}
          </p>
          <p>
            <strong>Developer:</strong> {project.developer}
          </p>
          <p>
            <strong>Completion Date:</strong> {project.completionDate}
          </p>
          <p>
            <strong>Total Units:</strong> {project.totalUnits}
          </p>
          <p>
            <strong>Available Units:</strong> {project.availableUnits}
          </p>
          <p>
            <strong>Associate Only:</strong>{" "}
            {project.associateOnly ? "Yes" : "No"}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Location</h2>
          {project.location && typeof project.location === "object" ? (
            <>
              <p>{project.location.address}</p>
              <p>
                {project.location.city}, {project.location.state}{" "}
                {project.location.postcode}
              </p>
              <p>{project.location.country}</p>
            </>
          ) : (
            <p>{project.location}</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <div className="prose max-w-none">{project.description}</div>
      </div>

      {project.images && project.images.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Images</h2>
          <div className="grid grid-cols-3 gap-4">
            {project.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Project Image ${index + 1}`}
                className="w-full h-32 object-cover rounded"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
