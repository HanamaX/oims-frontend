import React, { useEffect, useState } from "react";
// import { Button } from "../../components/ui/button";

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
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Orphanage Registration Requests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.length === 0 && !loading && (
          <div className="col-span-full text-center text-gray-500">No registration requests found.</div>
        )}
        {requests.map((req) => (
          <div key={req.id} className="bg-white rounded shadow border p-4 flex flex-col gap-2">
            <div className="font-semibold text-blue-700 text-lg mb-1">{req.personalName}</div>
            <div><span className="font-medium">Gender:</span> {req.gender}</div>
            <div><span className="font-medium">Email:</span> {req.email}</div>
            <div><span className="font-medium">Center:</span> {req.centerName}</div>
            <div><span className="font-medium">Region:</span> {req.placementRegion}</div>
            <div><span className="font-medium">Certificate:</span> <a href={req.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View PDF</a></div>
            <div><span className="font-medium">Status:</span> <span className="capitalize">{req.status}</span></div>
            <div className="flex gap-2 mt-2">
              {req.status === "pending" ? (
                <>
                  <button className="bg-green-600 text-white flex-1 rounded px-4 py-2" onClick={() => handleApprove(req.id)}>Approve</button>
                  <button className="bg-red-600 text-white flex-1 rounded px-4 py-2" onClick={() => handleDecline(req.id)}>Decline</button>
                </>
              ) : (
                <span className="text-gray-500 flex-1 text-center">-</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}