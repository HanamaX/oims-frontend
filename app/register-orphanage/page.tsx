"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function OrphanageRegistrationForm() {
  type FormState = {
    personalName: string;
    gender: string;
    email: string;
    phone: string;
    centerName: string;
    placementRegion: string;
    certificate: File | null;
  };

  const [form, setForm] = useState<FormState>({
    personalName: "",
    gender: "",
    email: "",
    phone: "",
    centerName: "",
    placementRegion: "",
    certificate: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "certificate") {
      const file = files && files[0];
      if (file && file.type !== "application/pdf") {
        setError("Certificate must be a PDF file.");
        return;
      }
      setForm({ ...form, certificate: file });
      setError("");
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Email pattern check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    // Phone pattern check: +countrycode and 9 digits
    const phonePattern = /^\+\d{1,4}\d{9}$/;
    if (!phonePattern.test(form.phone)) {
      setError("Phone number must start with country code (e.g. +254) and have exactly 9 digits after the code.");
      return;
    }
    if (!form.certificate) {
      setError("Certificate is required.");
      return;
    }
    if (form.certificate.type !== "application/pdf") {
      setError("Certificate must be a PDF file.");
      return;
    }
    // TODO: Send form data to backend API
    setSuccess("");
    setShowThankYou(true);
    setForm({
      personalName: "",
      gender: "",
      email: "",
      phone: "",
      centerName: "",
      placementRegion: "",
      certificate: null,
    });
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
            <legend className="font-semibold text-blue-700 px-2">Personal Details</legend>
            <div className="mb-4 animate-fade-in delay-100">
              <label className="block font-semibold mb-1">Name</label>
              <input type="text" name="personalName" value={form.personalName} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div className="mb-4 animate-fade-in delay-200">
              <label className="block font-semibold mb-1">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="mb-4 animate-fade-in delay-300">
              <label className="block font-semibold mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" placeholder="e.g. example@email.com" pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" />
            </div>
            <div className="mb-4 animate-fade-in delay-400">
              <label className="block font-semibold mb-1">Phone Number</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className="w-full border rounded px-3 py-2" placeholder="e.g. +254712345678" pattern="^\+\d{1,4}\d{9}$" maxLength={14} />
              <span className="text-xs text-gray-500">Format: +countrycode followed by 9 digits (e.g. +254712345678)</span>
            </div>
          </fieldset>
          {/* Center Details Section */}
          <fieldset className="mb-6 p-4 border rounded border-green-200 animate-pop-in delay-200">
            <legend className="font-semibold text-green-700 px-2">Center Details</legend>
            <div className="mb-4 animate-fade-in delay-500">
              <label className="block font-semibold mb-1">Name of Center</label>
              <input type="text" name="centerName" value={form.centerName} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div className="mb-4 animate-fade-in delay-600">
              <label className="block font-semibold mb-1">Placement Region</label>
              <input type="text" name="placementRegion" value={form.placementRegion} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
            </div>
          </fieldset>
          {/* Certificate Upload */}
          <div className="mb-4 animate-fade-in delay-700">
            <label className="block font-semibold mb-1">Government Certificate (PDF only)</label>
            <input type="file" name="certificate" accept="application/pdf" onChange={handleChange} required className="w-full" />
          </div>
          {error && <div className="text-red-600 mb-2 animate-fade-in delay-800">{error}</div>}
          {success && <div className="text-green-600 mb-2 animate-fade-in delay-800">{success}</div>}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded animate-pop-in delay-900">Submit</button>
        </form>
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease both;
        }
        @keyframes slide-down {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slide-down 0.8s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes slide-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes pop-in {
          0% { transform: scale(0.8); opacity: 0; }
          80% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in {
          animation: pop-in 0.7s cubic-bezier(0.4,0,0.2,1) both;
        }
        .delay-100 { animation-delay: 0.1s !important; }
        .delay-200 { animation-delay: 0.2s !important; }
        .delay-300 { animation-delay: 0.3s !important; }
        .delay-400 { animation-delay: 0.4s !important; }
        .delay-500 { animation-delay: 0.5s !important; }
        .delay-600 { animation-delay: 0.6s !important; }
        .delay-700 { animation-delay: 0.7s !important; }
        .delay-800 { animation-delay: 0.8s !important; }
        .delay-900 { animation-delay: 0.9s !important; }
      `}</style>
    </div>
  );
}
