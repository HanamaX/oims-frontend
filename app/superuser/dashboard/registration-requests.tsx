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

export default function RegistrationRequests() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Example requests for demonstration
    setTimeout(() => {
      setRequests([
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
      ]);
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

  if (loading) return <div>Loading registration requests...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-900">
        Orphanage Registration Requests
      </h2>
      <div className="flex flex-col gap-6">
        {requests.length === 0 && !loading && (
          <div className="text-center text-gray-500">
            No registration requests found.
          </div>
        )}
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded shadow border p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="font-bold text-blue-700 text-xl mb-1">
                {req.personalName}
              </div>
              <div className="mb-1">
                <span className="font-medium">Gender:</span> {req.gender}
              </div>
              <div className="mb-1">
                <span className="font-medium">Email:</span> {req.email}
              </div>
              <div className="mb-1">
                <span className="font-medium">Center:</span> {req.centerName}
              </div>
              <div className="mb-1">
                <span className="font-medium">Region:</span> {req.placementRegion}
              </div>
              <div className="mb-1">
                <span className="font-medium">Certificate:</span>{" "}
                <a
                  href={req.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View PDF
                </a>
              </div>
              <div className="mb-1">
                <span className="font-medium">Status:</span>{" "}
                <span className="capitalize">{req.status}</span>
              </div>
            </div>
            <div className="flex flex-row gap-2 md:flex-col md:gap-2 min-w-[180px] md:items-end">
              {req.status === "pending" ? (
                <>
                  <Button
                    className="bg-green-600 text-white flex-1 md:w-full"
                    onClick={() => handleApprove(req.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    className="bg-red-600 text-white flex-1 md:w-full"
                    onClick={() => handleDecline(req.id)}
                  >
                    Decline
                  </Button>
                </>
              ) : (
                <span className="text-gray-500 flex-1 text-center md:w-full">
                  -
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}