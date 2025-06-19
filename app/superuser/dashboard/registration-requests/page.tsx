"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import API from "@/lib/api-service"; // Import the API instance

interface RegistrationRequest {
  publicId: string;
  centerName: string;
  adminFullName: string;
  location: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdDate: string;
  lastModifiedDate: string;
  adminEmail: string;
  adminPhoneNumber: string;
  adminGender: string;
  certificateUrl: string;
  certificateFileName: string;
  rejectionReason: string | null;
}

// Status options with proper API values
const statusOptions = ["All", "PENDING", "APPROVED", "REJECTED"];

export default function RegistrationRequestsPage() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    // Dialog state for rejection reason
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  
  // Debug state for API calls
  const [apiStatus, setApiStatus] = useState<string>("");
  
  // Fetch registration requests when component mounts or user navigates to the page
  useEffect(() => {
    // This effect runs when the component is mounted (user has navigated to the page)
    console.log('Component mounted, fetching data...');
    setApiStatus('Loading registration requests...');
    fetchRegistrationRequests();
    
    return () => {
      // Clean up function when component unmounts
      console.log('Component unmounting, cleaning up...');
      setApiStatus('');
      setRequests([]);
    };
  }, []); // Empty dependency array ensures this runs once when component mounts
    const fetchRegistrationRequests = async () => {
    try {
      setLoading(true);
      setApiStatus("Connecting to server...");
      console.log('Fetching registration requests...');
        // Use the API instance
      try {        const response = await API.get('/app/oims/orphanage-center-requests');
        console.log('Response data:', response.data);
          // Handle the actual API response structure
        if (response.data?.data && Array.isArray(response.data.data)) {
          setApiStatus(`Data received successfully. Items: ${response.data.data.length}`);
          setRequests(response.data.data);
          console.log('Requests set:', response.data.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setApiStatus(`Unexpected data format received. See console for details.`);
          throw new Error('Unexpected response format from API');
        }
        
        setError("");
      } catch (apiError) {
        console.error('API Error:', apiError);
        setApiStatus(`API Error: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`);
        throw apiError;
      }
    } catch (error) {      console.error('Error fetching registration requests:', error);
      setApiStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setError("Failed to load registration requests. Please try again later.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };
  const handleApprove = async (publicId: string) => {
    try {
      setActionLoading(true);
      console.log('Approving request:', publicId);
        // Use the API instance
      const response = await API.post(`/app/oims/orphanage-center-requests/${publicId}/status`, {
        status: "APPROVED"
      });
      
      console.log('Approval response:', response.data);
      
      // Update local state to reflect the change
      setRequests((prev) =>
        prev.map((req) => (req.publicId === publicId ? { ...req, status: "APPROVED" } : req))
      );
      
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectDialog = (publicId: string) => {
    setSelectedRequestId(publicId);
    setRejectionReason("");
    setShowDialog(true);
  };

  const handleReject = async () => {
    if (!selectedRequestId || !rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    
    try {
      setActionLoading(true);
      console.log('Rejecting request:', selectedRequestId, 'with reason:', rejectionReason);
        // Use the API instance
      const response = await API.post(`/app/oims/orphanage-center-requests/${selectedRequestId}/status`, {
        status: "REJECTED",
        reason: rejectionReason
      });
      
      console.log('Rejection response:', response.data);
      
      // Update local state to reflect the change
      setRequests((prev) =>
        prev.map((req) => (req.publicId === selectedRequestId ? { ...req, status: "REJECTED" } : req))
      );
      
      // Close the dialog
      setShowDialog(false);
      setSelectedRequestId(null);
      setRejectionReason("");
      
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };
  const filteredRequests = requests.filter((req) => {
    const matchesStatus = status === "All" || req.status === status;
    const matchesSearch =
      req.centerName.toLowerCase().includes(search.toLowerCase()) ||
      req.adminFullName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };  // Function removed - no longer needed

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Orphanage Registration Requests</h1>
      <p className="mb-6 text-gray-600">Review and manage new orphanage registration requests.</p>
      
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search centers or admins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <select
            id="status-filter"
            aria-label="Filter by status"
            title="Filter registration requests by status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 min-w-[120px] focus:outline-none"
          >
            {statusOptions.map((opt) => {
              let displayText = opt;
              if (opt === "PENDING") displayText = "Pending";
              else if (opt === "APPROVED") displayText = "Approved";
              else if (opt === "REJECTED") displayText = "Rejected";
              
              return (
                <option key={opt} value={opt}>
                  {displayText}
                </option>
              );
            })}
          </select>
        </div>        <Button 
          onClick={fetchRegistrationRequests} 
          variant="outline" 
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {apiStatus && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6 flex items-center justify-between">
          <div>
            <span className="font-semibold">API Status:</span> {apiStatus}
          </div>
          <button 
            onClick={() => setApiStatus("")} 
            className="text-blue-500 hover:text-blue-700"
            aria-label="Dismiss API status message"
          >
            ✕
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading requests...</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredRequests.length === 0 ? (
            <div className="text-center bg-gray-50 border border-gray-200 rounded-lg px-6 py-12">
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-700">No registration requests found</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">
                {(() => {
                  if (error) {
                    return "There was an error connecting to the server. Please check your connection and try again.";
                  } else if (status !== "All") {
                    let statusText = "";
                    if (status === "PENDING") {
                      statusText = "pending";
                    } else if (status === "APPROVED") {
                      statusText = "approved";
                    } else {
                      statusText = "rejected";
                    }
                    return `No ${statusText} requests match your search criteria.`;
                  } else {
                    return "There are no registration requests at this time.";
                  }
                })()}
              </p>
              <button 
                onClick={fetchRegistrationRequests} 
                className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md border border-blue-200 hover:bg-blue-100"
              >
                Refresh Data
              </button>
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div
                key={req.publicId}
                className="bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-5 flex flex-col md:flex-row md:items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                    <span className="font-semibold text-lg mr-2">{req.centerName}</span>
                    {(() => {
                      let statusClass = "";
                      if (req.status === "PENDING") {
                        statusClass = "border-yellow-400 text-yellow-700";
                      } else if (req.status === "APPROVED") {
                        statusClass = "border-green-400 text-green-700";
                      } else {
                        statusClass = "border-red-400 text-red-700";
                      }
                      
                      let statusText = "";
                      if (req.status === "PENDING") {
                        statusText = "Pending";
                      } else if (req.status === "APPROVED") {
                        statusText = "Approved";
                      } else {
                        statusText = "Rejected";
                      }
                      
                      return (
                        <span className={`text-xs px-2 py-1 rounded bg-gray-100 border ml-0 sm:ml-2 ${statusClass}`}>
                          {statusText}
                        </span>
                      );
                    })()}
                  </div>                  <div className="text-gray-700 text-sm mb-1">
                    <span className="font-medium">Admin:</span> {req.adminFullName} &nbsp;|&nbsp;
                    <span className="font-medium">Location:</span> {req.location}
                  </div>
                  <div className="text-gray-500 text-xs">
                    <span className="font-medium">Email:</span> {req.adminEmail} &nbsp;|&nbsp;
                    <span className="font-medium">Phone:</span> {req.adminPhoneNumber} &nbsp;|&nbsp;                    <span className="font-medium">Submitted:</span> {formatDate(req.createdDate)} &nbsp;|&nbsp;                    <span className="font-medium">Certificate:</span>
                    <button 
                      onClick={() => {
                        // Use the direct certificateUrl if available
                        if (req.certificateUrl) {
                          window.open(req.certificateUrl, '_blank');
                        } else {
                          console.log('Certificate URL not found for this request');
                        }
                      }}
                      className="underline text-blue-600 hover:text-blue-800 ml-1" 
                      aria-label={`View certificate for ${req.centerName}`}
                    >
                      {req.certificateFileName || 'View'}
                    </button>
                  </div>
                </div>
                <div className="flex flex-row gap-2 mt-4 md:mt-0 md:ml-6">
                  {req.status === "PENDING" && (
                    <>
                      <Button 
                        onClick={() => handleApprove(req.publicId)} 
                        disabled={actionLoading}
                        className="bg-green-50 hover:bg-green-100 text-green-700 border-green-500"
                        variant="outline"
                      >
                        Approve
                      </Button>
                      <Button 
                        onClick={() => openRejectDialog(req.publicId)} 
                        disabled={actionLoading}
                        className="bg-red-50 hover:bg-red-100 text-red-700 border-red-500"
                        variant="outline"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {req.status === "APPROVED" && (
                    <span className="px-4 py-2 rounded border border-green-500 text-green-700 font-medium bg-green-50">Approved</span>
                  )}
                  {req.status === "REJECTED" && (
                    <span className="px-4 py-2 rounded border border-red-500 text-red-700 font-medium bg-red-50">Rejected</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Rejection Reason Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provide Rejection Reason</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="rejection-reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Rejection (Required)
            </label>
            <textarea
              id="rejection-reason"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              placeholder="Please provide a reason for rejecting this registration request..."
              required
            />
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setShowDialog(false)} 
              variant="outline"
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReject} 
              disabled={!rejectionReason.trim() || actionLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {actionLoading ? "Processing..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
