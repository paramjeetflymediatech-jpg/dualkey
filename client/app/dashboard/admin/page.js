"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then(res => {
      setStats(res.data);
    });
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl">Admin Dashboard</h1>
      <p>Total Users: {stats.totalUsers}</p>
      <p>Total Projects: {stats.totalProjects}</p>
      <p>Pending Requests: {stats.pendingRequests}</p>
    </div>
  );
}
