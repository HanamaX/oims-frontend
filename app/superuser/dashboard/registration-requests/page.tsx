"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface RegistrationRequest {
  id: number;
  orphanageName: string;
  adminName: string;
  branch: string;
  status: "Pending" | "Approved" | "Declined";
  submittedAt: string;
  pdf: string;
}

const demoRequests: RegistrationRequest[] = [
  {
    id: 1,
    orphanageName: "Hope Center",
    adminName: "Fatima Yusuf",
    branch: "Central Branch",
    status: "Pending",
    submittedAt: "2025-06-10",
    pdf: "registration1.pdf",
  },
  {
    id: 2,
    orphanageName: "Sunrise Home",
    adminName: "Ali Mwinyi",
    branch: "East Branch",
    status: "Pending",
    submittedAt: "2025-06-11",
    pdf: "registration2.pdf",
  },
  {
    id: 3,
    orphanageName: "Bright Future",
    adminName: "Maryam Said",
    branch: "West Branch",
    status: "Approved",
    submittedAt: "2025-06-12",
    pdf: "registration3.pdf",
  },
  {
    id: 4,
    orphanageName: "Unity Shelter",
    adminName: "John Doe",
    branch: "North Branch",
    status: "Declined",
    submittedAt: "2025-06-13",
    pdf: "registration4.pdf",
  },
  {
    id: 5,
    orphanageName: "Peace Haven",
    adminName: "Aisha Juma",
    branch: "South Branch",
    status: "Pending",
    submittedAt: "2025-06-14",
    pdf: "registration5.pdf",
  },
  {
    id: 6,
    orphanageName: "Mercy House",
    adminName: "Salim Omar",
    branch: "Central Branch",
    status: "Pending",
    submittedAt: "2025-06-15",
    pdf: "registration6.pdf",
  },
  {
    id: 7,
    orphanageName: "New Beginnings",
    adminName: "Zainab Ali",
    branch: "East Branch",
    status: "Pending",
    submittedAt: "2025-06-16",
    pdf: "registration7.pdf",
  },
];

const statusOptions = ["All", "Pending", "Approved", "Declined"];

export default function RegistrationRequestsPage() {
  const [requests, setRequests] = React.useState<RegistrationRequest[]>(demoRequests);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("Pending");

const handleApprove = (id: number) => {
    setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: "Approved" } : req))
    );
};
  const handleDecline = (id: number) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "Declined" } : req))
    );
  };

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = status === "All" || req.status === status;
    const matchesSearch =
      req.orphanageName.toLowerCase().includes(search.toLowerCase()) ||
      req.adminName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Orphanage Registration Requests</h1>
      <p className="mb-6 text-gray-600">Review and manage new orphanage registration requests.</p>
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search orphanages or admins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 min-w-[120px] focus:outline-none"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-5">
        {filteredRequests.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No registration requests found.</div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-5 flex flex-col md:flex-row md:items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <span className="font-semibold text-lg mr-2">{req.orphanageName}</span>
                  <span className={`text-xs px-2 py-1 rounded bg-gray-100 border ml-0 sm:ml-2 ${
                    req.status === "Pending"
                      ? "border-yellow-400 text-yellow-700"
                      : req.status === "Approved"
                      ? "border-green-400 text-green-700"
                      : "border-red-400 text-red-700"
                  }`}>
                    {req.status}
                  </span>
                </div>
                <div className="text-gray-700 text-sm mb-1">
                  <span className="font-medium">Admin:</span> {req.adminName} &nbsp;|&nbsp;
                  <span className="font-medium">Branch:</span> {req.branch}
                </div>
                <div className="text-gray-500 text-xs">
                  <span className="font-medium">Submitted:</span> {req.submittedAt} &nbsp;|&nbsp;
                  <span className="font-medium">PDF:</span> <a href={`/${req.pdf}`} className="underline text-blue-600" target="_blank" rel="noopener noreferrer">View</a>
                </div>
              </div>
              <div className="flex flex-row gap-2 mt-4 md:mt-0 md:ml-6">
                {req.status === "Pending" && (
                  <>
                    <button className="px-4 py-2 rounded border border-green-500 text-green-700 font-medium hover:bg-green-50 transition" onClick={() => handleApprove(req.id)}>Approve</button>
                    <button className="px-4 py-2 rounded border border-red-500 text-red-700 font-medium hover:bg-red-50 transition" onClick={() => handleDecline(req.id)}>Decline</button>
                  </>
                )}
                {req.status === "Approved" && (
                  <span className="px-4 py-2 rounded border border-green-500 text-green-700 font-medium bg-green-50">Approved</span>
                )}
                {req.status === "Declined" && (
                  <span className="px-4 py-2 rounded border border-red-500 text-red-700 font-medium bg-red-50">Declined</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
