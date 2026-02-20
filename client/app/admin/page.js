"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    pendingRequests: 0,
    totalInquiries: 0,
  });

  useEffect(() => {
    // Fetch stats
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        console.log(res.data);
        // Assuming the backend endpoint returns these structure
        // If not, we might need to update the backend admin controller to include inquiries count
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-brand-blue">
          <h2 className="text-gray-500 text-sm font-medium uppercase">
            Total Users
          </h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {stats.totalUsers}
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-brand-gold">
          <h2 className="text-gray-500 text-sm font-medium uppercase">
            Total Projects
          </h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {stats.totalProjects}
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h2 className="text-gray-500 text-sm font-medium uppercase">
            Pending Access Requests
          </h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {stats.pendingRequests}
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-gray-500 text-sm font-medium uppercase">
            Inquiries
          </h2>
          {/* If backend doesn't return this yet, it might be undefined */}
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {stats.totalInquiries || "-"}
          </p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <a
            href="/admin/projects"
            className="bg-brand-blue text-white px-6 py-3 rounded hover:bg-opacity-90 font-medium"
          >
            Manage Projects
          </a>
          <a
            href="/admin/inquiries"
            className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-50 font-medium"
          >
            View Inquiries
          </a>
        </div>
      </div>
    </div>
  );
}
