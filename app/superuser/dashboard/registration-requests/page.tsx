"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface RegistrationRequest {
  id: string;
  personalName: string;
  gender: string;
  email: string;
  centerName: string;
  placementRegion: string;
  certificateUrl: string;
  status: "pending" | "approved" | "declined";
}

const demoRequests = [
  {
    id: "1",
    personalName: "Jane Doe",
    gender: "Female",
    email: "jane@example.com",
    centerName: "Hope Center",
    placementRegion: "Nairobi",
    certificateUrl: "/sample-certificate.pdf",
    status: "pending",
  },
  {
    id: "2",
    personalName: "John Smith",
    gender: "Male",
    email: "john.smith@example.com",
    centerName: "Sunrise Home",
    placementRegion: "Mombasa",
    certificateUrl: "/sample-certificate2.pdf",
    status: "pending",
  },
  {
    id: "3",
    personalName: "Mary Wanjiku",
    gender: "Female",
    email: "mary.wanjiku@example.com",
    centerName: "Bright Future",
    placementRegion: "Kisumu",
    certificateUrl: "/sample-certificate3.pdf",
    status: "approved",
  },
  {
    id: "4",
    personalName: "Ali Hassan",
    gender: "Male",
    email: "ali.hassan@example.com",
    centerName: "Unity House",
    placementRegion: "Garissa",
    certificateUrl: "/sample-certificate4.pdf",
    status: "declined",
  },
  {
    id: "5",
    personalName: "Grace Kimani",
    gender: "Female",
    email: "grace.kimani@example.com",
    centerName: "Safe Haven",
    placementRegion: "Nakuru",
    certificateUrl: "/sample-certificate5.pdf",
    status: "pending",
  },
  {
    id: "6",
    personalName: "Samuel Otieno",
    gender: "Male",
    email: "samuel.otieno@example.com",
    centerName: "Starlight Home",
    placementRegion: "Eldoret",
    certificateUrl: "/sample-certificate6.pdf",
    status: "pending",
  },
  {
    id: "7",
    personalName: "Fatma Noor",
    gender: "Female",
    email: "fatma.noor@example.com",
    centerName: "Peace Center",
    placementRegion: "Isiolo",
    certificateUrl: "/sample-certificate7.pdf",
    status: "approved",
  },
];

const statusOptions = ["All", "Pending", "Approved", "Declined"];

export default function RegistrationRequests() {
  const [requests, setRequests] = useState<RegistrationRequest[]>(demoRequests);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Pending");

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "approved" } : req
      )
    );
  };
  const handleDecline = (id: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "declined" } : req
      )
    );
  };

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = statusFilter === "All" || req.status === statusFilter;
    const matchesSearch =
      req.personalName.toLowerCase().includes(search.toLowerCase()) ||
      req.email.toLowerCase().includes(search.toLowerCase()) ||
      req.centerName.toLowerCase().includes(search.toLowerCase()) ||
      req.placementRegion.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col items-center min-h-[80vh] bg-gradient-to-br from-blue-50/60 to-white py-8">
      <h2 className="text-4xl font-extrabold text-blue-800 mb-2 tracking-tight" style={{fontSize: '2.8rem'}}>Orphanage Registration Requests</h2>
      <div className="text-lg text-gray-600 mb-8">Review, approve, or decline orphanage registration requests below.</div>
      <div className="w-[80%] max-w-7xl bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name, email, center, or region..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-blue-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-blue-200 rounded px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="text-center text-blue-600 text-lg">Loading registration requests...</div>
        ) : error ? (
          <div className="text-red-600 text-center">{error}</div>
        ) : (
          <div className="space-y-5">
            {filteredRequests.length === 0 && (
              <div className="text-center text-gray-500 py-12">No registration requests found.</div>
            )}
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-5 flex flex-col md:flex-row md:items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                    <span className="font-semibold text-lg mr-2">{req.personalName}</span>
                    <span className={`text-xs px-2 py-1 rounded bg-gray-100 border ml-0 sm:ml-2 ${
                      req.status === "pending"
                        ? "border-yellow-400 text-yellow-700"
                        : req.status === "approved"
                        ? "border-green-400 text-green-700"
                        : "border-red-400 text-red-700"
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="text-gray-700 text-sm mb-1">
                    <span className="font-medium">Gender:</span> {req.gender} &nbsp;|&nbsp;
                    <span className="font-medium">Email:</span> {req.email}
                  </div>
                  <div className="text-gray-500 text-xs">
                    <span className="font-medium">Center:</span> {req.centerName} &nbsp;|&nbsp;
                    <span className="font-medium">Region:</span> {req.placementRegion} &nbsp;|&nbsp;
                    <span className="font-medium">Submitted:</span> {req.submittedAt} &nbsp;|&nbsp;
                    <span className="font-medium">Certificate:</span> <a href={req.certificateUrl} className="underline text-blue-600" target="_blank" rel="noopener noreferrer">View PDF</a>
                  </div>
                </div>
                <div className="flex flex-row gap-2 mt-4 md:mt-0 md:ml-6">
                  {req.status === "pending" ? (
                    <>
                      <Button className="bg-green-600 text-white flex-1 text-lg py-2" onClick={() => handleApprove(req.id)}>Approve</Button>
                      <Button className="bg-red-600 text-white flex-1 text-lg py-2" onClick={() => handleDecline(req.id)}>Decline</Button>
                    </>
                  ) : req.status === "approved" ? (
                    <span className="px-4 py-2 rounded border border-green-500 text-green-700 font-medium bg-green-50">Approved</span>
                  ) : (
                    <span className="px-4 py-2 rounded border border-red-500 text-red-700 font-medium bg-red-50">Declined</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
