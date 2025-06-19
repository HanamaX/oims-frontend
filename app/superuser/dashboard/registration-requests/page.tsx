"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegistrationRequest {
  id: string;
  personalName: string;
  gender: string;
  email: string;
  phone: string;
  centerName: string;
  placementRegion: string;
  certificateUrl: string;
  status: "pending" | "approved" | "declined";
  submittedAt?: string; // Add submission date
}

const allRegions = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Eldoret",
  "Nakuru",
  "Thika",
  "Meru",
  "Garissa",
  "Kitale",
  "Machakos",
];
const allCenters = [
  "Hope Center",
  "Sunrise Home",
  "Bright Future",
  "Starlight Orphanage",
  "New Dawn",
  "Safe Haven",
  "Little Angels",
  "Unity House",
  "Grace Shelter",
  "Peace Home",
];
const allGenders = ["Male", "Female"];

export default function RegistrationRequests() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [centerFilter, setCenterFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    // 20 demo requests
    setTimeout(() => {
      setRequests([
        {
          id: "1",
          personalName: "Jane Doe",
          gender: "Female",
          email: "jane@example.com",
          phone: "+254712345678",
          centerName: "Hope Center",
          placementRegion: "Nairobi",
          certificateUrl: "/sample-certificate.pdf",
          status: "pending",
          submittedAt: "2025-06-18 10:15",
        },
        {
          id: "2",
          personalName: "John Smith",
          gender: "Male",
          email: "john.smith@example.com",
          phone: "+254712345679",
          centerName: "Sunrise Home",
          placementRegion: "Mombasa",
          certificateUrl: "/sample-certificate2.pdf",
          status: "pending",
          submittedAt: "2025-06-18 11:00",
        },
        {
          id: "3",
          personalName: "Mary Wanjiku",
          gender: "Female",
          email: "mary.wanjiku@example.com",
          phone: "+254712345680",
          centerName: "Bright Future",
          placementRegion: "Kisumu",
          certificateUrl: "/sample-certificate3.pdf",
          status: "approved",
          submittedAt: "2025-06-17 09:30",
        },
        {
          id: "4",
          personalName: "Ali Hassan",
          gender: "Male",
          email: "ali.hassan@example.com",
          phone: "+254712345681",
          centerName: "Starlight Orphanage",
          placementRegion: "Eldoret",
          certificateUrl: "/sample-certificate4.pdf",
          status: "declined",
          submittedAt: "2025-06-16 14:45",
        },
        {
          id: "5",
          personalName: "Grace Njeri",
          gender: "Female",
          email: "grace.njeri@example.com",
          phone: "+254712345682",
          centerName: "New Dawn",
          placementRegion: "Nakuru",
          certificateUrl: "/sample-certificate5.pdf",
          status: "pending",
          submittedAt: "2025-06-18 08:20",
        },
        {
          id: "6",
          personalName: "Peter Otieno",
          gender: "Male",
          email: "peter.otieno@example.com",
          phone: "+254712345683",
          centerName: "Safe Haven",
          placementRegion: "Thika",
          certificateUrl: "/sample-certificate6.pdf",
          status: "approved",
          submittedAt: "2025-06-17 10:10",
        },
        {
          id: "7",
          personalName: "Lucy Mwangi",
          gender: "Female",
          email: "lucy.mwangi@example.com",
          phone: "+254712345684",
          centerName: "Little Angels",
          placementRegion: "Meru",
          certificateUrl: "/sample-certificate7.pdf",
          status: "pending",
          submittedAt: "2025-06-18 07:55",
        },
        {
          id: "8",
          personalName: "Samuel Kiptoo",
          gender: "Male",
          email: "samuel.kiptoo@example.com",
          phone: "+254712345685",
          centerName: "Unity House",
          placementRegion: "Garissa",
          certificateUrl: "/sample-certificate8.pdf",
          status: "declined",
          submittedAt: "2025-06-16 13:30",
        },
        {
          id: "9",
          personalName: "Faith Chebet",
          gender: "Female",
          email: "faith.chebet@example.com",
          phone: "+254712345686",
          centerName: "Grace Shelter",
          placementRegion: "Kitale",
          certificateUrl: "/sample-certificate9.pdf",
          status: "pending",
          submittedAt: "2025-06-18 09:10",
        },
        {
          id: "10",
          personalName: "Brian Ouma",
          gender: "Male",
          email: "brian.ouma@example.com",
          phone: "+254712345687",
          centerName: "Peace Home",
          placementRegion: "Machakos",
          certificateUrl: "/sample-certificate10.pdf",
          status: "approved",
          submittedAt: "2025-06-17 11:25",
        },
        {
          id: "11",
          personalName: "Janet Muthoni",
          gender: "Female",
          email: "janet.muthoni@example.com",
          phone: "+254712345688",
          centerName: "Hope Center",
          placementRegion: "Nairobi",
          certificateUrl: "/sample-certificate11.pdf",
          status: "pending",
          submittedAt: "2025-06-18 10:00",
        },
        {
          id: "12",
          personalName: "David Kimani",
          gender: "Male",
          email: "david.kimani@example.com",
          phone: "+254712345689",
          centerName: "Sunrise Home",
          placementRegion: "Mombasa",
          certificateUrl: "/sample-certificate12.pdf",
          status: "declined",
          submittedAt: "2025-06-16 15:40",
        },
        {
          id: "13",
          personalName: "Mercy Atieno",
          gender: "Female",
          email: "mercy.atieno@example.com",
          phone: "+254712345690",
          centerName: "Bright Future",
          placementRegion: "Kisumu",
          certificateUrl: "/sample-certificate13.pdf",
          status: "approved",
          submittedAt: "2025-06-17 09:00",
        },
        {
          id: "14",
          personalName: "James Kariuki",
          gender: "Male",
          email: "james.kariuki@example.com",
          phone: "+254712345691",
          centerName: "Starlight Orphanage",
          placementRegion: "Eldoret",
          certificateUrl: "/sample-certificate14.pdf",
          status: "pending",
          submittedAt: "2025-06-18 10:45",
        },
        {
          id: "15",
          personalName: "Ann Wambui",
          gender: "Female",
          email: "ann.wambui@example.com",
          phone: "+254712345692",
          centerName: "New Dawn",
          placementRegion: "Nakuru",
          certificateUrl: "/sample-certificate15.pdf",
          status: "approved",
          submittedAt: "2025-06-17 11:15",
        },
        {
          id: "16",
          personalName: "Moses Mwenda",
          gender: "Male",
          email: "moses.mwenda@example.com",
          phone: "+254712345693",
          centerName: "Safe Haven",
          placementRegion: "Thika",
          certificateUrl: "/sample-certificate16.pdf",
          status: "pending",
          submittedAt: "2025-06-18 09:50",
        },
        {
          id: "17",
          personalName: "Cynthia Naliaka",
          gender: "Female",
          email: "cynthia.naliaka@example.com",
          phone: "+254712345694",
          centerName: "Little Angels",
          placementRegion: "Meru",
          certificateUrl: "/sample-certificate17.pdf",
          status: "declined",
          submittedAt: "2025-06-16 12:15",
        },
        {
          id: "18",
          personalName: "Paul Mutua",
          gender: "Male",
          email: "paul.mutua@example.com",
          phone: "+254712345695",
          centerName: "Unity House",
          placementRegion: "Garissa",
          certificateUrl: "/sample-certificate18.pdf",
          status: "pending",
          submittedAt: "2025-06-18 10:05",
        },
        {
          id: "19",
          personalName: "Naomi Wairimu",
          gender: "Female",
          email: "naomi.wairimu@example.com",
          phone: "+254712345696",
          centerName: "Grace Shelter",
          placementRegion: "Kitale",
          certificateUrl: "/sample-certificate19.pdf",
          status: "approved",
          submittedAt: "2025-06-17 10:30",
        },
        {
          id: "20",
          personalName: "Kelvin Omondi",
          gender: "Male",
          email: "kelvin.omondi@example.com",
          phone: "+254712345697",
          centerName: "Peace Home",
          placementRegion: "Machakos",
          certificateUrl: "/sample-certificate20.pdf",
          status: "pending",
          submittedAt: "2025-06-18 08:15",
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

  // Filtering logic
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.personalName.toLowerCase().includes(search.toLowerCase()) ||
      req.email.toLowerCase().includes(search.toLowerCase()) ||
      req.centerName.toLowerCase().includes(search.toLowerCase()) ||
      req.placementRegion.toLowerCase().includes(search.toLowerCase()) ||
      req.phone.includes(search);
    const matchesStatus =
      statusFilter === "all" || req.status === statusFilter;
    const matchesRegion =
      regionFilter === "all" || req.placementRegion === regionFilter;
    const matchesCenter =
      centerFilter === "all" || req.centerName === centerFilter;
    const matchesGender = genderFilter === "all" || req.gender === genderFilter;
    return (
      matchesSearch &&
      matchesStatus &&
      matchesRegion &&
      matchesCenter &&
      matchesGender
    );
  });

  if (loading) return <div>Loading registration requests...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6">
        Orphanage Registration Requests
      </h2>
      <div className="flex flex-col md:flex-row gap-6 mb-6 items-center text-[16px]">
        <Input
          placeholder="Search by name, email, center, region, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs h-12 text-[16px] border-blue-400 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 shadow-sm rounded-lg"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] h-12 text-[16px] border-blue-400 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 shadow-sm rounded-lg bg-blue-50 hover:bg-blue-100">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-lg border-blue-200">
            <SelectItem value="all" className="hover:bg-blue-100">All Statuses</SelectItem>
            <SelectItem value="pending" className="hover:bg-blue-100">Pending</SelectItem>
            <SelectItem value="approved" className="hover:bg-blue-100">Approved</SelectItem>
            <SelectItem value="declined" className="hover:bg-blue-100">Declined</SelectItem>
          </SelectContent>
        </Select>
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-[160px] h-12 text-[16px] border-blue-400 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 shadow-sm rounded-lg bg-blue-50 hover:bg-blue-100">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-lg border-blue-200">
            <SelectItem value="all" className="hover:bg-blue-100">All Regions</SelectItem>
            {allRegions.map((region) => (
              <SelectItem key={region} value={region} className="hover:bg-blue-100">{region}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={centerFilter} onValueChange={setCenterFilter}>
          <SelectTrigger className="w-[180px] h-12 text-[16px] border-blue-400 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 shadow-sm rounded-lg bg-blue-50 hover:bg-blue-100">
            <SelectValue placeholder="Center" />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-lg border-blue-200">
            <SelectItem value="all" className="hover:bg-blue-100">All Centers</SelectItem>
            {allCenters.map((center) => (
              <SelectItem key={center} value={center} className="hover:bg-blue-100">{center}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={genderFilter} onValueChange={setGenderFilter}>
          <SelectTrigger className="w-[140px] h-12 text-[16px] border-blue-400 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 shadow-sm rounded-lg bg-blue-50 hover:bg-blue-100">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent className="rounded-lg shadow-lg border-blue-200">
            <SelectItem value="all" className="hover:bg-blue-100">All Genders</SelectItem>
            {allGenders.map((gender) => (
              <SelectItem key={gender} value={gender} className="hover:bg-blue-100">{gender}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-6">
        {filteredRequests.length === 0 && !loading && (
          <div className="text-center text-gray-500 text-[16px]">
            No registration requests found.
          </div>
        )}
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-xl shadow-lg border p-6 flex flex-col gap-2 w-full text-[16px] md:min-w-[950px] lg:min-w-[1200px]"
          >
            <div className="flex flex-row items-center justify-between">
              <div>
                <span className="font-semibold text-blue-700 text-lg">
                  {req.personalName}
                </span>
                <span className="ml-6 text-gray-500 text-[15px]">
                  {req.submittedAt || "2025-06-18 10:00"}
                </span>
              </div>
              <Button
                variant="outline"
                size="lg"
                className="text-[15px] px-6 py-2"
                onClick={() =>
                  setExpandedId(expandedId === req.id ? null : req.id)
                }
              >
                {expandedId === req.id ? "Hide Details" : "View Details"}
              </Button>
            </div>
            {expandedId === req.id && (
              <div className="mt-4 border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-[15px]">
                <div>
                  <div className="mb-2">
                    <span className="font-medium">Name:</span> {req.personalName}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Gender:</span> {req.gender}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Email:</span> {req.email}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Phone:</span> {req.phone}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Status:</span>{" "}
                    <span className="capitalize">{req.status}</span>
                  </div>
                </div>
                <div>
                  <div className="mb-2">
                    <span className="font-medium">Center:</span> {req.centerName}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Region:</span> {req.placementRegion}
                  </div>
                  <div className="mb-2">
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
                  <div className="mb-2">
                    <span className="font-medium">Submitted At:</span>{" "}
                    {req.submittedAt || "2025-06-18 10:00"}
                  </div>
                </div>
                <div className="col-span-2 flex gap-4 mt-4">
                  {req.status === "pending" ? (
                    <>
                      <Button
                        className="bg-green-600 text-white flex-1 text-[15px] py-2"
                        onClick={() => handleApprove(req.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        className="bg-red-600 text-white flex-1 text-[15px] py-2"
                        onClick={() => handleDecline(req.id)}
                      >
                        Decline
                      </Button>
                    </>
                  ) : (
                    <span className="text-gray-500 flex-1 text-center text-[15px]">-</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
