"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileX, 
  Search, 
  Eye, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Calendar,
  Mail,
  MapPin
} from "lucide-react";
import API from "@/lib/api-service";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage, T } from "@/contexts/LanguageContext";

interface LeaveRequest {
  publicId: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdDate: string;
  lastModifiedDate: string;
  centrePublicId: string;
  centreName: string;
  centreLocation: string;
  centreIsActive: boolean;
  adminPublicId: string;
  adminFullName: string;
  adminEmail: string;
  adminPhone: string;
  rejectionReason?: string; // Optional field for rejected requests
}

const statusOptions = ["All", "PENDING", "APPROVED", "REJECTED"];

export default function LeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Dialog state
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [processAction, setProcessAction] = useState<"approve" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  
  const { toast } = useToast();
  const { t } = useLanguage();

  // Fetch leave requests
  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await API.get('/app/oims/orphanage-centers/leave-requests');
      
      if (response.data?.data) {
        setRequests(response.data.data);
      } else {
        setRequests([]);
      }
    } catch (err: any) {
      console.error("Error fetching leave requests:", err);
      setError(err.response?.data?.message || "Failed to fetch leave requests");
      toast({
        title: t("common.error"),
        description: t("leaveRequests.error.fetch"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter requests based on search and status
  useEffect(() => {
    let filtered = requests;
    
    // Filter by status
    if (status !== "All") {
      filtered = filtered.filter(request => request.status === status);
    }
    
    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(request => 
        request.centreName.toLowerCase().includes(searchLower) ||
        request.adminFullName.toLowerCase().includes(searchLower) ||
        request.centreLocation.toLowerCase().includes(searchLower) ||
        request.adminEmail.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredRequests(filtered);
  }, [requests, search, status]);

  // Fetch data on component mount
  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString.replace(' ', 'T'));
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle view details
  const handleViewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setShowDetailsDialog(true);
  };

  // Handle process request (approve/reject)
  const handleProcessRequest = (request: LeaveRequest, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setProcessAction(action);
    setRejectionReason("");
    setShowProcessDialog(true);
  };

  // Confirm process action
  const confirmProcessAction = async () => {
    if (!selectedRequest || !processAction) return;
    
    if (processAction === "reject" && !rejectionReason.trim()) {
      toast({
        title: t("common.error"),
        description: t("leaveRequests.error.reasonRequired"),
        variant: "destructive",
      });
      return;
    }
    
    setActionLoading(true);
    
    try {
      const endpoint = `/app/oims/orphanage-centers/leave-requests/${selectedRequest.publicId}`;
      const requestBody = {
        status: processAction === "approve" ? "APPROVED" : "REJECTED",
        ...(processAction === "reject" && { rejectionReason: rejectionReason.trim() })
      };
      
      await API.post(endpoint, requestBody);
      
      // Update the request in the local state
      setRequests(prev => prev.map(req => 
        req.publicId === selectedRequest.publicId 
          ? { 
              ...req, 
              status: processAction === "approve" ? "APPROVED" : "REJECTED",
              ...(processAction === "reject" && { rejectionReason: rejectionReason.trim() })
            }
          : req
      ));
      
      toast({
        title: t("common.success"),
        description: t(`leaveRequests.success.${processAction}`),
      });
      
      setShowProcessDialog(false);
      setSelectedRequest(null);
      setProcessAction(null);
      setRejectionReason("");
      
    } catch (err: any) {
      console.error(`Error ${processAction}ing leave request:`, err);
      toast({
        title: t("common.error"),
        description: t(`leaveRequests.error.${processAction}`),
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PENDING": return "secondary";
      case "APPROVED": return "default";
      case "REJECTED": return "destructive";
      default: return "secondary";
    }
  };

  // Get status badge color classes
  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "APPROVED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2"><T k="leaveRequests.loading" /></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <T k="leaveRequests.title" />
          </h1>
          <p className="text-muted-foreground">
            <T k="leaveRequests.subtitle" />
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("leaveRequests.search")}
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={status}
          onValueChange={setStatus}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel><T k="leaveRequests.status" /></SelectLabel>
              {statusOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  <T k={option === "All" ? "leaveRequests.allRequests" : `leaveRequests.status.${option.toLowerCase()}`} />
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {filteredRequests.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <FileX className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">
            <T k="leaveRequests.noRequestsFound" />
          </h3>
          <p className="text-muted-foreground">
            {search || status !== "All" 
              ? <T k="leaveRequests.adjustFilters" />
              : <T k="leaveRequests.noRequestsYet" />}
          </p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle><T k="leaveRequests.title" /></CardTitle>
            <CardDescription>
              <T k="leaveRequests.showing" /> {filteredRequests.length} <T k="leaveRequests.of" /> {requests.length} <T k="leaveRequests.requests" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T k="leaveRequests.table.centre" /></TableHead>
                  <TableHead><T k="leaveRequests.table.admin" /></TableHead>
                  <TableHead><T k="leaveRequests.table.requestDate" /></TableHead>
                  <TableHead><T k="leaveRequests.table.status" /></TableHead>
                  <TableHead className="text-right"><T k="leaveRequests.table.actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.publicId}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{request.centreName}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          {request.centreLocation}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{request.adminFullName}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Mail className="h-3 w-3 mr-1" />
                          {request.adminEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        {formatDate(request.createdDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusBadgeVariant(request.status)}
                        className={getStatusBadgeClasses(request.status)}
                      >
                        <T k={`leaveRequests.status.${request.status.toLowerCase()}`} />
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(request)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          <T k="leaveRequests.actions.view" />
                        </Button>
                        {request.status === "PENDING" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-200 text-green-700 hover:bg-green-50"
                              onClick={() => handleProcessRequest(request, "approve")}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              <T k="leaveRequests.actions.approve" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-200 text-red-700 hover:bg-red-50"
                              onClick={() => handleProcessRequest(request, "reject")}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              <T k="leaveRequests.actions.reject" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle><T k="leaveRequests.details.title" /></DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Centre Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  <T k="leaveRequests.details.centreInfo" />
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      <T k="leaveRequests.details.centreName" />
                    </label>
                    <p className="font-medium">{selectedRequest.centreName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      <T k="leaveRequests.details.centreLocation" />
                    </label>
                    <p className="font-medium">{selectedRequest.centreLocation}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      <T k="leaveRequests.details.centreStatus" />
                    </label>
                    <Badge 
                      variant={selectedRequest.centreIsActive ? "default" : "destructive"}
                      className={selectedRequest.centreIsActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {selectedRequest.centreIsActive ? <T k="leaveRequests.details.active" /> : <T k="leaveRequests.details.inactive" />}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Admin Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  <T k="leaveRequests.details.adminInfo" />
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      <T k="leaveRequests.details.adminName" />
                    </label>
                    <p className="font-medium">{selectedRequest.adminFullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      <T k="leaveRequests.details.adminEmail" />
                    </label>
                    <p className="font-medium">{selectedRequest.adminEmail}</p>
                  </div>
                  {selectedRequest.adminPhone && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        <T k="leaveRequests.details.adminPhone" />
                      </label>
                      <p className="font-medium">{selectedRequest.adminPhone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Request Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  <T k="leaveRequests.details.requestInfo" />
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      <T k="leaveRequests.details.requestDate" />
                    </label>
                    <p className="font-medium">{formatDate(selectedRequest.createdDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      <T k="leaveRequests.details.requestStatus" />
                    </label>
                    <Badge 
                      variant={getStatusBadgeVariant(selectedRequest.status)}
                      className={getStatusBadgeClasses(selectedRequest.status)}
                    >
                      <T k={`leaveRequests.status.${selectedRequest.status.toLowerCase()}`} />
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="text-sm font-medium text-muted-foreground">
                    <T k="leaveRequests.details.reason" />
                  </label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm whitespace-pre-line">{selectedRequest.reason}</p>
                  </div>
                </div>

                {/* Show rejection reason if the request is rejected */}
                {selectedRequest.status === "REJECTED" && selectedRequest.rejectionReason && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-muted-foreground text-red-600">
                      <T k="leaveRequests.details.rejectionReason" />
                    </label>
                    <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800 whitespace-pre-line">{selectedRequest.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              <T k="leaveRequests.actions.close" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Process Dialog */}
      <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {processAction === "approve" 
                ? <T k="leaveRequests.process.approveTitle" />
                : <T k="leaveRequests.process.rejectTitle" />}
            </DialogTitle>
            <DialogDescription>
              {processAction === "approve" 
                ? <T k="leaveRequests.process.approveDescription" />
                : <T k="leaveRequests.process.rejectDescription" />}
            </DialogDescription>
          </DialogHeader>
          
          {processAction === "reject" && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="rejectionReason" className="text-sm font-medium">
                  <T k="leaveRequests.process.rejectionReason" />
                  <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="rejectionReason"
                  placeholder={t("leaveRequests.process.rejectionReasonPlaceholder")}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowProcessDialog(false);
                setRejectionReason("");
              }}
            >
              <T k="common.cancel" />
            </Button>
            <Button 
              variant={processAction === "approve" ? "default" : "destructive"}
              onClick={confirmProcessAction}
              disabled={actionLoading || (processAction === "reject" && !rejectionReason.trim())}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <T k="leaveRequests.process.processing" />
                </>
              ) : (
                <>
                  {processAction === "approve" ? (
                    <T k="leaveRequests.actions.approve" />
                  ) : (
                    <T k="leaveRequests.actions.reject" />
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
