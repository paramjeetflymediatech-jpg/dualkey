"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";
import toast from "react-hot-toast";

export default function AccessRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/access/requests");
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch access requests");
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/access/${id}/approve`);
      toast.success("Access approved");
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve access");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    try {
      // Assuming a delete endpoint exists or using generic delete logic if needed
      // If no delete endpoint, we can just reject it if we add that logic to backend
      // For now, let's use the ID to reject (or we could add a reject route)
      await api.delete(`/access/${id}`);
      toast.success("Request removed");
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove request");
    }
  };

  if (loading) return <div className="p-8">Loading requests...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Access Requests</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No pending access requests found.
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {request.User?.name || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {request.User?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {request.Project?.title || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDelete(request.id)}
                      className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
