"use client";
import React, { useState } from "react";
import Link from "next/link";
import "../../styles/animations.css";
import API from "@/lib/api-service"; // Import the API instance

export default function OrphanageRegistrationForm() {  type FormState = {
    adminFullName: string;
    adminGender: string;
    adminEmail: string;
    adminPhoneNumber: string;
    centerName: string;
    location: string;
    certificate: File | null;
  };
  const [form, setForm] = useState<FormState>({
    adminFullName: "",
    adminGender: "",
    adminEmail: "",
    adminPhoneNumber: "",
    centerName: "",
    location: "",
    certificate: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;    
    if (name === "certificate") {
      const file = files?.[0];
      if (file && file.type !== "application/pdf") {
        setError("Certificate must be a PDF file.");
        return;
      }
      setForm({ ...form, certificate: file || null });
      setError("");
    } else {
      setForm({ ...form, [name]: value });
    }
  };  // Validate form data
  const validateForm = (formData: FormState) => {
    // Email pattern check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.adminEmail)) {
      throw new Error("Please enter a valid email address.");
    }
    
    // Phone pattern check: +countrycode and 9 digits
    const phonePattern = /^\+\d{1,4}\d{9}$/;
    if (!phonePattern.test(formData.adminPhoneNumber)) {
      throw new Error("Phone number must start with country code (e.g. +254) and have exactly 9 digits after the code.");
    }
    
    if (!formData.certificate) {
      throw new Error("Certificate is required.");
    }
    
    if (formData.certificate.type !== "application/pdf") {
      throw new Error("Certificate must be a PDF file.");
    }
  };

  // Submit registration data to the backend
  const submitRegistrationData = async (formData: FormState) => {
    const registrationData = {
      adminFullName: formData.adminFullName,
      adminGender: formData.adminGender,
      adminEmail: formData.adminEmail,
      adminPhoneNumber: formData.adminPhoneNumber,
      centerName: formData.centerName,
      location: formData.location
    };
    
    const dataResponse = await API.post('/app/oims/orphanage-center-requests/submit-data', registrationData);
    
    if (!dataResponse?.data) {
      throw new Error('Failed to submit registration data - no response received');
    }
    
    // Get the requestId from the response
    const responseData = dataResponse.data;
    // Extract requestId from the actual response structure
    const requestId = responseData.data?.requestId;
    
    console.log('Registration response:', responseData);
    
    if (!requestId) {
      throw new Error('Failed to get request ID from server response');
    }
    
    return requestId;
  };  // Upload certificate to the backend
  const uploadCertificate = async (requestId: string, certificate: File) => {
    console.log(`Uploading certificate for request ID: ${requestId}`);
    
    const certificateFormData = new FormData();
    certificateFormData.append('file', certificate);
    
    try {
      console.log('File details:', {
        name: certificate.name,
        size: certificate.size,
        type: certificate.type || 'No specific type'
      });
      
      // Make sure Content-Type is explicitly set to undefined to let browser handle it
      const certificateResponse = await API.post(
        `/app/oims/orphanage-center-requests/${requestId}/upload-certificate`, 
        certificateFormData,
        {
          headers: {
            'Content-Type': undefined // This forces axios to not set the content type
          },
          transformRequest: (data) => {
            // Return data as is - don't let axios transform it
            return data;
          }
        }
      );
      
      console.log('Certificate upload response:', certificateResponse.data);
      
      if (!certificateResponse?.data) {
        console.error('Certificate upload failed:', certificateResponse);
        throw new Error('Registration data was submitted but certificate upload failed');
      }
    } catch (certificateError) {
      console.error('Error uploading certificate:', certificateError);
      throw new Error(`Certificate upload failed: ${certificateError instanceof Error ? certificateError.message : 'Unknown error'}`);
    }
  };

  // Alternative certificate upload method using direct fetch instead of axios
  const uploadCertificateWithFetch = async (requestId: string, certificate: File) => {
    console.log(`Uploading certificate using fetch for request ID: ${requestId}`);
    
    try {
      const formData = new FormData();
      formData.append('file', certificate);
        const token = localStorage.getItem("jwt_token");
      const apiBaseUrl = API.defaults.baseURL ?? "http://localhost:8080"; // Fallback to default
      
      const response = await fetch(
        `${apiBaseUrl}/app/oims/orphanage-center-requests/${requestId}/upload-certificate`,
        {
          method: 'POST',
          headers: token ? {
            'Authorization': `Bearer ${token}`
          } : {},
          body: formData
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch upload failed:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        throw new Error(`Fetch upload failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetch certificate upload response:', data);
      return data;
      
    } catch (error) {
      console.error('Error in fetch upload:', error);
      throw new Error(`Fetch certificate upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      // Validate form data
      validateForm(form);
      
      // Send form data to backend API
      const requestId = await submitRegistrationData(form);
      
      // Upload certificate if available
      if (form.certificate) {
        try {
          // First try with axios
          await uploadCertificate(requestId, form.certificate);
        } catch (uploadError) {
          console.error('Axios upload failed, trying with fetch:', uploadError);
          // If axios fails, try with fetch as fallback
          await uploadCertificateWithFetch(requestId, form.certificate);
        }
      }
      
      setSuccess("Registration submitted successfully!");
      setShowThankYou(true);
      setForm({
        adminFullName: "",
        adminGender: "",
        adminEmail: "",
        adminPhoneNumber: "",
        centerName: "",
        location: "",
        certificate: null,
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
      return;
    }
  };

  if (showThankYou) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center bg-white rounded shadow mx-auto my-8 p-8 max-w-2xl">
        <h2 className="text-3xl font-bold text-green-700 mb-4">Thank You!</h2>
        <p className="text-lg mb-6 text-gray-700 text-center">Your registration request has been submitted successfully.<br />We appreciate your effort to join the Orphanage Information System. Our team will review your submission and contact you soon.</p>
        <Link href="/">
          <button className="bg-blue-600 text-white px-6 py-2 rounded text-lg">Go to Home</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar with OIMS and Login only */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="w-full px-4 md:px-8 flex h-16 items-center justify-between">
          <Link href="/" className="font-bold text-3xl text-blue-700 underline">
            OIMS
          </Link>
          <Link href="/login">
            <button className="border border-blue-600 text-blue-700 px-4 py-2 rounded hover:bg-blue-50">Sign In</button>
          </Link>
        </div>
      </header>
      <div className="w-full max-w-[1600px] mx-auto p-4 md:p-8 bg-white rounded shadow mt-8 flex flex-col md:flex-row gap-8 min-h-[80vh] animate-fade-in items-stretch">
        {/* Left: Instruction Cards */}
        <div className="flex-1 flex flex-col justify-start h-full">
          <div className="flex flex-col h-full justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-black-800 animate-slide-down mt-0">How to Register Your Orphanage</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded p-4 shadow-md hover:scale-105 transition-transform duration-300 animate-pop-in">
                  <div>
                    <div className="font-bold text-blue-700 mb-1">1. Prepare Your Details</div>
                    <div>Gather your personal and center details, including a valid government certificate in PDF format.</div>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded p-4 shadow-md hover:scale-105 transition-transform duration-300 animate-pop-in delay-100">
                  <div>
                    <div className="font-bold text-blue-700 mb-1">2. Fill the Form</div>
                    <div>Enter accurate information in all required fields. Ensure your email and phone number follow the specified format.</div>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded p-4 shadow-md hover:scale-105 transition-transform duration-300 animate-pop-in delay-200">
                  <div>
                    <div className="font-bold text-blue-700 mb-1">3. Upload Certificate</div>
                    <div>Upload a government-issued certificate (PDF only) to verify your orphanage's legitimacy.</div>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded p-4 shadow-md hover:scale-105 transition-transform duration-300 animate-pop-in delay-300">
                  <div>
                    <div className="font-bold text-blue-700 mb-1">4. Submit & Await Review</div>
                    <div>Your request will be reviewed by our team. You will be notified via email once approved or if more information is needed.</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-2 text-black-800 animate-slide-down mt-0">Why Register for OIMS</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-100 border border-blue-300 rounded p-4 shadow-md flex items-start gap-3 min-h-[120px] transition-transform duration-300 hover:scale-105 active:scale-105 cursor-pointer">
                  <span className="text-blue-700 text-2xl font-bold">1</span>
                  <div>
                    <div className="font-semibold text-blue-800 mb-1">Access a Secure Platform</div>
                    <div>Access a secure and organized platform for managing your orphanage's data.</div>
                  </div>
                </div>
                <div className="bg-blue-100 border border-blue-300 rounded p-4 shadow-md flex items-start gap-3 min-h-[120px] transition-transform duration-300 hover:scale-105 active:scale-105 cursor-pointer">
                  <span className="text-blue-700 text-2xl font-bold">2</span>
                  <div>
                    <div className="font-semibold text-blue-800 mb-1">Connect Efficiently</div>
                    <div>Connect with donors, volunteers, and support networks more efficiently.</div>
                  </div>
                </div>
                <div className="bg-blue-100 border border-blue-300 rounded p-4 shadow-md flex items-start gap-3 min-h-[120px] transition-transform duration-300 hover:scale-105 active:scale-105 cursor-pointer">
                  <span className="text-blue-700 text-2xl font-bold">3</span>
                  <div>
                    <div className="font-semibold text-blue-800 mb-1">Analytics & Reporting</div>
                    <div>Benefit from analytics and reporting tools to improve your operations.</div>
                  </div>
                </div>
                <div className="bg-blue-100 border border-blue-300 rounded p-4 shadow-md flex items-start gap-3 min-h-[120px] transition-transform duration-300 hover:scale-105 active:scale-105 cursor-pointer">
                  <span className="text-blue-700 text-2xl font-bold">4</span>
                  <div>
                    <div className="font-semibold text-blue-800 mb-1">Transparency & Trust</div>
                    <div>Enhance transparency and trust with stakeholders and the community.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right: Registration Form */}
        <div className="flex-1 animate-slide-up flex flex-col justify-start h-full">
          <h2 className="text-2xl font-bold mb-4 animate-slide-down">Orphanage Registration</h2>
          <form onSubmit={handleSubmit} className="animate-fade-in delay-200">
            {/* Personal Details Section */}
            <fieldset className="mb-6 p-4 border rounded border-blue-200 animate-pop-in">
              <legend className="font-semibold text-blue-700 px-2">Personal Details</legend>              <div className="mb-4 animate-fade-in delay-100">
                <label htmlFor="adminFullName" className="block font-semibold mb-1">Name</label>
                <input 
                  id="adminFullName"
                  type="text" 
                  name="adminFullName" 
                  value={form.adminFullName} 
                  onChange={handleChange} 
                  required 
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter your full name"
                  aria-label="Admin Full Name"
                />
              </div>
              <div className="mb-4 animate-fade-in delay-200">
                <label htmlFor="adminGender" className="block font-semibold mb-1">Gender</label>
                <select 
                  id="adminGender"
                  name="adminGender" 
                  value={form.adminGender} 
                  onChange={handleChange} 
                  required 
                  className="w-full border rounded px-3 py-2"
                  aria-label="Admin Gender"
                  title="Select your gender"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="mb-4 animate-fade-in delay-300">
                <label htmlFor="adminEmail" className="block font-semibold mb-1">Email</label>
                <input 
                  id="adminEmail"
                  type="email" 
                  name="adminEmail" 
                  value={form.adminEmail} 
                  onChange={handleChange} 
                  required 
                  className="w-full border rounded px-3 py-2" 
                  placeholder="e.g. example@email.com" 
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                  aria-label="Admin Email" 
                />
              </div>
              <div className="mb-4 animate-fade-in delay-400">
                <label htmlFor="adminPhoneNumber" className="block font-semibold mb-1">Phone Number</label>
                <input 
                  id="adminPhoneNumber"
                  type="tel" 
                  name="adminPhoneNumber" 
                  value={form.adminPhoneNumber} 
                  onChange={handleChange} 
                  required 
                  className="w-full border rounded px-3 py-2" 
                  placeholder="e.g. +254712345678" 
                  pattern="^\+\d{1,4}\d{9}$" 
                  maxLength={14}
                  aria-label="Admin Phone Number" 
                />
                <span className="text-xs text-gray-500">Format: +countrycode followed by 9 digits (e.g. +254712345678)</span>
              </div>
            </fieldset>
            {/* Center Details Section */}            <fieldset className="mb-6 p-4 border rounded border-green-200 animate-pop-in delay-200">
              <legend className="font-semibold text-green-700 px-2">Center Details</legend>
              <div className="mb-4 animate-fade-in delay-500">
                <label htmlFor="centerName" className="block font-semibold mb-1">Name of Center</label>
                <input 
                  id="centerName"
                  type="text" 
                  name="centerName" 
                  value={form.centerName} 
                  onChange={handleChange} 
                  required 
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter center name"
                  aria-label="Center Name"
                  title="Name of your orphanage center"
                />
              </div>
              <div className="mb-4 animate-fade-in delay-600">
                <label htmlFor="location" className="block font-semibold mb-1">Location</label>
                <input 
                  id="location"
                  type="text" 
                  name="location" 
                  value={form.location} 
                  onChange={handleChange} 
                  required 
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter center location"
                  aria-label="Location"
                  title="Location of your orphanage center"
                />
              </div>
            </fieldset>
            {/* Certificate Upload */}
            <div className="mb-4 animate-fade-in delay-700">
              <label htmlFor="certificate" className="block font-semibold mb-1">Government Certificate (PDF only)</label>
              <input 
                id="certificate"
                type="file" 
                name="certificate" 
                accept="application/pdf" 
                onChange={handleChange} 
                required 
                className="w-full"
                aria-label="Government Certificate"
                title="Upload your government certificate (PDF format only)" 
              />
            </div>
            {error && <div className="text-red-600 mb-2 animate-fade-in delay-800">{error}</div>}
            {success && <div className="text-green-600 mb-2 animate-fade-in delay-800">{success}</div>}
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded animate-pop-in delay-900">Submit</button>
          </form>
        </div>      </div>
      {/* Animation styles are moved to styles/animations.css */}
    </div>
  );
}
