"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define available languages
export type AppLanguage = "en" | "sw"

// Create context type
type LanguageContextType = {
  language: AppLanguage
  setLanguage: (lang: AppLanguage) => void
  t: (key: string) => string
}





// Create translations object
const translations: Record<string, Record<AppLanguage, string>> = {
  
  // Supervisor Reports translations
  "supervisor.reports.title": {
    en: "Reports Management",
    sw: "Usimamizi wa Ripoti",
  },
  "supervisor.reports.description": {
    en: "Generate and analyze comprehensive reports for your branch operations",
    sw: "Unda na uchanganue ripoti za kina za shughuli za tawi lako",
  },
  
  // Orphanage Centres Page
  "superuser.dashboard.orphanageCentres": {
    en: "Orphanage Centres",
    sw: "Vituo vya Watoto Yatima",
  },
  "orphanageCentres.title": {
    en: "Orphanage Centres",
    sw: "Vituo vya Watoto Yatima",
  },
  "orphanageCentres.subtitle": {
    en: "Manage and monitor all registered orphanage centres",
    sw: "Simamia na fuatilia vituo vyote vya watoto yatima vilivyosajiliwa",
  },
  "orphanageCentres.loading": {
    en: "Loading centres...",
    sw: "Inapakia vituo...",
  },
  "orphanageCentres.errorTitle": {
    en: "Failed to load centres",
    sw: "Imeshindwa kupakia vituo",
  },
  "orphanageCentres.tryAgain": {
    en: "Try Again",
    sw: "Jaribu Tena",
  },
  "orphanageCentres.search": {
    en: "Search by name or location...",
    sw: "Tafuta kwa jina au eneo...",
  },
  "orphanageCentres.filterByStatus": {
    en: "Filter by status",
    sw: "Chuja kwa hali",
  },
  "orphanageCentres.status": {
    en: "Status",
    sw: "Hali",
  },
  "orphanageCentres.allCentres": {
    en: "All Centres",
    sw: "Vituo Vyote",
  },
  "orphanageCentres.active": {
    en: "Active",
    sw: "Amilifu",
  },
  "orphanageCentres.inactive": {
    en: "Inactive",
    sw: "Isiyoamilika",
  },
  "orphanageCentres.noCentresFound": {
    en: "No centres found",
    sw: "Hakuna vituo vilivyopatikana",
  },
  "orphanageCentres.adjustFilters": {
    en: "Try adjusting your filters to find what you're looking for",
    sw: "Jaribu kurekebisha vichujio vyako kupata unacho tafuta",
  },
  "orphanageCentres.noCentresYet": {
    en: "No orphanage centres have been registered yet",
    sw: "Hakuna vituo vya watoto yatima vilivyosajiliwa bado",
  },
  "orphanageCentres.showing": {
    en: "Showing",
    sw: "Inaonyesha",
  },
  "orphanageCentres.of": {
    en: "of",
    sw: "kati ya",
  },
  "orphanageCentres.centres": {
    en: "centres",
    sw: "vituo",
  },
  "orphanageCentres.name": {
    en: "Name",
    sw: "Jina",
  },
  "orphanageCentres.location": {
    en: "Location",
    sw: "Eneo",
  },
  "orphanageCentres.contact": {
    en: "Contact",
    sw: "Mawasiliano",
  },
  "orphanageCentres.createdDate": {
    en: "Created Date",
    sw: "Tarehe ya Kuundwa",
  },
  "orphanageCentres.actions": {
    en: "Actions",
    sw: "Vitendo",
  },
  "orphanageCentres.details": {
    en: "Details",
    sw: "Maelezo",
  },
  
  // Orphanage Centre Details Page
  "orphanageCentre.details.backToList": {
    en: "Back to Centres",
    sw: "Rudi kwenye Vituo",
  },
  "orphanageCentre.details.loading": {
    en: "Loading centre information...",
    sw: "Inapakia taarifa za kituo...",
  },
  "orphanageCentre.details.error": {
    en: "Error loading centre",
    sw: "Hitilafu katika kupakia kituo",
  },
  "orphanageCentre.details.notFound": {
    en: "Centre not found",
    sw: "Kituo hakikupatikana",
  },
  "orphanageCentre.details.tabDetails": {
    en: "Details",
    sw: "Maelezo",
  },
  "orphanageCentre.details.tabCertificate": {
    en: "Certificate",
    sw: "Cheti",
  },
  "orphanageCentre.details.tabLeaveRequests": {
    en: "Leave Requests",
    sw: "Maombi ya Likizo",
  },
  "orphanageCentre.details.centreInformation": {
    en: "Centre Information",
    sw: "Taarifa za Kituo",
  },
  "orphanageCentre.details.centreOverview": {
    en: "Centre Overview",
    sw: "Muhtasari wa Kituo",
  },
  "orphanageCentre.details.registrationInfo": {
    en: "Registration Information",
    sw: "Taarifa za Usajili",
  },
  "orphanageCentre.details.registrationNumber": {
    en: "Registration Number",
    sw: "Namba ya Usajili",
  },
  "orphanageCentre.details.registrationDate": {
    en: "Registration Date",
    sw: "Tarehe ya Usajili",
  },
  "orphanageCentre.details.contactInfo": {
    en: "Contact Information",
    sw: "Taarifa za Mawasiliano",
  },
  "orphanageCentre.details.phone": {
    en: "Phone",
    sw: "Simu",
  },
  "orphanageCentre.details.email": {
    en: "Email",
    sw: "Barua pepe",
  },
  "orphanageCentre.details.location": {
    en: "Location",
    sw: "Eneo",
  },
  "orphanageCentre.details.status": {
    en: "Status",
    sw: "Hali",
  },
  "orphanageCentre.details.active": {
    en: "Active",
    sw: "Amilifu",
  },
  "orphanageCentre.details.inactive": {
    en: "Inactive",
    sw: "Isiyoamilika",
  },
  "orphanageCentre.details.activateButton": {
    en: "Activate Centre",
    sw: "Washa Kituo",
  },
  "orphanageCentre.details.deactivateButton": {
    en: "Deactivate Centre",
    sw: "Zima Kituo",
  },
  "orphanageCentre.details.confirmStatusChange": {
    en: "Confirm Status Change",
    sw: "Thibitisha Mabadiliko ya Hali",
  },
  "orphanageCentre.details.statusChangeDescription": {
    en: "Are you sure you want to change the status of this centre? This will affect all operations at this centre.",
    sw: "Je, una uhakika unataka kubadilisha hali ya kituo hiki? Hii itaathiri shughuli zote katika kituo hiki.",
  },
  "orphanageCentre.details.deactivationReasonRequired": {
    en: "A reason is required when deactivating an orphanage centre",
    sw: "Sababu inahitajika wakati wa kuzima kituo cha watoto yatima",
  },
  "orphanageCentre.details.reason": {
    en: "Reason (optional)",
    sw: "Sababu (hiari)",
  },
  "orphanageCentre.details.cancel": {
    en: "Cancel",
    sw: "Ghairi",
  },
  "orphanageCentre.details.confirm": {
    en: "Confirm",
    sw: "Thibitisha",
  },
  "orphanageCentre.details.description": {
    en: "Description",
    sw: "Maelezo",
  },
  "orphanageCentre.details.noDescription": {
    en: "No description provided",
    sw: "Hakuna maelezo yaliyotolewa",
  },
  "orphanageCentre.details.registrationCertificate": {
    en: "Registration Certificate",
    sw: "Cheti cha Usajili",
  },
  "orphanageCentre.details.viewCertificateDescription": {
    en: "View or download the centre's official registration document",
    sw: "Tazama au pakua waraka wa usajili wa kituo",
  },
  "orphanageCentre.details.registrationDocumentFor": {
    en: "Registration document for",
    sw: "Waraka wa usajili wa",
  },
  "orphanageCentre.details.noCertificate": {
    en: "No certificate uploaded",
    sw: "Hakuna cheti kilichopakiwa",
  },
  "orphanageCentre.details.noCertificateDescription": {
    en: "This orphanage centre has not uploaded a registration certificate",
    sw: "Kituo hiki cha watoto yatima hakijapakia cheti cha usajili",
  },
  "orphanageCentre.details.viewFullSize": {
    en: "View Full Size",
    sw: "Tazama Ukubwa Kamili",
  },
  "orphanageCentre.details.downloadCertificate": {
    en: "Download Certificate",
    sw: "Pakua Cheti",
  },
  
  // Orphanage Centre Leave Requests
  "orphanageCentre.leaveRequests.title": {
    en: "Staff Leave Requests",
    sw: "Maombi ya Likizo ya Wafanyakazi",
  },
  "orphanageCentre.leaveRequests.empty": {
    en: "No leave requests found",
    sw: "Hakuna maombi ya likizo yaliyopatikana",
  },
  "orphanageCentre.leaveRequests.loading": {
    en: "Loading leave requests...",
    sw: "Inapakia maombi ya likizo...",
  },
  "orphanageCentre.leaveRequests.status.pending": {
    en: "Pending",
    sw: "Inasubiri",
  },
  "orphanageCentre.leaveRequests.status.approved": {
    en: "Approved",
    sw: "Imeidhinishwa",
  },
  "orphanageCentre.leaveRequests.status.rejected": {
    en: "Rejected",
    sw: "Imekataliwa",
  },
  "orphanageCentre.leaveRequests.type": {
    en: "Type",
    sw: "Aina",
  },
  "orphanageCentre.leaveRequests.date": {
    en: "Request Date",
    sw: "Tarehe ya Ombi",
  },
  "orphanageCentre.leaveRequests.staff": {
    en: "Staff Member",
    sw: "Mfanyakazi",
  },
  "orphanageCentre.leaveRequests.dateRange": {
    en: "Leave Period",
    sw: "Kipindi cha Likizo",
  },
  "orphanageCentre.leaveRequests.actions": {
    en: "Actions",
    sw: "Vitendo",
  },
  "orphanageCentre.leaveRequests.view": {
    en: "View",
    sw: "Tazama",
  },
  "orphanageCentre.leaveRequests.approve": {
    en: "Approve",
    sw: "Idhinisha",
  },
  "orphanageCentre.leaveRequests.reject": {
    en: "Reject",
    sw: "Kataa",
  },
  "orphanageCentre.leaveRequests.viewRequest": {
    en: "View Leave Request",
    sw: "Tazama Ombi la Likizo",
  },
  "orphanageCentre.leaveRequests.confirmProcessing": {
    en: "Confirm Leave Request Processing",
    sw: "Thibitisha Usindikaji wa Ombi la Likizo",
  },
  "orphanageCentre.leaveRequests.confirmApproval": {
    en: "Are you sure you want to approve this leave request?",
    sw: "Je, una uhakika unataka kuidhinisha ombi hili la likizo?",
  },
  "orphanageCentre.leaveRequests.confirmRejection": {
    en: "Are you sure you want to reject this leave request?",
    sw: "Je, una uhakika unataka kukataa ombi hili la likizo?",
  },
  "orphanageCentre.leaveRequests.comments": {
    en: "Comments (optional)",
    sw: "Maoni (hiari)",
  },
  "orphanageCentre.leaveRequests.success": {
    en: "Leave request processed successfully",
    sw: "Ombi la likizo limesindikwa kwa mafanikio",
  },
  "orphanageCentre.leaveRequests.error": {
    en: "Failed to process leave request",
    sw: "Imeshindwa kusindika ombi la likizo",
  },
  
  // Superuser Leave Requests Page
  "leaveRequests.title": {
    en: "Leave Requests",
    sw: "Maombi ya Likizo",
  },
  "leaveRequests.subtitle": {
    en: "Review and process orphanage centre leave requests",
    sw: "Kagua na sindika maombi ya likizo ya vituo vya watoto yatima",
  },
  "leaveRequests.loading": {
    en: "Loading leave requests...",
    sw: "Inapakia maombi ya likizo...",
  },
  "leaveRequests.search": {
    en: "Search by centre name, admin name, or location...",
    sw: "Tafuta kwa jina la kituo, jina la msimamizi, au eneo...",
  },
  "leaveRequests.status": {
    en: "Status",
    sw: "Hali",
  },
  "leaveRequests.allRequests": {
    en: "All Requests",
    sw: "Maombi Yote",
  },
  "leaveRequests.status.pending": {
    en: "Pending",
    sw: "Inasubiri",
  },
  "leaveRequests.status.approved": {
    en: "Approved",
    sw: "Imeidhinishwa",
  },
  "leaveRequests.status.rejected": {
    en: "Rejected",
    sw: "Imekataliwa",
  },
  "leaveRequests.noRequestsFound": {
    en: "No leave requests found",
    sw: "Hakuna maombi ya likizo yaliyopatikana",
  },
  "leaveRequests.adjustFilters": {
    en: "Try adjusting your filters to find what you're looking for",
    sw: "Jaribu kurekebisha vichujio vyako kupata unachokitafuta",
  },
  "leaveRequests.noRequestsYet": {
    en: "No leave requests have been submitted yet",
    sw: "Hakuna maombi ya likizo yaliyowasilishwa bado",
  },
  "leaveRequests.showing": {
    en: "Showing",
    sw: "Inaonyesha",
  },
  "leaveRequests.of": {
    en: "of",
    sw: "kati ya",
  },
  "leaveRequests.requests": {
    en: "requests",
    sw: "maombi",
  },
  "leaveRequests.table.centre": {
    en: "Centre",
    sw: "Kituo",
  },
  "leaveRequests.table.admin": {
    en: "Administrator",
    sw: "Msimamizi",
  },
  "leaveRequests.table.requestDate": {
    en: "Request Date",
    sw: "Tarehe ya Ombi",
  },
  "leaveRequests.table.status": {
    en: "Status",
    sw: "Hali",
  },
  "leaveRequests.table.actions": {
    en: "Actions",
    sw: "Vitendo",
  },
  "leaveRequests.actions.view": {
    en: "View",
    sw: "Tazama",
  },
  "leaveRequests.actions.approve": {
    en: "Approve",
    sw: "Idhinisha",
  },
  "leaveRequests.actions.reject": {
    en: "Reject",
    sw: "Kataa",
  },
  "leaveRequests.actions.close": {
    en: "Close",
    sw: "Funga",
  },
  "leaveRequests.details.title": {
    en: "Leave Request Details",
    sw: "Maelezo ya Ombi la Likizo",
  },
  "leaveRequests.details.centreInfo": {
    en: "Centre Information",
    sw: "Taarifa za Kituo",
  },
  "leaveRequests.details.centreName": {
    en: "Centre Name",
    sw: "Jina la Kituo",
  },
  "leaveRequests.details.centreLocation": {
    en: "Location",
    sw: "Eneo",
  },
  "leaveRequests.details.centreStatus": {
    en: "Centre Status",
    sw: "Hali ya Kituo",
  },
  "leaveRequests.details.active": {
    en: "Active",
    sw: "Amilifu",
  },
  "leaveRequests.details.inactive": {
    en: "Inactive",
    sw: "Isiyoamilika",
  },
  "leaveRequests.details.adminInfo": {
    en: "Administrator Information",
    sw: "Taarifa za Msimamizi",
  },
  "leaveRequests.details.adminName": {
    en: "Name",
    sw: "Jina",
  },
  "leaveRequests.details.adminEmail": {
    en: "Email",
    sw: "Barua pepe",
  },
  "leaveRequests.details.adminPhone": {
    en: "Phone",
    sw: "Simu",
  },
  "leaveRequests.details.requestInfo": {
    en: "Request Information",
    sw: "Taarifa za Ombi",
  },
  "leaveRequests.details.requestDate": {
    en: "Request Date",
    sw: "Tarehe ya Ombi",
  },
  "leaveRequests.details.requestStatus": {
    en: "Status",
    sw: "Hali",
  },
  "leaveRequests.details.reason": {
    en: "Reason",
    sw: "Sababu",
  },
  "leaveRequests.details.rejectionReason": {
    en: "Rejection Reason",
    sw: "Sababu ya Kukataa",
  },
  "leaveRequests.process.approveTitle": {
    en: "Approve Leave Request",
    sw: "Idhinisha Ombi la Likizo",
  },
  "leaveRequests.process.rejectTitle": {
    en: "Reject Leave Request",
    sw: "Kataa Ombi la Likizo",
  },
  "leaveRequests.process.approveDescription": {
    en: "Are you sure you want to approve this leave request? This will deactivate the orphanage centre.",
    sw: "Je, una uhakika unataka kuidhinisha ombi hili la kujitoa? Hii itazima kituo cha watoto yatima.",
  },
  "leaveRequests.process.rejectDescription": {
    en: "Please provide a reason for rejecting this leave request.",
    sw: "Tafadhali toa sababu ya kukataa ombi hili la likizo.",
  },
  "leaveRequests.process.rejectionReason": {
    en: "Rejection Reason",
    sw: "Sababu ya Kukataa",
  },
  "leaveRequests.process.rejectionReasonPlaceholder": {
    en: "Enter the reason for rejecting this request...",
    sw: "Ingiza sababu ya kukataa ombi hili...",
  },
  "leaveRequests.process.processing": {
    en: "Processing...",
    sw: "Inasindika...",
  },
  "leaveRequests.success.approve": {
    en: "Leave request approved successfully",
    sw: "Ombi la likizo limeidhinishwa kwa mafanikio",
  },
  "leaveRequests.success.reject": {
    en: "Leave request rejected successfully",
    sw: "Ombi la likizo limekataliwa kwa mafanikio",
  },
  "leaveRequests.error.fetch": {
    en: "Failed to load leave requests",
    sw: "Imeshindwa kupakia maombi ya likizo",
  },
  "leaveRequests.error.approve": {
    en: "Failed to approve leave request",
    sw: "Imeshindwa kuidhinisha ombi la likizo",
  },
  "leaveRequests.error.reject": {
    en: "Failed to reject leave request",
    sw: "Imeshindwa kukataa ombi la likizo",
  },
  "leaveRequests.error.reasonRequired": {
    en: "Rejection reason is required",
    sw: "Sababu ya kukataa inahitajika",
  },
    
  // Navigation translations
  "nav.profile": {
    en: "My Profile",
    sw: "Wasifu Wangu",
  },
    
  // Profile page translations
  "profile.title": {
    en: "My Profile",
    sw: "Wasifu Wangu",
  },
  "profile.tab.info": {
    en: "Profile Information",
    sw: "Taarifa za Wasifu",
  },
  "profile.tab.password": {
    en: "Change Password",
    sw: "Badilisha Nenosiri",
  },
  "profile.view.title": {
    en: "Personal Information",
    sw: "Taarifa Binafsi",
  },
  "profile.view.description": {
    en: "View and manage your profile information",
    sw: "Tazama na simamia taarifa za wasifu wako",
  },
  "profile.button.edit": {
    en: "Edit Profile",
    sw: "Hariri Wasifu",
  },
  "profile.label.fullName": {
    en: "Full Name",
    sw: "Jina Kamili",
  },
  "profile.label.username": {
    en: "Username",
    sw: "Jina la Mtumiaji",
  },
  "profile.label.email": {
    en: "Email Address",
    sw: "Anwani ya Barua Pepe",
  },
  "profile.label.phone": {
    en: "Phone Number",
    sw: "Namba ya Simu",
  },
  "profile.label.phoneOptional": {
    en: "Phone Number (Optional)",
    sw: "Namba ya Simu (Hiari)",
  },
  "profile.label.gender": {
    en: "Gender",
    sw: "Jinsia",
  },
  "profile.gender.male": {
    en: "Male",
    sw: "Mwanamume",
  },
  "profile.gender.female": {
    en: "Female",
    sw: "Mwanamke",
  },
  "profile.gender.other": {
    en: "Other",
    sw: "Nyingine",
  },
  "profile.gender.preferNot": {
    en: "Prefer Not to Say",
    sw: "Napendelea Kutosema",
  },  "profile.label.role": {
    en: "Role",
    sw: "Wajibu",
  },
  "profile.role.orphanageAdmin": {
    en: "Orphanage Admin",
    sw: "Msimamizi wa Kituo",
  },
  "profile.role.supervisor": {
    en: "Supervisor",
    sw: "Msimamizi",
  },
  "profile.role.volunteer": {
    en: "Volunteer",
    sw: "Kujitolea",
  },
  "profile.role.donor": {
    en: "Donor",
    sw: "Mfadhili",
  },
  "profile.notSpecified": {
    en: "Not Specified",
    sw: "Haijabainishwa",
  },
  "profile.label.branch": {
    en: "Branch",
    sw: "Tawi",
  },
  "profile.label.created": {
    en: "Account Created",
    sw: "Akaunti Imeundwa",
  },
  "profile.label.profileImage": {
    en: "Profile Image",
    sw: "Picha ya Wasifu",
  },
  "profile.button.save": {
    en: "Save Changes",
    sw: "Hifadhi Mabadiliko",
  },
  "profile.button.cancel": {
    en: "Cancel",
    sw: "Ghairi",
  },
  "profile.button.updating": {
    en: "Updating...",
    sw: "Inasasisha...",
  },
  "profile.loading": {
    en: "Loading profile...",
    sw: "Inapakia wasifu...",
  },
  "profile.success.update": {
    en: "Profile updated successfully",
    sw: "Wasifu umesasishwa kwa mafanikio",
  },
  "profile.image.upload.click": {
    en: "Click to upload image",
    sw: "Bofya kupakia picha",
  },
  "profile.image.upload.formats": {
    en: "JPG, JPEG, PNG (max. 4MB)",
    sw: "JPG, JPEG, PNG (max. 4MB)",
  },
  "profile.image.error.invalid": {
    en: "Invalid image format or file too large",
    sw: "Muundo wa picha usio sahihi au faili kubwa mno",
  },
  "profile.image.error.upload": {
    en: "Failed to upload image. Please try again.",
    sw: "Imeshindwa kupakia picha. Tafadhali jaribu tena.",
  },
  "profile.image.error.size": {
    en: "Image file is too large (max 4MB)",
    sw: "Faili la picha ni kubwa mno (kiwango cha juu ni 4MB)",
  },
  "profile.error.name": {
    en: "Full name is required",
    sw: "Jina kamili linahitajika",
  },
  "profile.error.email": {
    en: "Email address is required",
    sw: "Anwani ya barua pepe inahitajika",
  },
  "profile.error.gender": {
    en: "Gender is required",
    sw: "Jinsia inahitajika",
  },
  "profile.password.title": {
    en: "Change Password",
    sw: "Badilisha Nenosiri",
  },
  "profile.password.description": {
    en: "Update your password to keep your account secure",
    sw: "Sasisha nenosiri lako ili kuweka akaunti yako salama",
  },
  "profile.password.label.current": {
    en: "Current Password",
    sw: "Nenosiri la Sasa",
  },
  "profile.password.label.new": {
    en: "New Password",
    sw: "Nenosiri Jipya",
  },
  "profile.password.label.confirm": {
    en: "Confirm Password",
    sw: "Thibitisha Nenosiri",
  },
  "profile.password.placeholder.current": {
    en: "Enter your current password",
    sw: "Ingiza nenosiri lako la sasa",
  },
  "profile.password.placeholder.new": {
    en: "Enter your new password",
    sw: "Ingiza nenosiri lako jipya",
  },
  "profile.password.placeholder.confirm": {
    en: "Confirm your new password",
    sw: "Thibitisha nenosiri lako jipya",
  },
  "profile.password.error.current": {
    en: "Current password is required",
    sw: "Nenosiri la sasa linahitajika",
  },
  "profile.password.error.new": {
    en: "New password is required",
    sw: "Nenosiri jipya linahitajika",
  },
  "profile.password.error.match": {
    en: "Passwords do not match",
    sw: "Manenosiri hayalingani",
  },
  "profile.password.error.length": {
    en: "Password must be at least 8 characters",
    sw: "Nenosiri lazima liwe na angalau herufi 8",
  },
  "profile.password.error.update": {
    en: "Failed to update password. Please check your current password and try again.",
    sw: "Imeshindwa kusasisha nenosiri. Tafadhali angalia nenosiri lako la sasa na ujaribu tena.",
  },
  "profile.password.success": {
    en: "Password updated successfully",
    sw: "Nenosiri limesasishwa kwa mafanikio",
  },
    
  // New staff management keys
  "staffManagement.title": {
    en: "Staff Overview",
    sw: "Muhtasari wa Wafanyakazi",
  },
  "staffManagement.description": {
    en: "Manage staff members across all branches",
    sw: "Simamia wafanyakazi katika matawi yote",
  },
  "staff.noStaffMembers": {
    en: "No Staff Members",
    sw: "Hakuna Wafanyakazi",
  },
  "staff.addStaffToGetStarted": {
    en: "Add staff members to get started",
    sw: "Ongeza wafanyakazi ili kuanza",
  },
  "staff.organizationLevel": {
    en: "Organization Level",
    sw: "Kiwango cha Shirika",
  },
  "staff.addNewStaffMember": {
    en: "Add New Staff Member",
    sw: "Ongeza Mfanyakazi Mpya",
  },
  "staff.enterEmailSelectBranchRole": {
    en: "Enter the email and select branch and role for the new staff member",
    sw: "Ingiza barua pepe na uchague tawi na jukumu la mfanyakazi mpya",
  },
  "ui.edit": {
    en: "Edit",
    sw: "Hariri",
  },
  "ui.delete": {
    en: "Delete",
    sw: "Futa",
  },
  "ui.tryAgain": {
    en: "Try Again",
    sw: "Jaribu Tena",
  },
  
  // Alerts
  "alerts.areYouSure": {
    en: "Are you absolutely sure?",
    sw: "Je, una uhakika kabisa?",
  },

  // Navigation
  "nav.home": {
    en: "Home",
    sw: "Nyumbani",
  },
  "nav.about": {
    en: "About Us",
    sw: "Kuhusu Sisi",
  },
  "nav.login": {
    en: "Sign In",
    sw: "Ingia",
  },
  "nav.logout": {
    en: "Log out",
    sw: "Toka",
  },  "nav.superuser": {
    en: "Superuser",
    sw: "Mtumiaji mkuu"
  },
  "nav.register": {
    en: "Register",
    sw: "Sajili"
  },

  // Dashboard
  "dashboard.title": {
    en: "Dashboard",
    sw: "Dashibodi",
  },
  "dashboard.orphans": {
    en: "Orphan Management",
    sw: "Usimamizi wa Yatima",
  },
  "dashboard.inventory": {
    en: "Inventory Management",
    sw: "Usimamizi wa Bidhaa",
  },
  "dashboard.fundraisers": {
    en: "Fundraiser Management",
    sw: "Usimamizi wa Michango",
  },
  "dashboard.volunteers": {
    en: "Volunteer Management",
    sw: "Usimamizi wa Kujitolea",
  },
  "dashboard.center": {
    en: "Center Management",
    sw: "Usimamizi wa Kituo",
  },
  "dashboard.branches": {
    en: "Branch Management",
    sw: "Usimamizi wa Matawi",
  },
  "dashboard.staff": {
    en: "Staff Management",
    sw: "Usimamizi wa Wafanyakazi",
  },  "dashboard.settings": {
    en: "Settings",
    sw: "Mipangilio",
  },
  "dashboard.centerManagement": {
    en: "Center Management",
    sw: "Usimamizi wa Kituo",
  },
  "dashboard.reports": {
    en: "Reports",
    sw: "Ripoti",
  },
  // Forms
  "form.submit": {
    en: "Submit",
    sw: "Wasilisha",
  },
  "form.cancel": {
    en: "Cancel",
    sw: "Ghairi",
  },
  "form.save": {
    en: "Save",
    sw: "Hifadhi",
  },
  "form.edit": {
    en: "Edit",
    sw: "Hariri",
  },
  "form.delete": {
    en: "Delete",
    sw: "Futa",
  },

  // Common UI elements
  "common.error": {
    en: "Error",
    sw: "Hitilafu",
  },
  "common.success": {
    en: "Success",
    sw: "Mafanikio",
  },
  "common.cancel": {
    en: "Cancel",
    sw: "Ghairi",
  },
  "common.creating": {
    en: "Creating...",
    sw: "Inaunda...",
  },  "common.updating": {
    en: "Updating...",
    sw: "Inasasisha...",
  },
  "common.email": {
    en: "Email",
    sw: "Barua pepe",
  },
  "common.branch": {
    en: "Branch",
    sw: "Tawi",
  },
  "common.role": {
    en: "Role",
    sw: "Jukumu",
  },
  "common.adding": {
    en: "Adding...",
    sw: "Inaongeza...",
  },
  "common.createdDate": {
    en: "Created Date",
    sw: "Tarehe ya Kuundwa",
  },
  "common.notAvailable": {
    en: "N/A",
    sw: "Hakipatikani",
  },
  "common.showing": {
    en: "Showing",
    sw: "Inaonyesha",
  },
  "common.of": {
    en: "of",
    sw: "kati ya",
  },
  // Center Management specific translations
  "centerManagement.title": {
    en: "Center Management",
    sw: "Usimamizi wa Kituo",
  },
  "centerManagement.loadingMessage": {
    en: "Loading center information...",
    sw: "Inapakia taarifa za kituo...",
  },
  "centerManagement.description": {
    en: "Manage your orphanage center and branches",
    sw: "Simamia kituo chako cha yatima na matawi",
  },
  "centerManagement.description.exists": {
    en: "View details of your orphanage center and branches",
    sw: "Tazama maelezo ya kituo chako cha yatima na matawi",
  },
  "centerManagement.description.create": {
    en: "Create your main orphanage center",
    sw: "Unda kituo chako kikuu cha yatima",
  },
  "centerManagement.readOnlyMode": {
    en: "Read-Only Mode: Center information can only be viewed",
    sw: "Hali ya Kusoma Tu: Taarifa za kituo zinaweza kuonwa tu",
  },
  "centerManagement.readOnlyModeDescription": {
    en: "As a supervisor, you can view but not modify center information",
    sw: "Kama msimamizi, unaweza kuona lakini si kubadilisha taarifa za kituo",
  },
  "centerManagement.tabs.overview": {
    en: "Overview",
    sw: "Muhtasari",
  },
  "centerManagement.tabs.branches": {
    en: "Branches",
    sw: "Matawi",
  },
  "centerManagement.tabs.staff": {
    en: "Staff",
    sw: "Wafanyakazi",
  },
  "centerManagement.viewOnly": {
    en: "Read-Only Mode",
    sw: "Hali ya Kusoma Tu",
  },
  "centerManagement.loading": {
    en: "Loading center information...",
    sw: "Inapakia taarifa za kituo...",
  },
  
  // Center Management Leave Request translations
  "centerManagement.leaveRequest.title": {
    en: "Request Centre Leave",
    sw: "Omba Likizo ya Kituo",
  },
  "centerManagement.leaveRequest.description": {
    en: "Submit a request to temporarily close or leave your orphanage centre. This request will be reviewed by the administrators.",
    sw: "Wasilisha ombi la kufunga au kuacha kituo chako cha watoto yatima kwa muda. Ombi hili litakagulwa na wasimamizi.",
  },
  "centerManagement.leaveRequest.reasonLabel": {
    en: "Reason for Leave Request",
    sw: "Sababu ya Ombi la Likizo",
  },
  "centerManagement.leaveRequest.reasonPlaceholder": {
    en: "Please provide a detailed reason for your leave request...",
    sw: "Tafadhali toa sababu ya kina ya ombi lako la likizo...",
  },
  "centerManagement.leaveRequest.reasonNote": {
    en: "Please provide a clear and detailed explanation for your leave request.",
    sw: "Tafadhali toa maelezo ya wazi na ya kina ya ombi lako la likizo.",
  },
  "centerManagement.leaveRequest.submitButton": {
    en: "Submit Leave Request",
    sw: "Wasilisha Ombi la Likizo",
  },
  "centerManagement.leaveRequest.submitting": {
    en: "Submitting...",
    sw: "Inawasilisha...",
  },
  "centerManagement.leaveRequest.success": {
    en: "Leave request submitted successfully. You will be notified once it's reviewed.",
    sw: "Ombi la likizo limewasilishwa kwa mafanikio. Utajulishwa mara tu litakapokaguliwa.",
  },
  "centerManagement.leaveRequest.error": {
    en: "Unable to submit leave request. Centre information not found.",
    sw: "Imeshindikana kuwasilisha ombi la likizo. Taarifa za kituo hazijapatikana.",
  },
  "centerManagement.leaveRequest.reasonRequired": {
    en: "Please provide a reason for your leave request.",
    sw: "Tafadhali toa sababu ya ombi lako la likizo.",
  },
  "centerManagement.leaveRequest.submitError": {
    en: "Failed to submit leave request. Please try again.",
    sw: "Imeshindikana kuwasilisha ombi la likizo. Tafadhali jaribu tena.",
  },

  // Center Overview specific translations  
  "centerOverview.createCenter": {
    en: "Create Center",
    sw: "Unda Kituo",
  },
  "centerOverview.createCenterDescription": {
    en: "Enter the details for your main orphanage center",
    sw: "Ingiza maelezo ya kituo chako kikuu cha yatima",
  },
  "centerOverview.editCenter": {
    en: "Edit Center",
    sw: "Hariri Kituo",
  },
  "centerOverview.editCenterDescription": {
    en: "Update the details for your orphanage center",
    sw: "Sasisha maelezo ya kituo chako cha yatima",
  },  "centerOverview.centerName": {
    en: "Center Name",
    sw: "Jina la Kituo",
  },
  "centerOverview.location": {
    en: "Location",
    sw: "Eneo",
  },
  "centerOverview.address": {
    en: "Address",
    sw: "Anwani",
  },
  "centerOverview.phoneNumber": {
    en: "Phone Number",
    sw: "Nambari ya Simu",
  },
  "centerOverview.email": {
    en: "Email",
    sw: "Barua pepe",
  },
  "centerOverview.description": {
    en: "Description",
    sw: "Maelezo",
  },
  "centerOverview.form.centerName": {
    en: "Center Name",
    sw: "Jina la Kituo",
  },
  "centerOverview.form.location": {
    en: "Location",
    sw: "Eneo",
  },
  "centerOverview.form.address": {
    en: "Address",
    sw: "Anwani",
  },
  "centerOverview.form.phoneNumber": {
    en: "Phone Number",
    sw: "Nambari ya Simu",
  },
  "centerOverview.form.email": {
    en: "Email",
    sw: "Barua pepe",
  },
  "centerOverview.form.description": {
    en: "Description",
    sw: "Maelezo",
  },
  "centerOverview.form.updateButton": {
    en: "Update Center",
    sw: "Sasisha Kituo",
  },
  "centerOverview.actions.editDetails": {
    en: "Edit Details",
    sw: "Hariri Maelezo",
  },
  "centerOverview.actions.leaveRequest": {
    en: "Request Leave",
    sw: "Omba Likizo",
  },
  "centerOverview.edit.title": {
    en: "Edit Center",
    sw: "Hariri Kituo",
  },
  "centerOverview.edit.description": {
    en: "Update the center's information",
    sw: "Sasisha taarifa za kituo",
  },
  "centerOverview.centerOverviewDescription": {
    en: "View and manage your orphanage center details below.",
    sw: "Tazama na simamia maelezo ya kituo chako cha yatima hapa chini.",
  },
  "centerOverview.readOnlyMode": {
    en: "You are viewing this center in read-only mode as a superuser.",
    sw: "Unatazama kituo hiki katika hali ya kusoma tu kama mtumiaji mkuu.",
  },
  "centerOverview.updateCenter": {
    en: "Update Center",
    sw: "Sasisha Kituo",
  },
  "centerOverview.centerOverview": {
    en: "Center Overview",
    sw: "Muhtasari wa Kituo",
  },

  // Staff translations
  "staff.staff": {
    en: "Staff",
    sw: "Wafanyakazi",
  },
  "staff.superAdmin": {
    en: "Super Admin",
    sw: "Mkuu wa Utawala",
  },
  "staff.admin": {
    en: "Admin",
    sw: "Msimamizi",
  },
  "staff.active": {
    en: "Active",
    sw: "Anafanya kazi",
  },
  "staff.suspended": {
    en: "Suspended",
    sw: "Amesimamishwa",
  },
  "staff.staffMembers": {
    en: "staff members",
    sw: "wafanyakazi",
  },
  "staff.totalStaff": {
    en: "Total Staff",
    sw: "Jumla ya Wafanyakazi",
  },
  "staff.activeStaffMembers": {
    en: "Active staff members",
    sw: "Wafanyakazi wanaofanya kazi",
  },
  "staff.orphanageAdministrators": {
    en: "Orphanage Administrators",
    sw: "Wasimamizi wa Yatima",
  },
  "staff.branchStaff": {
    en: "Branch Staff",
    sw: "Wafanyakazi wa Matawi",
  },
  "staff.noStaffAssigned": {
    en: "No staff assigned to this branch.",
    sw: "Hakuna wafanyakazi waliopangwa kwenye tawi hili.",
  },
  "staff.goToStaffManagement": {
    en: "Go to Staff Management to add staff members.",
    sw: "Nenda kwenye Usimamizi wa Wafanyakazi kuongeza wafanyakazi.",
  },

  // Branch translations
  "branch.branches": {
    en: "Branches",
    sw: "Matawi",
  },
  "branch.editBranch": {
    en: "Edit Branch",
    sw: "Hariri Tawi",
  },
  "branch.editBranchDescription": {
    en: "Update the details for this branch",
    sw: "Sasisha maelezo ya tawi hili",
  },
  "branch.branchName": {
    en: "Branch Name",
    sw: "Jina la Tawi",
  },
  "branch.isHeadquarters": {
    en: "Is Headquarters",
    sw: "Ni Makao Makuu",
  },
  "branch.headquarters": {
    en: "Headquarters",
    sw: "Makao Makuu",
  },
  "branch.totalBranches": {
    en: "Total Branches",
    sw: "Jumla ya Matawi",
  },
  "branch.activeBranches": {
    en: "Active branches",
    sw: "Matawi yanayofanya kazi",
  },
  "branch.branchManagement": {
    en: "Branch Management",
    sw: "Usimamizi wa Matawi",
  },
  "branch.readOnlyMode": {
    en: "Read-Only Mode: Branch information can only be viewed",
    sw: "Hali ya Kusoma Tu: Taarifa za matawi zinaweza kuonwa tu",
  },
  "branch.addNewBranch": {
    en: "Add New Branch",
    sw: "Ongeza Tawi Jipya",
  },
  "branch.enterBranchDetails": {
    en: "Enter the details for the branch",
    sw: "Ingiza maelezo ya tawi",
  },
  "branch.updateBranch": {
    en: "Update Branch",
    sw: "Sasisha Tawi",
  },
  "branch.addBranch": {
    en: "Add Branch",
    sw: "Ongeza Tawi",
  },
  "branch.noBranches": {
    en: "No Branches",
    sw: "Hakuna Matawi",
  },
  "branch.createFirstBranch": {
    en: "Create your first branch to get started.",
    sw: "Unda tawi lako la kwanza ili kuanza.",
  },  "branch.orphansInBranch": {
    en: "orphans in this branch",
    sw: "yatima katika tawi hili",
  },
  "branch.backToCenter": {
    en: "← Back to Center",
    sw: "← Rudi kwenye Kituo",
  },
  "branch.readOnlyModeMessage": {
    en: "🔒 Read-Only Mode: Branch information can only be viewed, not modified.",
    sw: "🔒 Hali ya Kusoma Tu: Taarifa za tawi zinaweza kuonwa tu, sio kubadilishwa.",
  },
  "branch.updateBranchButton": {
    en: "Update Branch",
    sw: "Sasisha Tawi",
  },
  "staff.readOnlyModeMessage": {
    en: "🔒 Read-Only Mode: Staff can only be viewed",
    sw: "🔒 Hali ya Kusoma Tu: Wafanyakazi wanaweza kuonwa tu",
  },
  "staff.viewStaffMessage": {
    en: "View staff members across all branches (Read-Only Mode)",
    sw: "Tazama wafanyakazi katika matawi yote (Hali ya Kusoma Tu)",
  },
  "common.readOnlyMode": {
    en: "Read-Only Mode",
    sw: "Hali ya Kusoma Tu",
  },
  "common.cannotModifyCenter": {
    en: "Center information cannot be modified in read-only mode",
    sw: "Taarifa za kituo haziwezi kubadilishwa katika hali ya kusoma tu",
  },
  "common.cannotModifyBranch": {
    en: "Branch information cannot be modified in read-only mode",
    sw: "Taarifa za tawi haziwezi kubadilishwa katika hali ya kusoma tu",
  },
  "common.cannotModifyStaff": {
    en: "Staff information cannot be modified in read-only mode",
    sw: "Taarifa za wafanyakazi haziwezi kubadilishwa katika hali ya kusoma tu",
  },

  // Thank you messages
  "thankyou.title": {
    en: "Thank You for Your Participation",
    sw: "Asante kwa Ushiriki Wako",
  },
  "thankyou.volunteer": {
    en: "Your volunteer registration has been received. We appreciate your willingness to help and will contact you soon with more details.",
    sw: "Usajili wako wa kujitolea umepokelewa. Tunashukuru kwa nia yako ya kusaidia na tutawasiliana nawe hivi karibuni kwa maelezo zaidi.",
  },
  "thankyou.fundraiser": {
    en: "Your fundraising campaign has been created. We appreciate your support in helping orphaned children.",
    sw: "Kampeni yako ya kukusanya fedha imeundwa. Tunashukuru kwa msaada wako katika kusaidia watoto yatima.",
  },
  "thankyou.home": {
    en: "Return to Home",
    sw: "Rudi Nyumbani",
  },

  // Branch
  "branch.readonly": {
    en: "Read Only",
    sw: "Kusoma Tu",
  },
  "branch.viewonly": {
    en: "View-only access to branch data",
    sw: "Ufikiaji wa kusoma tu kwa data ya tawi",
  },
  "branch.back": {
    en: "Back to Branch",
    sw: "Rudi kwenye Tawi",
  },
  "branch.backToBranches": {
    en: "Back to Branches",
    sw: "Rudi kwenye Matawi",
  },
  "branch.clickToView": {
    en: "Click to view details",
    sw: "Bofya kuona maelezo",
  },
  "branch.performance": {
    en: "Branch Performance",
    sw: "Utendaji wa Tawi",
  },
  "branch.metrics": {
    en: "Key metrics for",
    sw: "Vipimo muhimu vya",
  },
  "branch.orphanCapacity": {
    en: "Orphan Capacity",
    sw: "Uwezo wa Kuhudumia Yatima",
  },  "branch.orphans": {
    en: "orphans",
    sw: "yatima",
  },
  "branch.orphans.management": {
    en: "Orphan Management - Read Only",
    sw: "Usimamizi wa Yatima - Kusoma tu",
  },
  "branch.orphans.description": {
    en: "View orphan details for this branch. Superadmins cannot edit this data.",
    sw: "Angalia maelezo ya yatima kwa tawi hili. Wasimamizi wakuu hawawezi kuhariri data hii.",
  },
  "branch.backToBranch": {
    en: "Back to Branch",
    sw: "Rudi kwenye Tawi",
  },  "branch.all": {
    en: "All Branches",
    sw: "Matawi Yote",
  },
  "branch.label": {
    en: "Branch",
    sw: "Tawi",
  },
  "branch.inventoryStatus": {
    en: "Inventory Status",
    sw: "Hali ya Bidhaa",
  },
  "branch.items": {
    en: "items",
    sw: "bidhaa",
  },
  "branch.fundraisingProgress": {
    en: "Fundraising Progress",
    sw: "Maendeleo ya Ukusanyaji Fedha",
  },
  "branch.campaigns": {
    en: "campaigns",
    sw: "kampeni",
  },
  "branch.volunteerEngagement": {
    en: "Volunteer Engagement",
    sw: "Ushiriki wa Kujitolea",
  },
  "branch.volunteers": {
    en: "volunteers",
    sw: "wajitolea",
  },
  "branch.details": {
    en: "Branch Details",
    sw: "Maelezo ya Tawi",
  },
  "branch.information": {
    en: "Basic information about this branch",
    sw: "Taarifa za msingi kuhusu tawi hili",
  },
  "branch.name": {
    en: "Branch Name",
    sw: "Jina la Tawi",
  },
  "branch.location": {
    en: "Location",
    sw: "Mahali",
  },
  "branch.status": {
    en: "Status",
    sw: "Hali",
  },
  "branch.active": {
    en: "Active",
    sw: "Inafanya kazi",
  },
  "branch.lastUpdated": {
    en: "Last Updated",
    sw: "Imesasishwa mwisho",
  },

  // Staff
  "staff.description": {
    en: "Manage staff members across all branches",
    sw: "Simamia wafanyakazi katika matawi yote",
  },
  "staff.add": {
    en: "Add Staff",
    sw: "Ongeza Mfanyakazi",
  },
  "staff.addNew": {
    en: "Add New Staff Member",
    sw: "Ongeza Mfanyakazi Mpya",
  },
  "staff.enterDetails": {
    en: "Enter the details for the new staff member",
    sw: "Ingiza maelezo ya mfanyakazi mpya",
  },
  "staff.name": {
    en: "Full Name",
    sw: "Jina Kamili",
  },
  "staff.position": {
    en: "Position",
    sw: "Wadhifa",
  },
  "staff.email": {
    en: "Email",
    sw: "Barua pepe",
  },
  "staff.phone": {
    en: "Phone Number",
    sw: "Namba ya Simu",
  },
  "staff.department": {
    en: "Department",
    sw: "Idara",
  },
  "staff.joinDate": {
    en: "Join Date",
    sw: "Tarehe ya Kujiunga",
  },
  "staff.selectDepartment": {
    en: "Select a department",
    sw: "Chagua idara",
  },
  "staff.administration": {
    en: "Administration",
    sw: "Utawala",
  },
  "staff.childCare": {
    en: "Child Care",
    sw: "Huduma za Watoto",
  },
  "staff.education": {
    en: "Education",
    sw: "Elimu",
  },
  "staff.healthcare": {
    en: "Healthcare",
    sw: "Afya",
  },  "staff.finance": {
    en: "Finance",
    sw: "Fedha",
  },
  
  // Additional Staff Management translations
  "staff.management": {
    en: "Staff Management",
    sw: "Usimamizi wa Wafanyakazi",
  },
  "staff.loadingStaffInfo": {
    en: "Loading staff information...",
    sw: "Inapakia taarifa za wafanyakazi...",
  },
  "staff.createCenterFirst": {
    en: "You need to create a center first",
    sw: "Unahitaji kuunda kituo kwanza",
  },
  "staff.selectBranch": {
    en: "Please select a branch",
    sw: "Tafadhali chagua tawi",
  },
  "staff.adminCreatedSuccessfully": {
    en: "Admin created successfully",
    sw: "Msimamizi ameundwa kwa mafanikio",
  },
  "staff.failedToSaveAdmin": {
    en: "Failed to save admin. Please try again.",
    sw: "Kushindwa kuhifadhi msimamizi. Tafadhali jaribu tena.",
  },
  "staff.failedToSaveAdminInfo": {
    en: "Failed to save admin information",
    sw: "Kushindwa kuhifadhi taarifa za msimamizi",
  },
  "staff.profileView": {
    en: "Profile View",
    sw: "Mwonekano wa Wasifu",
  },
  "staff.staffEditOwnProfile": {
    en: "Staff members can only edit their own profiles from their account page.",
    sw: "Wafanyakazi wanaweza kubadilisha wasifu wao tu kutoka ukurasa wa akaunti yao.",
  },
  "staff.adminDeletedSuccessfully": {
    en: "Admin deleted successfully",
    sw: "Msimamizi amefutwa kwa mafanikio",
  },
  "staff.failedToDeleteAdmin": {
    en: "Failed to delete admin",
    sw: "Kushindwa kufuta msimamizi",
  },
  "staff.adminStatusUpdatedSuccessfully": {
    en: "Admin status updated successfully",
    sw: "Hali ya msimamizi imesasishwa kwa mafanikio",
  },
  "staff.failedToUpdateAdminStatus": {
    en: "Failed to update admin status",
    sw: "Kushindwa kusasisha hali ya msimamizi",
  },
  "staff.noCenterFound": {
    en: "No Center Found",
    sw: "Hakuna Kituo Kilichopatikana",
  },
  "staff.createCenterBeforeStaff": {
    en: "You need to create an orphanage center before you can manage staff.",
    sw: "Unahitaji kuunda kituo cha yatima kabla ya kusimamia wafanyakazi.",
  },
  "staff.createCenter": {
    en: "Create Center",
    sw: "Unda Kituo",
  },
  "staff.noBranchesFound": {
    en: "No Branches Found",
    sw: "Hakuna Matawi Yaliyopatikana",
  },
  "staff.createBranchBeforeStaff": {
    en: "You need to create at least one branch before you can manage staff.",
    sw: "Unahitaji kuunda angalau tawi moja kabla ya kusimamia wafanyakazi.",
  },
  "staff.createBranch": {
    en: "Create Branch",
    sw: "Unda Tawi",
  },
  "staff.enterStaffDetails": {
    en: "Enter the details of the staff member",
    sw: "Ingiza maelezo ya mfanyakazi",
  },
  "staff.branch": {
    en: "Branch",
    sw: "Tawi",
  },
  "staff.role": {
    en: "Role",
    sw: "Jukumu",
  },
  "staff.selectRole": {
    en: "Select Role",
    sw: "Chagua Jukumu",
  },
  "staff.supervisor": {
    en: "Supervisor",
    sw: "Msimamizi",
  },
  "staff.orphanageAdmin": {
    en: "Orphanage Admin",
    sw: "Msimamizi wa Kituo",
  },
  "staff.adding": {
    en: "Adding...",
    sw: "Inaongeza...",
  },
  "staff.addStaff": {
    en: "Add Staff",
    sw: "Ongeza Mfanyakazi",
  },
  "staff.noStaffMembersFound": {
    en: "No staff members found. Add your first staff member to get started.",
    sw: "Hakuna wafanyakazi waliopatikana. Ongeza mfanyakazi wako wa kwanza ili kuanza.",
  },
  "staff.notAssigned": {
    en: "Not Assigned",
    sw: "Haijapangwa",
  },
  "staff.noBranchAssigned": {
    en: "No Branch Assigned",
    sw: "Hakuna Tawi Lililolipangwa",
  },
  "staff.inactive": {
    en: "Inactive",
    sw: "Hafanyi kazi",
  },
  "staff.gender": {
    en: "Gender",
    sw: "Jinsia",
  },
  "staff.notSpecified": {
    en: "Not Specified",
    sw: "Haijabainishwa",
  },
  "staff.accountStatus": {
    en: "Account Status",
    sw: "Hali ya Akaunti",
  },
  "staff.accountCreated": {
    en: "Account Created",
    sw: "Akaunti Imeundwa",
  },
  "staff.manageStatus": {
    en: "Manage Status",
    sw: "Simamia Hali",
  },
  "staff.confirmAdminDeletion": {
    en: "Confirm Admin Deletion",
    sw: "Thibitisha Kufutwa kwa Msimamizi",
  },
  "staff.deleteConfirmationMessage": {
    en: "Are you sure you want to delete staff member",
    sw: "Je, una uhakika unataka kumfuta mfanyakazi",
  },
  "staff.deleteWarningMessage": {
    en: "This action cannot be undone and will permanently remove their account and access to the system.",
    sw: "Kitendo hiki hakiwezi kubadilishwa na kitafuta kabisa akaunti yao na ufikiaji wa mfumo.",
  },
  "staff.deleteAdmin": {
    en: "Delete Admin",
    sw: "Futa Msimamizi",
  },
  "staff.updateAdminStatus": {
    en: "Update Admin Status",
    sw: "Sasisha Hali ya Msimamizi",
  },
  "staff.manageBranchAndStatus": {
    en: "Manage branch assignment and account status for",
    sw: "Simamia uhamisho wa tawi na hali ya akaunti kwa",
  },

  "staff.assignedBranch": {
    en: "Assigned Branch",
    sw: "Tawi Lililolipangwa",
  },
  "staff.selectStatus": {
    en: "Select Status",
    sw: "Chagua Hali",
  },
  "staff.orphanageAdminPermissions": {
    en: "Orphanage Admin Permissions",
    sw: "Ruhusa za Msimamizi wa Yatima",
  },
  "staff.orphanageAdminNote": {
    en: "Orphanage Admins don't need branch assignments as they have access to all branches. You can only modify the account status for Orphanage Admins.",
    sw: "Wasimamizi wa yatima hawahitaji upangaji wa matawi kwani wana ufikiaji wa matawi yote. Unaweza kubadilisha hali ya akaunti tu kwa Wasimamizi wa Yatima.",
  },
  "staff.supervisorNote": {
    en: "You can only modify the branch assignment and account status for this supervisor. To change other details, ask the supervisor to update their own profile.",
    sw: "Unaweza kubadilisha upangaji wa tawi na hali ya akaunti tu kwa msimamizi huyu. Kubadilisha maelezo mengine, mwombe msimamizi asasishe wasifu wake mwenyewe.",
  },
  "staff.suspendNote": {
    en: "Note: Suspending a staff member will prevent them from logging in but preserve their account data.",
    sw: "Kumbuka: Kusimamisha mfanyakazi kutamzuia kuingia lakini kutahifadhi data ya akaunti yake.",
  },

  // Orphan
  "orphan.age": {
    en: "Age",
    sw: "Umri",
  },
  "orphan.yearsOld": {
    en: "years old",
    sw: "miaka",
  },
  "orphan.dateOfBirth": {
    en: "Date of Birth",
    sw: "Tarehe ya Kuzaliwa",
  },  "orphan.hasProfileImage": {
    en: "Has Profile Image",
    sw: "Ana Picha ya Wasifu",
  },
  "orphan.orphans": {
    en: "Orphans",
    sw: "Yatima",
  },
  "orphan.gender": {
    en: "Gender",
    sw: "Jinsia",
  },
  "orphan.admitted": {
    en: "Date Admitted",
    sw: "Tarehe ya Kupokelewa",
  },
  "orphan.health": {
    en: "Health Status",
    sw: "Hali ya Afya",
  },  "orphan.education": {
    en: "Education Level",
    sw: "Kiwango cha Elimu",
  },
  "orphan.details": {
    en: "Orphan Details",
    sw: "Maelezo ya Yatima",
  },
  "orphan.academic.records": {
    en: "Academic Records",
    sw: "Rekodi za Elimu",
  },  "orphan.medical.records": {
    en: "Medical Records",
    sw: "Rekodi za Matibabu",
  },
  "orphan.medical.noRecords": {
    en: "No medical records found for this orphan.",
    sw: "Hakuna rekodi za matibabu zilizopatikana kwa huyu yatima.",
  },
  "orphan.medical.loadingRecords": {
    en: "Loading medical records...",
    sw: "Inapakia rekodi za matibabu...",
  },
  "orphan.medical.loadingDetails": {
    en: "Loading record details...",
    sw: "Inapakia maelezo ya rekodi...",
  },  "orphan.medical.tryAgain": {
    en: "Try Again",
    sw: "Jaribu Tena",
  },
  "orphan.medical.addRecord": {
    en: "Add Medical Record",
    sw: "Ongeza Rekodi ya Matibabu",
  },
  "orphan.medical.addNewRecord": {
    en: "Add New Medical Record",
    sw: "Ongeza Rekodi Mpya ya Matibabu",
  },
  "orphan.medical.hospital": {
    en: "Hospital",
    sw: "Hospitali",
  },
  "orphan.medical.treatment": {
    en: "Treatment",
    sw: "Matibabu",
  },
  "orphan.medical.notes": {
    en: "Notes",
    sw: "Maelezo",
  },
  "orphan.medical.followUpDate": {
    en: "Follow-up Date",
    sw: "Tarehe ya Ufuatiliaji",
  },
  "orphan.medical.viewDetails": {
    en: "View Details",
    sw: "Angalia Maelezo",
  },
  "orphan.loadingDetails": {
    en: "Loading orphan details...",
    sw: "Inapakia maelezo ya yatima...",
  },"orphan.branch": {
    en: "Branch",
    sw: "Tawi",
  },

  // UI Elements
  "ui.backToOrphans": {
    en: "Back to Orphans",
    sw: "Rudi kwa Yatima",
  },
  "supervisor.ui.backToOrphans": {
    en: "Back to Orphans",
    sw: "Rudi kwa Yatima",
  },
  "ui.goBack": {
    en: "Go Back",
    sw: "Rudi Nyuma",
  },
  "ui.unknown": {
    en: "Unknown",
    sw: "Haijulikani",
  },
  // Inventory
  "inventory.category": {
    en: "Category",
    sw: "Kategoria",
  },
  "inventory.branch": {
    en: "Branch",
    sw: "Tawi",
  },
  "inventory.quantity": {
    en: "Quantity",
    sw: "Kiasi",
  },
  "inventory.updated": {
    en: "Last Updated",
    sw: "Imesasishwa mwisho",
  },
  "inventory.management": {
    en: "Inventory Management",
    sw: "Usimamizi wa Bidhaa",
  },  "inventory.viewManage": {
    en: "View and manage all inventory items in the system",
    sw: "Angalia na simamia bidhaa zote kwenye mfumo",
  },
  "supervisor.inventory.viewManage": {
    en: "View and manage inventory items for your branch",
    sw: "Angalia na simamia bidhaa za tawi lako",
  },
  "inventory.addItem": {
    en: "Add Item",
    sw: "Ongeza Bidhaa",
  },
  "inventory.search": {
    en: "Search inventory...",
    sw: "Tafuta bidhaa...",
  },
  "inventory.filterByCategory": {
    en: "Filter by category",
    sw: "Chuja kwa kategoria",
  },
  "inventory.allCategories": {
    en: "All Categories",
    sw: "Kategoria Zote",
  },
  "inventory.loading": {
    en: "Loading inventory items...",
    sw: "Inapakia bidhaa...",
  },
  "inventory.tryAgain": {
    en: "Try Again",
    sw: "Jaribu Tena",
  },
  "inventory.price": {
    en: "Price",
    sw: "Bei",
  },
  
  // Inventory Form
  "inventory.form.title": {
    en: "Add New Inventory Item",
    sw: "Ongeza Bidhaa Mpya",
  },
  "inventory.form.instructions": {
    en: "Fill in the details to add a new item to the inventory. New items start with a quantity of zero. After creating the item, you can use the transaction system to manage quantities through \"IN\" and \"OUT\" transactions.",
    sw: "Jaza maelezo kuongeza bidhaa mpya kwenye orodha. Bidhaa mpya zinaanza na kiasi sifuri. Baada ya kuunda bidhaa, unaweza kutumia mfumo wa kufanyia shughuli kuongeza na kupunguza idadi kupitia miamala ya \"Kuingia\" na \"Kutoka\".",
  },
  "inventory.form.itemName": {
    en: "Item Name",
    sw: "Jina la Bidhaa",
  },
  "inventory.form.category": {
    en: "Category",
    sw: "Kategoria",
  },
  "inventory.form.selectCategory": {
    en: "Select category",
    sw: "Chagua kategoria",
  },
  "inventory.form.price": {
    en: "Price (Tshs)",
    sw: "Bei (Tshs)",
  },
  "inventory.form.minQuantity": {
    en: "Minimum Quantity",
    sw: "Kiasi cha Chini",
  },
  "inventory.form.description": {
    en: "Description",
    sw: "Maelezo",
  },
  "inventory.form.cancel": {
    en: "Cancel",
    sw: "Ghairi",
  },
  "inventory.form.addItem": {
    en: "Add Item",
    sw: "Ongeza Bidhaa",
  },
  "inventory.form.education": {
    en: "Education",
    sw: "Elimu",
  },
  "inventory.form.apparel": {
    en: "Apparel",
    sw: "Mavazi",
  },
  "inventory.form.nutrition": {
    en: "Nutrition",
    sw: "Lishe",
  },
  "inventory.form.medical": {
    en: "Medical",
    sw: "Matibabu",
  },
  "inventory.form.furniture": {
    en: "Furniture",
    sw: "Samani",
  },
  "inventory.form.electronics": {
    en: "Electronics",
    sw: "Elektroniki",
  },
  "inventory.form.sports": {
    en: "Sports",
    sw: "Michezo",
  },
  "inventory.form.other": {
    en: "Other",
    sw: "Nyingine",
  },
  "inventory.minQuantity": {
    en: "Min Quantity",
    sw: "Kiasi cha Chini",
  },
  "inventory.created": {
    en: "Created",
    sw: "Imeundwa",
  },
  "inventory.lowStock": {
    en: "Low Stock",
    sw: "Bidhaa Zinakaribia Kuisha",
  },
  "inventory.viewDetails": {
    en: "View Details & Transactions",
    sw: "Angalia Maelezo & Miamala",
  },
  "inventory.noItems": {
    en: "No inventory items found matching your criteria.",
    sw: "Hakuna bidhaa zilizopatikana zinazofanana na vigezo vyako.",
  },
  
  // Inventory Transaction Form
  "inventory.transaction.form.title": {
    en: "Record Inventory Transaction",
    sw: "Rekodi Muamala wa Bidhaa",
  },
  "inventory.transaction.form.editTitle": {
    en: "Edit Transaction",
    sw: "Hariri Muamala",
  },
  "inventory.transaction.form.description": {
    en: "Record items being added to or removed from inventory",
    sw: "Rekodi bidhaa zinazoongezwa au kuondolewa kwenye ghala",
  },
  "inventory.transaction.form.editDescription": {
    en: "Update the details of this inventory transaction",
    sw: "Sasisha maelezo ya muamala huu wa bidhaa",
  },
  "inventory.transaction.form.type": {
    en: "Transaction Type",
    sw: "Aina ya Muamala",
  },
  "inventory.transaction.form.incoming": {
    en: "Incoming",
    sw: "Zinazoingizwa",
  },
  "inventory.transaction.form.incomingDesc": {
    en: "Items received into inventory",
    sw: "Bidhaa zilizopokelewa kwenye ghala",
  },
  "inventory.transaction.form.outgoing": {
    en: "Outgoing",
    sw: "Zinazotolewa",
  },
  "inventory.transaction.form.outgoingDesc": {
    en: "Items distributed or used",
    sw: "Bidhaa zilizogawiwa au kutumika",
  },
  "inventory.transaction.form.quantity": {
    en: "Quantity",
    sw: "Kiasi",
  },
  "inventory.transaction.form.descriptionLabel": {
    en: "Description",
    sw: "Maelezo",
  },
  "inventory.transaction.form.descPlaceholder": {
    en: "Briefly describe the reason for this transaction",
    sw: "Eleza kwa ufupi sababu ya muamala huu",
  },
  "inventory.transaction.form.cancel": {
    en: "Cancel",
    sw: "Ghairi",
  },
  "inventory.transaction.form.recordIncoming": {
    en: "Record Incoming Items",
    sw: "Rekodi Bidhaa Zinazoingia",
  },
  "inventory.transaction.form.recordOutgoing": {
    en: "Record Outgoing Items",
    sw: "Rekodi Bidhaa Zinazotoka",
  },
  "inventory.transaction.form.updateTransaction": {
    en: "Update Transaction",
    sw: "Sasisha Muamala",
  },
  
  // Inventory Edit Form
  "inventory.edit.title": {
    en: "Edit Inventory Item",
    sw: "Hariri Bidhaa ya Ghala",
  },
  "inventory.edit.description": {
    en: "Update the details of this inventory item",
    sw: "Sasisha maelezo ya bidhaa hii ya ghala",
  },
  "inventory.edit.itemName": {
    en: "Item Name",
    sw: "Jina la Bidhaa",
  },
  "inventory.edit.category": {
    en: "Category",
    sw: "Kategoria",
  },
  "inventory.edit.quantity": {
    en: "Quantity",
    sw: "Kiasi",
  },
  "inventory.edit.price": {
    en: "Price (Tshs per unit)",
    sw: "Bei (Tshs kwa kila kipimo)",
  },
  "inventory.edit.minQuantity": {
    en: "Minimum Quantity (for low stock warning)",
    sw: "Kiasi cha Chini (kwa onyo la bidhaa kupungua)",
  },
  "inventory.edit.selectCategory": {
    en: "Select category",
    sw: "Chagua kategoria",
  },
  "inventory.edit.cancel": {
    en: "Cancel",
    sw: "Ghairi",
  },
  "inventory.edit.updateItem": {
    en: "Update Item",
    sw: "Sasisha Bidhaa",
  },
  "inventory.addSuccess": {
    en: "Inventory item \"{0}\" added successfully",
    sw: "Bidhaa \"{0}\" imeongezwa kwa mafanikio",
  },
  "inventory.addFail": {
    en: "Failed to add inventory item. Please try again.",
    sw: "Imeshindwa kuongeza bidhaa. Tafadhali jaribu tena.",
  },
  "inventory.addTransaction": {
    en: "Add Transaction",
    sw: "Ongeza Muamala",
  },
  "inventory.editItem": {
    en: "Edit Item",
    sw: "Hariri Bidhaa",
  },
  "inventory.deleteItem": {
    en: "Delete Item",
    sw: "Futa Bidhaa",
  },
  "inventory.deleteItemWarning": {
    en: "Are you sure you want to delete this item? This action cannot be undone.",
    sw: "Je, una uhakika unataka kufuta bidhaa hii? Hatua hii haiwezi kutendwa kinyume.",
  },
  "inventory.education": {
    en: "Education",
    sw: "Elimu",
  },
  "inventory.apparel": {
    en: "Apparel",
    sw: "Mavazi",
  },
  "inventory.nutrition": {
    en: "Nutrition",
    sw: "Lishe",
  },
  "inventory.medical": {
    en: "Medical",
    sw: "Matibabu",
  },
  "inventory.creative": {
    en: "Creative",
    sw: "Ubunifu",
  },  "inventory.close": {
    en: "Close",
    sw: "Funga",
  },
  "inventory.loadingItems": {
    en: "Loading inventory items...",
    sw: "Inapakia bidhaa...",
  },
  "inventory.viewItemsAllBranches": {
    en: "View and manage inventory items across all branches",
    sw: "Angalia na simamia bidhaa katika matawi yote",
  },
  "inventory.allBranches": {
    en: "All Branches",
    sw: "Matawi Yote",
  },
  "inventory.searchItems": {
    en: "Search items by name or category...",
    sw: "Tafuta bidhaa kwa jina au kategoria...",
  },
  "inventory.filterByBranch": {
    en: "Filter by branch",
    sw: "Chuja kwa tawi",
  },
  "inventory.viewDetailsTransactions": {
    en: "View Details & Transactions",
    sw: "Angalia Maelezo & Miamala",
  },  "inventory.noItemsFound": {
    en: "No inventory items found matching your criteria.",
    sw: "Hakuna bidhaa zilizopatikana zinazofanana na vigezo vyako.",
  },
  "branch.inventory.management": {
    en: "Inventory Management - Read Only",
    sw: "Usimamizi wa Bidhaa - Kusoma tu",
  },
  "branch.inventory.description": {
    en: "View inventory details for this branch. Superadmins cannot edit this data.",
    sw: "Angalia maelezo ya bidhaa kwa tawi hili. Wasimamizi wakuu hawawezi kuhariri data hii.",
  },
  "inventory.failedToLoad": {
    en: "Failed to load inventory items. Please try again.",
    sw: "Imeshindwa kupakia bidhaa. Tafadhali jaribu tena.",
  },  "inventory.noDataFound": {
    en: "No inventory data found",
    sw: "Hakuna data ya bidhaa iliyopatikana",
  },

  // Inventory Details
  "inventoryDetails.loadingDetails": {
    en: "Loading inventory details...",
    sw: "Inapakia maelezo ya bidhaa...",
  },
  "inventoryDetails.noDataFound": {
    en: "No inventory details found",
    sw: "Hakuna maelezo ya bidhaa yaliyopatikana",
  },
  "inventoryDetails.failedToLoad": {
    en: "Failed to load inventory details",
    sw: "Imeshindwa kupakia maelezo ya bidhaa",
  },
  "inventoryDetails.backToInventory": {
    en: "Back to Inventory",
    sw: "Rudi kwenye Bidhaa",
  },
  "inventoryDetails.itemDetails": {
    en: "Item Details",
    sw: "Maelezo ya Bidhaa",
  },
  "inventoryDetails.currentQuantity": {
    en: "Current Quantity",
    sw: "Kiasi cha Sasa",
  },
  "inventoryDetails.unitPrice": {
    en: "Unit Price",
    sw: "Bei kwa Kiasi",
  },
  "inventoryDetails.totalValue": {
    en: "Total Value",
    sw: "Thamani Kamili",
  },
  "inventoryDetails.totalIn": {
    en: "Total In",
    sw: "Jumla Iliyoingia",
  },
  "inventoryDetails.totalOut": {
    en: "Total Out",
    sw: "Jumla Iliyotoka",
  },
  "inventoryDetails.units": {
    en: "units",
    sw: "vipimo",
  },
  "inventoryDetails.transactionHistory": {
    en: "Transaction History",
    sw: "Historia ya Miamala",
  },
  "inventoryDetails.noTransactions": {
    en: "No transactions found for this item.",
    sw: "Hakuna miamala iliyopatikana kwa bidhaa hii.",
  },
  "inventoryDetails.received": {
    en: "Received",
    sw: "Imepokelewa",
  },
  "inventoryDetails.distributed": {
    en: "Distributed",
    sw: "Imesambazwa",
  },
  "inventoryDetails.noDescription": {
    en: "No description provided",
    sw: "Hakuna maelezo yaliyotolewa",
  },

  // Fundraiser
  "fundraiser.target": {
    en: "Target Amount",
    sw: "Kiasi Kinachohitajika",
  },
  "fundraiser.raised": {
    en: "Amount Raised",
    sw: "Kiasi Kilichokusanywa",
  },
  "fundraiser.progress": {
    en: "Progress",
    sw: "Maendeleo",
  },
  "fundraiser.startDate": {
    en: "Start Date",
    sw: "Tarehe ya Kuanza",
  },
  "fundraiser.endDate": {
    en: "End Date",
    sw: "Tarehe ya Mwisho",
  },  "fundraiser.currency": {
    en: "Tshs",
    sw: "Tsh",
  },
  "fundraiser.card.dateFormat": {
    en: "MMM d, yyyy",  
    sw: "d MMM yyyy",
  },
  
  // Fundraiser Card Component
  "fundraiser.image.placeholder": {
    en: "No image available",
    sw: "Hakuna picha inayopatikana",
  },
  "fundraiser.card.rejectionReason": {
    en: "Rejection Reason",
    sw: "Sababu ya Kukataliwa",
  },
  "fundraiser.card.coordinator": {
    en: "Coordinator",
    sw: "Mratibu",
  },
  "fundraiser.card.purpose": {
    en: "Purpose",
    sw: "Madhumuni",
  },
  "fundraiser.card.fundraisingReason": {
    en: "Fundraising Reason",
    sw: "Sababu ya Kukusanya Fedha",
  },
  "fundraiser.card.timeline": {
    en: "Event Timeline",
    sw: "Muda wa Tukio",
  },
  "fundraiser.card.contactEmail": {
    en: "Contact Email",
    sw: "Barua Pepe ya Mawasiliano",
  },
  "fundraiser.card.contactPhone": {
    en: "Contact Phone",
    sw: "Simu ya Mawasiliano",
  },
  "fundraiser.card.fundraisingGoal": {
    en: "Fundraising Goal",
    sw: "Lengo la Kukusanya Fedha",
  },
  "fundraiser.card.branch": {
    en: "Branch",
    sw: "Tawi",
  },
  "fundraiser.card.budgetBreakdown": {
    en: "Budget Breakdown",
    sw: "Mgawanyo wa Bajeti",
  },
  "fundraiser.card.approve": {
    en: "Approve",
    sw: "Idhinisha",
  },
  "fundraiser.card.reject": {
    en: "Reject",
    sw: "Kataa",
  },
  "fundraiser.card.rejectFundraiser": {
    en: "Reject Fundraiser",
    sw: "Kataa Kampeni ya Kukusanya Fedha",
  },
  "fundraiser.card.rejectReason": {
    en: "Please provide a reason for rejecting this fundraiser. This information will be shared with the coordinator.",
    sw: "Tafadhali toa sababu ya kukataa kampeni hii ya kukusanya fedha. Maelezo haya yatashirikishwa na mratibu.",
  },
  "fundraiser.card.enterRejectReason": {
    en: "Enter the reason for rejecting this fundraiser...",
    sw: "Ingiza sababu ya kukataa kampeni hii ya kukusanya fedha...",
  },
  "fundraiser.card.rejectedBy": {
    en: "Rejected by branch supervisor.",
    sw: "Imekataliwa na msimamizi wa tawi.",
  },
  "fundraiser.card.confirmRejection": {
    en: "Confirm Rejection",
    sw: "Thibitisha Kukataa",
  },
  "fundraiser.card.viewCampaign": {
    en: "View Campaign",
    sw: "Angalia Kampeni",
  },
  "fundraiser.card.cancelFundraiser": {
    en: "Cancel Fundraiser",
    sw: "Sitisha Kampeni ya Kukusanya Fedha",
  },
  "fundraiser.card.cancelReason": {
    en: "Please provide a reason for cancelling this fundraiser. This information will be shared with stakeholders.",
    sw: "Tafadhali toa sababu ya kusitisha kampeni hii ya kukusanya fedha. Maelezo haya yatashirikishwa na wadau.",
  },
  "fundraiser.card.enterCancelReason": {
    en: "Enter the reason for cancelling this fundraiser...",
    sw: "Ingiza sababu ya kusitisha kampeni hii ya kukusanya fedha...",
  },
  "fundraiser.card.cancelledBy": {
    en: "Cancelled by branch supervisor.",
    sw: "Imesitishwa na msimamizi wa tawi.",
  },
  "fundraiser.card.goBack": {
    en: "Go Back",
    sw: "Rudi Nyuma",
  },  "fundraiser.card.confirmCancellation": {
    en: "Confirm Cancellation",
    sw: "Thibitisha Kusitisha",
  },
  "fundraiser.card.viewDetails": {
    en: "View Details",
    sw: "Angalia Maelezo",
  },
  "fundraiser.card.cancelFundraiserButton": {
    en: "Cancel Fundraiser",
    sw: "Sitisha Kampeni",
  },

  // Fundraisers Management
  "fundraisers.management": {
    en: "Fundraiser Management",
    sw: "Usimamizi wa Kukusanya Fedha",
  },
  "fundraisers.viewAllBranches": {
    en: "View fundraisers across all branches",
    sw: "Angalia mikakati ya kukusanya fedha katika matawi yote",
  },
  "fundraisers.loadingFundraisers": {
    en: "Loading fundraisers...",
    sw: "Inapakia mikakati ya kukusanya fedha...",
  },
  "fundraisers.failedToLoad": {
    en: "Failed to load fundraisers. Please try again later.",
    sw: "Imeshindwa kupakia mikakati ya kukusanya fedha. Tafadhali jaribu tena baadaye.",
  },
  "fundraisers.noDataFound": {
    en: "No fundraiser data found",
    sw: "Hakuna data ya mikakati ya kukusanya fedha iliyopatikana",
  },
  "fundraisers.searchFundraisers": {
    en: "Search fundraisers...",
    sw: "Tafuta mikakati ya kukusanya fedha...",
  },
  "fundraisers.filterByStatus": {
    en: "Filter by status",
    sw: "Chuja kwa hali",
  },
  "fundraisers.filterByBranch": {
    en: "Filter by branch",
    sw: "Chuja kwa tawi",
  },
  "fundraisers.allStatuses": {
    en: "All Statuses",
    sw: "Hali Zote",
  },
  "fundraisers.allBranches": {
    en: "All Branches",
    sw: "Matawi Yote",
  },
  "fundraisers.pending": {
    en: "Pending",
    sw: "Inasubiri",
  },
  "fundraisers.approved": {
    en: "Approved",
    sw: "Imeidhinishwa",
  },
  "fundraisers.rejected": {
    en: "Rejected",
    sw: "Imekataliwa",
  },  "fundraisers.completed": {
    en: "Completed",
    sw: "Imekamilika",
  },
  "fundraisers.cancelled": {
    en: "Cancelled",
    sw: "Imesitishwa",
  },
  "fundraisers.noFundraisersFound": {
    en: "No fundraisers found matching your criteria.",
    sw: "Hakuna mikakati ya kukusanya fedha inayofanana na vigezo vyako.",
  },
  "fundraisers.supervisorDescription": {
    en: "Manage fundraising events for your branch",
    sw: "Simamia matukio ya kukusanya fedha kwa tawi lako",
  },
  "fundraisers.viewPublicCampaigns": {
    en: "View Public Campaigns",
    sw: "Angalia Kampeni za Umma",
  },
  "fundraisers.approvedSuccess": {
    en: "Fundraiser approved successfully",
    sw: "Kampeni ya kukusanya fedha imeidhinishwa kwa ufanisi",
  },
  "fundraisers.approveFailed": {
    en: "Failed to approve fundraiser. Please try again.",
    sw: "Imeshindwa kuidhinisha kampeni ya kukusanya fedha. Tafadhali jaribu tena.",
  },
  "fundraisers.rejectedSuccess": {
    en: "Fundraiser rejected successfully",
    sw: "Kampeni ya kukusanya fedha imekataliwa kwa ufanisi",
  },
  "fundraisers.rejectFailed": {
    en: "Failed to reject fundraiser. Please try again.",
    sw: "Imeshindwa kukataa kampeni ya kukusanya fedha. Tafadhali jaribu tena.",
  },
  "fundraisers.deleteSuccess": {
    en: "Fundraiser deleted successfully",
    sw: "Kampeni ya kukusanya fedha imefutwa kwa ufanisi",
  },
  "fundraisers.deleteFailed": {
    en: "Failed to delete fundraiser. Please try again.",
    sw: "Imeshindwa kufuta kampeni ya kukusanya fedha. Tafadhali jaribu tena.",
  },
  "fundraisers.completedSuccess": {
    en: "Fundraiser marked as completed successfully",
    sw: "Kampeni ya kukusanya fedha imewekwa alama ya kukamilika kwa ufanisi",
  },
  "fundraisers.completeFailed": {
    en: "Failed to mark fundraiser as completed. Please try again.",
    sw: "Imeshindwa kuweka alama ya kukamilika kwa kampeni ya kukusanya fedha. Tafadhali jaribu tena.",
  },
  "fundraisers.cancelSuccess": {
    en: "Fundraiser cancelled successfully",
    sw: "Kampeni ya kukusanya fedha imesitishwa kwa ufanisi",
  },
  "fundraisers.cancelFailed": {
    en: "Failed to cancel fundraiser. Please try again.",
    sw: "Imeshindwa kusitisha kampeni ya kukusanya fedha. Tafadhali jaribu tena.",
  },
  "fundraisers.rejectTitle": {
    en: "Reject Fundraiser",
    sw: "Kataa Kampeni ya Kukusanya Fedha",
  },
  "fundraisers.rejectDescription": {
    en: "Please provide a reason for rejecting this fundraiser. This information will be shared with the coordinator.",
    sw: "Tafadhali toa sababu ya kukataa kampeni hii ya kukusanya fedha. Maelezo haya yatashirikishwa na mratibu.",
  },
  "fundraisers.rejectReasonLabel": {
    en: "Rejection Reason",
    sw: "Sababu ya Kukataa",
  },
  "fundraisers.rejectReasonPlaceholder": {
    en: "Enter the reason for rejecting this fundraiser...",
    sw: "Ingiza sababu ya kukataa kampeni hii ya kukusanya fedha...",
  },
  "fundraisers.rejectButton": {
    en: "Reject Fundraiser",
    sw: "Kataa Kampeni",
  },

  // Volunteer
  "volunteer.email": {
    en: "Email",
    sw: "Barua pepe",
  },
  "volunteer.phone": {
    en: "Phone",
    sw: "Simu",
  },
  "volunteer.skills": {
    en: "Skills",
    sw: "Ujuzi",
  },
  "volunteer.availability": {
    en: "Availability",
    sw: "Upatikanaji",
  },

  // Language
  "language.title": {
    en: "Language",
    sw: "Lugha",
  },
  "language.english": {
    en: "English",
    sw: "Kiingereza",
  },
  "language.swahili": {
    en: "Swahili",
    sw: "Kiswahili",
  },

  // Homepage
  "home.hero.title": {
    en: "Empowering children, building futures",
    sw: "Kuwawezesha watoto, kujenga mustakabali",
  },
  "home.hero.description": {
    en: "Join us in our mission to provide care, education, and opportunities for orphaned children.",
    sw: "Jiunge nasi katika dhamira yetu ya kutoa huduma, elimu, na fursa kwa watoto yatima.",
  },
  "home.fundraiser.title": {
    en: "I'm a Personal Fundraiser",
    sw: "Mimi ni Mchangishaji Binafsi",
  },
  "home.fundraiser.description": {
    en: "I want to raise money for myself, friends, or community.",
    sw: "Nataka kukusanya pesa kwa ajili yangu, marafiki, au jamii.",
  },
  "home.fundraiser.start": {
    en: "Get started free",
    sw: "Anza bure",
  },
  "home.fundraiser.learn": {
    en: "Learn More",
    sw: "Jifunze Zaidi",
  },
  "home.significance.title": {
    en: "The Significance of Fundraising",
    sw: "Umuhimu wa Ukusanyaji Fedha",
  },
  "home.significance.description": {
    en: "Your contribution makes a real difference in the lives of orphaned children.",
    sw: "Mchango wako unaleta tofauti halisi katika maisha ya watoto yatima.",
  },
  "home.significance.detail": {
    en: "Every donation helps provide education, healthcare, and a loving environment for children in need.",
    sw: "Kila mchango husaidia kutoa elimu, huduma za afya, na mazingira ya upendo kwa watoto wanaohitaji.",
  },
  "home.significance.impact": {
    en: "See Impact Stories",
    sw: "Ona Hadithi za Athari",
  },
  "home.volunteer.title": {
    en: "Volunteer With Us",
    sw: "Jitolee Nasi",
  },
  "home.volunteer.subtitle": {
    en: "Share your time and skills to make a difference",
    sw: "Shiriki muda na ujuzi wako kuleta tofauti",
  },
  "home.volunteer.become": {
    en: "Become a Volunteer",
    sw: "Kuwa Mjitolea",
  },
  "home.volunteer.help": {
    en: "Help us provide care, education, and support to orphaned children",
    sw: "Tusaidie kutoa huduma, elimu, na msaada kwa watoto yatima",
  },
  "home.volunteer.description": {
    en: "Our volunteers play a crucial role in supporting our mission. Whether you're a teacher, doctor, counselor, or simply someone who wants to help, there's a place for you at Hope Foundation.",
    sw: "Wajitolea wetu wana jukumu muhimu katika kuunga mkono dhamira yetu. Iwapo wewe ni mwalimu, daktari, mshauri, au mtu tu anayetaka kusaidia, kuna nafasi yako katika Hope Foundation.",
  },
  "home.volunteer.register": {
    en: "Register for Volunteering Activities",
    sw: "Jiandikishe kwa Shughuli za Kujitolea",
  },
  "home.steps.title": {
    en: "How to Start a Fundraiser",
    sw: "Jinsi ya Kuanza Mchango",
  },
  "home.steps.subtitle": {
    en: "Simple steps to make a difference",
    sw: "Hatua rahisi za kuleta tofauti",
  },
  "home.steps.step1.title": {
    en: "1. Create an Account",
    sw: "1. Tengeneza Akaunti",
  },
  "home.steps.step1.description": {
    en: "Sign up and create your personal fundraiser profile.",
    sw: "Jisajili na tengeneza wasifu wako wa mchango binafsi.",
  },
  "home.steps.step2.title": {
    en: "2. Set Up Your Campaign",
    sw: "2. Anzisha Kampeni Yako",
  },
  "home.steps.step2.description": {
    en: "Fill out the campaign details and set your fundraising goal.",
    sw: "Jaza maelezo ya kampeni na weka lengo lako la ukusanyaji fedha.",
  },
  "home.steps.step3.title": {
    en: "3. Share & Collect",
    sw: "3. Shiriki & Kusanya",
  },
  "home.steps.step3.description": {
    en: "Share your campaign and start collecting donations.",
    sw: "Shiriki kampeni yako na anza kukusanya michango.",
  },
  "home.steps.start": {
    en: "Start your FREE campaign",
    sw: "Anza kampeni yako ya BURE",
  },
  "home.campaigns.title": {
    en: "Ongoing Campaigns",
    sw: "Kampeni Zinazoendelea",
  },
  "home.campaigns.education.title": {
    en: "Education for All Children",
    sw: "Elimu kwa Watoto Wote",
  },
  "home.campaigns.education.description": {
    en: "Help provide school supplies and tuition",
    sw: "Saidia kutoa vifaa vya shule na ada",
  },
  "home.campaigns.healthcare.title": {
    en: "Healthcare Initiative",
    sw: "Mpango wa Huduma za Afya",
  },
  "home.campaigns.healthcare.description": {
    en: "Provide medical checkups and treatments",
    sw: "Toa uchunguzi wa matibabu na matibabu",
  },
  "home.campaigns.sports.title": {
    en: "Sports Equipment Drive",
    sw: "Kampeni ya Vifaa vya Michezo",
  },
  "home.campaigns.sports.description": {
    en: "Purchase sports equipment for recreational activities",
    sw: "Nunua vifaa vya michezo kwa shughuli za burudani",
  },
  "home.campaigns.donate": {
    en: "Donate Now",
    sw: "Changia Sasa",
  },
  "home.campaigns.completed": {
    en: "Campaign Completed",
    sw: "Kampeni Imekamilika",
  },
  
  "campaign.learn.title": {
    en: "Start a Campaign",
    sw: "Anzisha Kampeni"
  },
  "campaign.learn.subtitle": {
    en: "Make a meaningful difference in children's lives",
    sw: "Fanya mabadiliko ya maana katika maisha ya watoto"
  },
  "campaign.learn.backToHome": {
    en: "Back to Home",
    sw: "Rudi Nyumbani"
  },
  "campaign.learn.howToStart": {
    en: "How to Start a Campaign",
    sw: "Jinsi ya Kuanzisha Kampeni"
  },
  "campaign.learn.description": {
    en: "Starting a campaign is a powerful way to create positive change for children in need. Whether you want to raise funds for education, healthcare, or recreational activities, your initiative can transform lives and bring hope to those who need it most.",
    sw: "Kuanzisha kampeni ni njia yenye nguvu ya kuunda mabadiliko chanya kwa watoto wanaohitaji. Ikiwa unataka kukusanya fedha kwa elimu, huduma za afya, au shughuli za burudani, juhudi zako zinaweza kubadilisha maisha na kuleta matumaini kwa walio na mahitaji."
  },
  "campaign.learn.step1.title": {
    en: "Choose a Cause",
    sw: "Chagua Lengo"
  },
  "campaign.learn.step1.description": {
    en: "Identify the specific need you want to address. Focus on an area where your campaign can make a tangible impact.",
    sw: "Tambua hitaji mahususi unalotaka kushughulikia. Lenga eneo ambapo kampeni yako inaweza kufanya matokeo yanayoonekana."
  },
  "campaign.learn.step2.title": {
    en: "Set a Goal",
    sw: "Weka Lengo"
  },
  "campaign.learn.step2.description": {
    en: "Determine how much funding you need and what it will accomplish. Clear goals help motivate donors.",
    sw: "Amua kiasi cha fedha unachohitaji na kile kitakachofanikisha. Malengo wazi husaidia kuhamasisha wafadhili."
  },
  "campaign.learn.step3.title": {
    en: "Tell Your Story",
    sw: "Simulia Hadithi Yako"
  },
  "campaign.learn.step3.description": {
    en: "Share why this cause matters to you and how donations will make a difference. Authentic stories inspire action.",
    sw: "Shiriki kwa nini lengo hili ni muhimu kwako na jinsi michango itakavyofanya tofauti. Hadithi za kweli zinahamasisha hatua."
  },
  "campaign.learn.step4.title": {
    en: "Spread the Word",
    sw: "Eneza Habari"
  },
  "campaign.learn.step4.description": {
    en: "Share your campaign with friends, family, and social networks. The wider your reach, the greater your impact.",
    sw: "Shiriki kampeni yako na marafiki, familia, na mitandao ya kijamii. Kadri ufikiwaji wako unavyokuwa mpana, ndivyo athari yako inavyokuwa kubwa."
  },
  "campaign.learn.impact.title": {
    en: "The Impact of Your Campaign",
    sw: "Athari ya Kampeni Yako"
  },
  "campaign.learn.impact.description": {
    en: "When you start a campaign, you're not just raising funds—you're creating opportunities and building futures. Your efforts can provide:",
    sw: "Unapoanzisha kampeni, huwa hukusanyi fedha tu—unaunda fursa na kujenga siku za usoni. Juhudi zako zinaweza kutoa:"
  },
  "campaign.learn.impact.education": {
    en: "Educational materials and tuition for children who otherwise couldn't afford school",
    sw: "Vifaa vya elimu na ada za shule kwa watoto ambao hawangekuwa na uwezo wa kulipia shule"
  },
  "campaign.learn.impact.medical": {
    en: "Medical care and health services for vulnerable youth",
    sw: "Huduma za matibabu na huduma za afya kwa vijana walio hatarini"
  },
  "campaign.learn.impact.sports": {
    en: "Sports equipment and recreational activities that foster physical and mental wellbeing",
    sw: "Vifaa vya michezo na shughuli za burudani zinazokuznia afya ya kimwili na kiakili"
  },
  "campaign.learn.impact.basic": {
    en: "Basic necessities like food, clothing, and safe shelter",
    sw: "Mahitaji ya msingi kama chakula, mavazi, na malazi salama"
  },
  "campaign.learn.ready": {
    en: "Ready to make a difference?",
    sw: "Uko tayari kuleta mabadiliko?"
  },
  "campaign.learn.startButton": {
    en: "Start Your Campaign Now",
    sw: "Anzisha Kampeni Yako Sasa"
  },
  "campaign.learn.confirmDialog.title": {
    en: "Start a Campaign",
    sw: "Anzisha Kampeni"
  },
  "campaign.learn.confirmDialog.description": {
    en: "Do you wish to start a campaign?",
    sw: "Je, ungependa kuanzisha kampeni?"
  },
  "campaign.learn.confirmDialog.cancel": {
    en: "Cancel",
    sw: "Ghairi"
  },
  "campaign.learn.confirmDialog.confirm": {
    en: "Yes, Let's Begin",
    sw: "Ndio, Tuanze"
  },
  "campaign.learn.returnHome": {
    en: "Return to Home",
    sw: "Rudi Nyumbani"
  },
  
  "campaign.details.title": {
    en: "Campaign Details",
    sw: "Maelezo ya Kampeni"
  },
  "campaign.details.contributors": {
    en: "Contributors",
    sw: "Wachangiaji"
  },
  "campaign.details.back": {
    en: "Back to Fundraisers",
    sw: "Rudi kwa Michango"
  },
  "campaign.details.loading": {
    en: "Loading campaign details...",
    sw: "Inapakia maelezo ya kampeni..."
  },
  "campaign.details.notFound": {
    en: "Campaign not found",
    sw: "Kampeni haijapatikana"
  },
  "campaign.details.goBack": {
    en: "Go Back",
    sw: "Rudi Nyuma"
  },
  "campaign.details.andContributors": {
    en: "Campaign Details and Contributors",
    sw: "Maelezo ya Kampeni na Wachangiaji"
  },
  "campaign.details.progress": {
    en: "Campaign Progress",
    sw: "Maendeleo ya Kampeni"
  },
  "campaign.details.raised": {
    en: "raised",
    sw: "imechangwa"
  },
  "campaign.details.goal": {
    en: "Goal:",
    sw: "Lengo:"
  },
  "campaign.details.contributors.count": {
    en: "contributors",
    sw: "wachangiaji"
  },
  "campaign.details.remaining": {
    en: "remaining",
    sw: "imebaki"
  },
  "campaign.details.eventPeriod": {
    en: "Event Period",
    sw: "Kipindi cha Tukio"
  },
  "campaign.details.coordinator": {
    en: "Coordinator",
    sw: "Mratibu"
  },
  "campaign.details.contactEmail": {
    en: "Contact Email",
    sw: "Barua Pepe ya Mawasiliano"
  },
  "campaign.details.contactPhone": {
    en: "Contact Phone",
    sw: "Simu ya Mawasiliano"
  },
  "campaign.details.suggestedContribution": {
    en: "Suggested Contribution",
    sw: "Mchango Unaopendekezwa"
  },
  "campaign.details.purpose": {
    en: "Purpose",
    sw: "Madhumuni"
  },
  "campaign.details.fundraisingReason": {
    en: "Fundraising Reason",
    sw: "Sababu ya Kuchangisha"
  },
  "campaign.details.budgetBreakdown": {
    en: "Budget Breakdown",
    sw: "Mgawanyo wa Bajeti"
  },
  "campaign.details.distribution": {
    en: "Distribution",
    sw: "Ugawaji"
  },
  "campaign.details.orphanageAmount": {
    en: "Orphanage Amount",
    sw: "Kiasi cha Nyumba ya Watoto"
  },
  "campaign.details.eventAmount": {
    en: "Event Amount",
    sw: "Kiasi cha Tukio"
  },
  "campaign.details.viewPublic": {
    en: "View Public Campaign Page",
    sw: "Angalia Ukurasa wa Kampeni ya Umma"
  },
  "campaign.backToFundraisers": {
    en: "Back to Fundraisers",
    sw: "Rudi kwa Miradi ya Kuchangisha"
  },
  "campaign.image.placeholder": {
    en: "Fundraiser Image",
    sw: "Picha ya Mradi wa Kuchangisha"
  },
  "campaign.saveAChild": {
    en: "Save A Child",
    sw: "Okoa Mtoto"
  },
  "campaign.viewPublicPage": {
    en: "View Public Campaign Page",
    sw: "Angalia Ukurasa wa Kampeni ya Umma"
  },
  "campaign.image.fallback": {
    en: "Fundraiser Image",
    sw: "Picha ya Kampeni"
  },
  // Remove duplicate campaign keys that have campaign.details.* versions
  
  // Remove duplicate campaign keys that have campaign.details.* versions
  
  "campaign.contributors.title": {
    en: "Campaign Contributors",
    sw: "Wachangiaji wa Kampeni"
  },
  "campaign.contributors.none": {
    en: "No contributions have been made to this campaign yet.",
    sw: "Hakuna michango iliyofanywa kwa kampeni hii bado."
  },
  "campaign.contributors.table.name": {
    en: "Name",
    sw: "Jina"
  },
  "campaign.contributors.table.email": {
    en: "Email",
    sw: "Barua Pepe"
  },
  "campaign.contributors.table.phone": {
    en: "Phone",
    sw: "Simu"
  },
  "campaign.contributors.table.amount": {
    en: "Amount",
    sw: "Kiasi"
  },
  "campaign.contributors.table.date": {
    en: "Date",
    sw: "Tarehe"
  },
  "campaign.contributors.table.paymentMethod": {
    en: "Payment Method",
    sw: "Njia ya Malipo"
  },
  "campaign.contributors.table.status": {
    en: "Status",
    sw: "Hali"
  },
  "campaign.contributors.anonymous": {
    en: "Anonymous",
    sw: "Asiyejulikana"
  },
  "campaign.status.completed": {
    en: "COMPLETED",
    sw: "IMEKAMILIKA"
  },
  "campaign.status.pending": {
    en: "PENDING",
    sw: "INASUBIRI"
  },
  "campaign.status.unknown": {
    en: "UNKNOWN",
    sw: "HAIJULIKANI"
  },
  "campaign.status.active": {
    en: "ACTIVE",
    sw: "INAFANYA KAZI"
  },
  "campaign.status.cancelled": {
    en: "CANCELLED",
    sw: "IMESITISHWA"
  },
  
  // Fundraiser status translations
  "fundraiser.status.approved": {
    en: "APPROVED",
    sw: "IMEIDHINISHWA"
  },
  "fundraiser.status.pending": {
    en: "PENDING",
    sw: "INASUBIRI"
  },
  "fundraiser.status.rejected": {
    en: "REJECTED",
    sw: "IMEKATALIWA"
  },
  "fundraiser.status.completed": {
    en: "COMPLETED",
    sw: "IMEKAMILIKA"
  },
  
  "campaign.details.notFoundDescription": {
    en: "The campaign you're looking for does not exist or may have been removed.",
    sw: "Kampeni unayotafuta haipo au inaweza kuwa imeondolewa."
  },
  "campaigns.returnToList": {
    en: "Return to Campaigns",
    sw: "Rudi kwenye Kampeni"
  },
  "campaign.contribute.readyPrompt": {
    en: "Ready to make a difference?",
    sw: "Uko tayari kuleta mabadiliko?"
  },
  "campaign.contribute.button": {
    en: "Contribute to this Campaign",
    sw: "Changia kwenye Kampeni Hii"
  },
  "campaign.contribute.minimum": {
    en: "Minimum contribution",
    sw: "Mchango wa chini"
  },
  "campaign.status.pendingTitle": {
    en: "This Campaign is Still Pending",
    sw: "Kampeni Hii Bado Inasubiri"
  },
  "campaign.status.pendingDescription": {
    en: "This fundraising campaign is currently under review and not yet open for contributions. Please check back later when the campaign is active.",
    sw: "Kampeni hii ya ukusanyaji fedha iko chini ya ukaguzi na bado haijafunguliwa kwa michango. Tafadhali angalia tena baadaye wakati kampeni itakapokuwa inafanya kazi."
  },
  "campaign.status.completedTitle": {
    en: "Campaign Completed",
    sw: "Kampeni Imekamilika"
  },
  "campaign.status.completedDescription": {
    en: "Thank you to everyone who contributed! This fundraising campaign has reached its goal and is no longer accepting contributions.",
    sw: "Asante kwa kila mtu aliyechangia! Kampeni hii ya ukusanyaji fedha imefika lengo lake na haipokelei tena michango."
  },
  "campaign.status.cancelledTitle": {
    en: "Campaign Cancelled",
    sw: "Kampeni Imesitishwa"
  },
  "campaign.status.cancelledDescription": {
    en: "This fundraising campaign has been cancelled and is no longer accepting contributions. Thank you for your interest.",
    sw: "Kampeni hii ya ukusanyaji fedha imesitishwa na haipokelei tena michango. Asante kwa nia yako."
  },
  
  // Campaign page translations
  "campaigns.ongoing.title": {
    en: "Ongoing Campaigns",
    sw: "Kampeni Zinazoendelea",
  },
  "campaigns.ongoing.subtitle": {
    en: "Join our mission to support children in need through these active initiatives",
    sw: "Jiunge na dhamira yetu ya kuwasaidia watoto wanaohitaji kupitia juhudi hizi zinazoendelea",
  },
  "campaigns.ongoing.empty": {
    en: "No active campaigns at the moment. Please check back later.",
    sw: "Hakuna kampeni zinazoendelea kwa sasa. Tafadhali angalia tena baadaye.",
  },
  "campaigns.start.title": {
    en: "Want to Start Your Own Campaign?",
    sw: "Unataka Kuanza Kampeni Yako Mwenyewe?",
  },
  "campaigns.start.description": {
    en: "Have an idea for a campaign? You can create your own fundraiser and make a difference.",
    sw: "Una wazo la kampeni? Unaweza kuunda mchango wako mwenyewe na kuleta mabadiliko.",
  },
  "campaigns.start.cta": {
    en: "Learn How to Start",
    sw: "Jifunze Jinsi ya Kuanza",
  },
  "campaigns.returnHome": {
    en: "Return to Home",
    sw: "Rudi Mwanzo",
  },
  
  "home.mission.title": {
    en: "Your success is our success!",
    sw: "Mafanikio yako ni mafanikio yetu!",
  },
  "home.mission.description": {
    en: "Our mission is to help you achieve your fundraising goal and make a positive impact in the lives of orphaned children.",
    sw: "Dhamira yetu ni kukusaidia kufikia lengo lako la ukusanyaji fedha na kuleta athari chanya katika maisha ya watoto yatima.",
  },
  "home.mission.children": {
    en: "Children supported",
    sw: "Watoto waliosaidiwa",
  },
  "home.mission.funds": {
    en: "Funds raised",
    sw: "Fedha zilizokusanywa",
  },
  "home.mission.campaigns": {
    en: "Successful campaigns",
    sw: "Kampeni zilizofanikiwa",
  },
  "home.share.title": {
    en: "Share",
    sw: "Shiriki",
  },  "home.share.description": {
    en: "Share your campaign and reach more people via most popular social media channels.",
    sw: "Shiriki kampeni yako na ufikie watu wengi zaidi kupitia njia maarufu za mitandao ya kijamii.",
  },
  
  // Impact cards section
  "home.impact.title": {
    en: "Making a Difference Together",
    sw: "Kuleta Mabadiliko Pamoja",
  },
  "home.impact.subtitle": {
    en: "Discover how our orphanage is transforming lives and how you can be part of this journey",
    sw: "Gundua jinsi nyumba yetu ya watoto yatima inavyobadilisha maisha na jinsi unaweza kuwa sehemu ya safari hii",
  },
  "home.volunteer.card.title": {
    en: "Start Volunteer With Us",
    sw: "Anza Kujitolea Nasi",
  },
  "home.volunteer.card.description": {
    en: "Join our team to support children in need",
    sw: "Jiunge na timu yetu kusaidia watoto wanaohitaji",
  },
  "home.volunteer.card.content": {
    en: "Become a volunteer and make a direct impact on children's lives. Your time and skills can help create a brighter future for those who need it most.",
    sw: "Kuwa mjitolea na fanya athari ya moja kwa moja katika maisha ya watoto. Muda na ujuzi wako unaweza kusaidia kujenga mustakabali mzuri zaidi kwa wale wanaohitaji zaidi.",
  },
  "home.volunteer.card.button": {
    en: "Volunteer With Us",
    sw: "Jitolee Nasi",
  },
  "home.news.card.title": {
    en: "Ongoing News",
    sw: "Habari Zinazoendelea",
  },
  "home.news.card.description": {
    en: "Stay updated with the latest news and events",
    sw: "Endelea kupata habari za hivi karibuni na matukio",
  },
  "home.news.card.content": {
    en: "Get the latest updates on our campaigns, success stories, and upcoming events. Stay connected with our community and see the impact of our collective efforts.",
    sw: "Pata taarifa za hivi karibuni kuhusu kampeni zetu, hadithi za mafanikio, na matukio yajayo. Endelea kuwa na mawasiliano na jamii yetu na uone athari ya juhudi zetu za pamoja.",
  },
  "home.news.card.button": {
    en: "Explore News",
    sw: "Chunguza Habari",
  },
  "home.campaign.card.title": {
    en: "Join a Campaign",
    sw: "Jiunge na Kampeni",
  },
  "home.campaign.card.description": {
    en: "Participate in our ongoing initiatives",
    sw: "Shiriki katika mipango yetu inayoendelea",
  },
  "home.campaign.card.content": {
    en: "Join our campaigns to make a difference. Our campaigns, fundraising, and orphanage initiatives provide essential support, education, and healthcare to children in need. Your participation creates meaningful change in these children's lives.",
    sw: "Jiunge na kampeni zetu kuleta mabadiliko. Kampeni zetu, ukusanyaji wa fedha, na mipango ya makazi ya watoto yatima hutoa msaada muhimu, elimu, na huduma za afya kwa watoto wanaohitaji. Ushirika wako unaleta mabadiliko muhimu katika maisha ya watoto hawa.",
  },
  "home.campaign.card.button": {
    en: "Learn More",
    sw: "Jifunze Zaidi",
  },
  
  // Footer section
  "footer.about.title": {
    en: "About",
    sw: "Kuhusu",
  },
  "footer.about.aboutUs": {
    en: "About Us",
    sw: "Kuhusu Sisi",
  },
  "footer.about.why": {
    en: "Why HopeFoundation",
    sw: "Kwa Nini HopeFoundation",
  },
  "footer.about.impact": {
    en: "Our Impact",
    sw: "Athari Yetu",
  },
  "footer.resources.title": {
    en: "Resources",
    sw: "Rasilimali",
  },
  "footer.resources.faq": {
    en: "FAQ",
    sw: "Maswali",
  },
  "footer.resources.campaigns": {
    en: "Discover Campaigns",
    sw: "Gundua Kampeni",
  },
  "footer.legal.title": {
    en: "Legal",
    sw: "Kisheria",
  },
  "footer.legal.terms": {
    en: "Terms of Service",
    sw: "Masharti ya Huduma",
  },
  "footer.legal.privacy": {
    en: "Privacy Policy",
    sw: "Sera ya Faragha",
  },
  "footer.connect.title": {
    en: "Connect",
    sw: "Unganisha",
  },
  "footer.newsletter": {
    en: "Sign up for our newsletter to stay updated",
    sw: "Jisajili kwa jarida letu ili kuendelea kupata taarifa",
  },
  "footer.support": {
    en: "Support | Terms of Service | Privacy Policy",
    sw: "Msaada | Masharti ya Huduma | Sera ya Faragha",
  },  "footer.copyright": {
    en: "© 2025 HopeFoundation. All rights reserved.",
    sw: "© 2025 HopeFoundation. Haki zote zimehifadhiwa.",
  },

  // About Us Page
  // Navigation Header
  "about.signin": {
    en: "Sign In",
    sw: "Ingia",
  },

  // Hero Section
  "about.hero.title": {
    en: "About Hope Foundation",
    sw: "Kuhusu Hope Foundation",
  },
  "about.hero.description": {
    en: "Dedicated to providing care, education, and opportunities for orphaned children since 2010",
    sw: "Tumejitolea kutoa huduma, elimu, na fursa kwa watoto yatima tangu 2010",
  },

  // Mission & Vision
  "about.mission.title": {
    en: "Our Mission",
    sw: "Dhamira Yetu",
  },
  "about.mission.description": {
    en: "To provide a nurturing and supportive environment for orphaned children, ensuring they receive the care, education, and opportunities they need to thrive and become self-sufficient adults.",
    sw: "Kutoa mazingira ya malezi na msaada kwa watoto yatima, kuhakikisha wanapata huduma, elimu, na fursa wanazohitaji kustawi na kuwa watu wazima wanaojitegemea.",
  },
  "about.vision.title": {
    en: "Our Vision",
    sw: "Maono Yetu",
  },
  "about.vision.description": {
    en: "A world where every orphaned child has access to quality care, education, and the opportunity to reach their full potential, regardless of their background or circumstances.",
    sw: "Dunia ambapo kila mtoto yatima ana uwezo wa kupata huduma bora, elimu, na fursa ya kufikia uwezo wao kamili, bila kujali historia yao au mazingira.",
  },

  // Our Story
  "about.story.title": {
    en: "Our Story",
    sw: "Hadithi Yetu",
  },
  "about.story.subtitle": {
    en: "How Hope Foundation began and where we are today",
    sw: "Jinsi Hope Foundation ilianzishwa na tulipofikia leo",
  },
  "about.story.paragraph1": {
    en: "Hope Foundation was established in 2010 by a group of dedicated individuals who recognized the urgent need to provide care and support for orphaned children in our community. What began as a small initiative with just 10 children has now grown into a comprehensive orphanage management system supporting over 150 children across multiple branches.",
    sw: "Hope Foundation ilianzishwa mnamo 2010 na kikundi cha watu waliojitolea ambao walitambua hitaji la dharura la kutoa huduma na msaada kwa watoto yatima katika jamii yetu. Kilianza kama mpango mdogo wenye watoto 10 tu sasa umekua na kuwa mfumo kamili wa usimamizi wa makazi ya watoto yatima unaosaidia zaidi ya watoto 150 katika matawi mbalimbali.",
  },
  "about.story.paragraph2": {
    en: "Our journey has been one of continuous growth and learning. We started with a single facility and limited resources, but through the generosity of donors and the dedication of our volunteers and staff, we have expanded our reach and improved our services year after year.",
    sw: "Safari yetu imekuwa ya ukuaji na kujifunza endelevu. Tulianza na kituo kimoja na rasilimali chache, lakini kupitia ukarimu wa wafadhili na kujitolea kwa watu wetu wa kujitolea na wafanyakazi, tumepanua ufikiwaji wetu na kuboresha huduma zetu mwaka baada ya mwaka.",
  },
  "about.story.paragraph3": {
    en: "Today, Hope Foundation operates four branches, each providing a safe and nurturing environment for orphaned children. We offer comprehensive care that includes not just shelter and food, but also education, healthcare, counseling, and various developmental programs designed to help our children grow into confident, self-sufficient adults.",
    sw: "Leo, Hope Foundation inaendesha matawi manne, kila moja linatoa mazingira salama na ya malezi kwa watoto yatima. Tunatoa huduma kamili inayojumuisha si tu malazi na chakula, lakini pia elimu, huduma za afya, ushauri nasaha, na programu mbalimbali za maendeleo zilizoundwa kusaidia watoto wetu kukua na kuwa watu wazima wenye kujiamini na kujitegemea.",
  },
  "about.story.paragraph4": {
    en: "Our success stories are numerous, with many of our former residents now pursuing higher education, building successful careers, and giving back to the community that once supported them. We remain committed to our mission and continue to seek ways to improve and expand our services to reach more children in need.",
    sw: "Hadithi zetu za mafanikio ni nyingi, wengi wa wakazi wetu wa zamani sasa wanafuata elimu ya juu, wanajenga kazi za mafanikio, na kurudisha kwa jamii iliyowasaidia hapo awali. Tunaendelea kuwa tumejitolea kwa dhamira yetu na kuendelea kutafuta njia za kuboresha na kupanua huduma zetu kufikia watoto wengi zaidi wanaohitaji.",
  },

  // What We Do
  "about.whatwedo.title": {
    en: "What We Do",
    sw: "Tunachofanya",
  },
  "about.whatwedo.subtitle": {
    en: "Our comprehensive approach to orphan care",
    sw: "Mbinu yetu kamili ya huduma kwa yatima",
  },
  "about.shelter.title": {
    en: "Shelter & Care",
    sw: "Makazi & Huduma",
  },
  "about.shelter.description": {
    en: "We provide safe, comfortable housing and daily care for all children, ensuring their basic needs are met in a loving environment.",
    sw: "Tunatoa makazi salama, ya starehe na huduma za kila siku kwa watoto wote, tukihakikisha mahitaji yao ya msingi yanatimizwa katika mazingira ya upendo.",
  },
  "about.education.title": {
    en: "Education",
    sw: "Elimu",
  },
  "about.education.description": {
    en: "We ensure all children receive quality education, from primary school through higher education, tailored to their abilities and interests.",
    sw: "Tunahakikisha watoto wote wanapata elimu bora, kuanzia shule ya msingi hadi elimu ya juu, iliyotengenezwa kulingana na uwezo na maslahi yao.",
  },
  "about.counseling.title": {
    en: "Counseling & Support",
    sw: "Ushauri & Msaada",
  },
  "about.counseling.description": {
    en: "Our professional counselors provide emotional support and guidance to help children overcome trauma and build resilience.",
    sw: "Washauri wetu wa kitaaluma hutoa msaada wa kihisia na mwongozo kusaidia watoto kushinda maumivu na kujenga ustahimilivu.",
  },

  // Contact Information
  "about.contact.title": {
    en: "Contact Us",
    sw: "Wasiliana Nasi",
  },
  "about.contact.subtitle": {
    en: "Get in touch with Hope Foundation",
    sw: "Wasiliana na Hope Foundation",
  },
  "about.contact.office": {
    en: "Main Office",
    sw: "Ofisi Kuu",
  },
  "about.contact.address": {
    en: "123 Hope Street, Springfield, ST 12345",
    sw: "123 Hope Street, Springfield, ST 12345",
  },
  "about.contact.phone": {
    en: "Phone",
    sw: "Simu",
  },
  "about.contact.phoneNumber": {
    en: "(123) 456-7890",
    sw: "(123) 456-7890",
  },
  "about.contact.email": {
    en: "Email",
    sw: "Barua pepe",
  },
  "about.contact.emailAddress": {
    en: "info@hopefoundation.org",
    sw: "info@hopefoundation.org",
  },
  "about.contact.hours": {
    en: "Office Hours",
    sw: "Saa za Ofisi",
  },
  "about.contact.hoursDetails": {
    en: "Monday - Friday: 9:00 AM - 5:00 PM",
    sw: "Jumatatu - Ijumaa: 9:00 Asubuhi - 5:00 Jioni",
  },

  // Get Involved
  "about.getinvolved.title": {
    en: "Get Involved",
    sw: "Shiriki",
  },
  "about.getinvolved.description": {
    en: "There are many ways you can support our mission and make a difference in the lives of orphaned children.",
    sw: "Kuna njia nyingi unaweza kusaidia dhamira yetu na kuleta tofauti katika maisha ya watoto yatima.",
  },
  "about.getinvolved.fundraiser": {
    en: "Start a Fundraiser",
    sw: "Anza Mchango",
  },
  "about.getinvolved.volunteer": {
    en: "Volunteer With Us",
    sw: "Jitolee Nasi",
  },
  "about.getinvolved.donate": {
    en: "Make a Donation",
    sw: "Fanya Mchango",
  },

  // Footer
  "about.footer.copyright": {
    en: "© 2025 Hope Foundation. All rights reserved.",
    sw: "© 2025 Hope Foundation. Haki zote zimehifadhiwa.",
  },  "about.footer.nonprofit": {
    en: "A registered non-profit organization dedicated to orphan care.",
    sw: "Shirika la kijamii lililosajiliwa na kujitolea kwa huduma ya watoto yatima.",
  },
  
  // Login Page
  "login.backToHome": {
    en: "Back to Home",
    sw: "Rudi Nyumbani",
  },
  "login.welcomeBack": {
    en: "Welcome Back",
    sw: "Karibu Tena",
  },
  "login.signInAccess": {
    en: "Sign in to access your dashboard",
    sw: "Ingia ili kupata dashibodi yako",
  },  "login.username": {
    en: "Username",
    sw: "Jina la mtumiaji",
  },
  "login.enterUsername": {
    en: "Enter your username",
    sw: "Ingiza jina lako la mtumiaji",
  },
  "login.password": {
    en: "Password",
    sw: "Nenosiri",
  },
  "login.enterPassword": {
    en: "Enter your password",
    sw: "Ingiza nenosiri lako",
  },
  "login.forgotPassword": {
    en: "Forgot password?",
    sw: "Umesahau nenosiri?",
  },
  "login.signIn": {
    en: "Sign In",
    sw: "Ingia",
  },
  "login.loggingIn": {
    en: "Logging in...",
    sw: "Inaingia...",
  },
  "login.termsAgreement": {
    en: "By logging in, you agree to our",
    sw: "Kwa kuingia, unakubali",
  },
  "login.termsOfService": {
    en: "Terms of Service",
    sw: "Masharti ya Huduma",
  },
  "login.and": {
    en: "and",
    sw: "na",
  },
  "login.privacyPolicy": {
    en: "Privacy Policy",
    sw: "Sera ya Faragha",
  },
  "login.orphanageSystem": {
    en: "Orphanage Management System",
    sw: "Mfumo wa Usimamizi wa Makazi ya Watoto Yatima",
  },
  "login.empoweringCaregivers": {
    en: "Empowering caregivers and administrators to provide the best support for children in need.",
    sw: "Kuwawezesha walezi na wasimamizi kutoa msaada bora kwa watoto wanaohitaji.",
  },
  "login.copyright": {
    en: "© 2025 Orphanage Management System. All rights reserved.",
    sw: "© 2025 Mfumo wa Usimamizi wa Makazi ya Watoto Yatima. Haki zote zimehifadhiwa.",
  },
  "login.usernameRequired": {
    en: "Username is required",
    sw: "Jina la mtumiaji linahitajika",
  },
  "login.passwordRequired": {
    en: "Password is required",
    sw: "Nenosiri linahitajika",
  },
  "login.invalidCredentials": {
    en: "Invalid username or password",
    sw: "Jina la mtumiaji au nenosiri batili",
  },
  "login.networkError": {
    en: "Unable to connect to the server. Please check your internet connection or try again later.",
    sw: "Haiwezi kuunganisha na seva. Tafadhali angalia muunganisho wako wa intaneti au jaribu tena baadaye.",
  },  "login.generalError": {
    en: "An error occurred during login",
    sw: "Hitilafu imetokea wakati wa kuingia",
  },
  
  // Admin Dashboard
  "admin.dashboard.title": {
    en: "Admin Dashboard",
    sw: "Dashibodi ya Msimamizi",
  },
  "admin.dashboard.welcome": {
    en: "Welcome back",
    sw: "Karibu tena",
  },
  "admin.dashboard.overview": {
    en: "Here's an overview of",
    sw: "Hapa ni muhtasari wa",
  },
  "admin.dashboard.yourBranch": {
    en: "your branch",
    sw: "tawi lako",
  },
  "admin.dashboard.loading": {
    en: "Loading dashboard...",
    sw: "Inapakia dashibodi...",
  },
  "admin.dashboard.totalOrphans": {
    en: "Total Orphans",
    sw: "Jumla ya Yatima",
  },
  "admin.dashboard.currentBranchTotal": {
    en: "Current branch total",
    sw: "Jumla ya tawi la sasa",
  },
  "admin.dashboard.totalFunds": {
    en: "Total Funds",
    sw: "Jumla ya Fedha",
  },
  "admin.dashboard.fundsRaised": {
    en: "Total funds raised",
    sw: "Jumla ya fedha zilizokusanywa",
  },
  "admin.dashboard.branchName": {
    en: "Branch Name",
    sw: "Jina la Tawi",
  },
  "admin.dashboard.currentLocation": {
    en: "Current location",
    sw: "Mahali pa sasa",
  },
  "admin.dashboard.activeBranch": {
    en: "Active Branch",
    sw: "Tawi Linalofanya Kazi",
  },
  "admin.dashboard.volunteers": {
    en: "Volunteers",
    sw: "Wajitolea",
  },
  "admin.dashboard.fromLastMonth": {
    en: "+3 from last month",
    sw: "+3 kutoka mwezi uliopita",
  },
  "admin.dashboard.recentActivities": {
    en: "Recent Activities",
    sw: "Shughuli za Hivi Karibuni",
  },
  "admin.dashboard.unreadNotifications": {
    en: "You have",
    sw: "Una",
  },
  "admin.dashboard.unreadNotificationsIn": {
    en: "unread notifications in",
    sw: "arifa zisizosomwa katika",
  },
  "admin.dashboard.refreshNotifications": {
    en: "Refresh notifications",
    sw: "Onyesha upya arifa",
  },
  "admin.dashboard.markAllAsRead": {
    en: "Mark all as read",
    sw: "Weka zote kama zimesomwa",
  },
  "admin.dashboard.markingAll": {
    en: "Marking all...",
    sw: "Inaweka zote...",
  },
  "admin.dashboard.noNotifications": {
    en: "No notifications at this time",
    sw: "Hakuna arifa kwa sasa",
  },
  "admin.dashboard.new": {
    en: "New",
    sw: "Mpya",
  },
  "admin.dashboard.markingAsRead": {
    en: "Marking as read...",
    sw: "Inaweka kama imesomwa...",
  },
  "admin.dashboard.upcomingEvents": {
    en: "Upcoming Events",
    sw: "Matukio Yajayo",
  },
  "admin.dashboard.eventsScheduled": {
    en: "Events scheduled for the next 30 days",
    sw: "Matukio yaliyopangwa kwa siku 30 zijazo",
  },
  "admin.dashboard.medicalCamp": {
    en: "Medical Camp",
    sw: "Kambi ya Matibabu",
  },
  "admin.dashboard.educationWorkshop": {
    en: "Education Workshop",
    sw: "Warsha ya Elimu",
  },
  "admin.dashboard.volunteerOrientation": {
    en: "Volunteer Orientation",
    sw: "Mwelekeo wa Kujitolea",
  },
  "admin.dashboard.fundraisingGala": {
    en: "Fundraising Gala",
    sw: "Sherehe ya Kukusanya Fedha",
  },
  "admin.dashboard.sportsDay": {
    en: "Sports Day",
    sw: "Siku ya Michezo",
  },  "admin.dashboard.dateUnavailable": {
    en: "Date unavailable",
    sw: "Tarehe haipatikani",
  },

  // Orphanage Admin Dashboard
  "orphanageAdmin.dashboard.title": {
    en: "Orphanage Admin Dashboard",
    sw: "Dashibodi ya Msimamizi wa Makazi ya Watoto Yatima",
  },
  "orphanageAdmin.dashboard.errorLoading": {
    en: "Error loading dashboard data",
    sw: "Hitilafu katika kupakia data ya dashibodi",
  },
  "orphanageAdmin.dashboard.usingCachedData": {
    en: "Using cached data where available.",
    sw: "Inatumia data iliyohifadhiwa inapopatikana.",
  },
  "orphanageAdmin.dashboard.acrossAllBranches": {
    en: "Across all branches",
    sw: "Katika matawi yote",
  },
  "orphanageAdmin.dashboard.totalBranches": {
    en: "Total Branches",
    sw: "Jumla ya Matawi",
  },
  "orphanageAdmin.dashboard.activeBranches": {
    en: "Active branches",
    sw: "Matawi yanayofanya kazi",
  },
  "orphanageAdmin.dashboard.totalFundraising": {
    en: "Total Fundraising",
    sw: "Jumla ya Ukusanyaji Fedha",
  },
  "orphanageAdmin.dashboard.fundsRaisedToDate": {
    en: "Funds raised to date",
    sw: "Fedha zilizokusanywa hadi sasa",
  },
  "orphanageAdmin.dashboard.totalVolunteers": {
    en: "Total Volunteers",
    sw: "Jumla ya Wajitolea",
  },  "orphanageAdmin.dashboard.activeVolunteers": {
    en: "Active volunteers",
    sw: "Wajitolea wanaofanya kazi",
  },
  "orphanageAdmin.dashboard.notifications": {
    en: "Notifications",
    sw: "Arifa",
  },
  // Supervisor Dashboard specific translations
  "supervisor.dashboard.title": {
    en: "Branch Supervisor Dashboard",
    sw: "Dashibodi ya Msimamizi wa Tawi",
  },
  "supervisor.dashboard.branchInfo": {
    en: "Branch Information",
    sw: "Taarifa za Tawi",
  },  "supervisor.dashboard.currentBranch": {
    en: "Your current branch",
    sw: "Tawi lako la sasa",
  },
  "supervisor.dashboard.notifications": {
    en: "Branch Notifications",
    sw: "Arifa za Tawi",
  },  "supervisor.dashboard.recentNotifications": {
    en: "Recent branch notifications",
    sw: "Arifa za hivi karibuni za tawi",
  },  "supervisor.dashboard.activities": {
    en: "Branch Activities",
    sw: "Shughuli za Tawi",
  },  "supervisor.dashboard.recentActivities": {
    en: "Recent activities in your branch",
    sw: "Shughuli za hivi karibuni katika tawi lako",
  },
  "supervisor.dashboard.volunteers": {
    en: "Volunteers",
    sw: "Wataoa huduma za kujitolea",
  },
  "supervisor.dashboard.activeVolunteers": {
    en: "Active volunteers",
    sw: "Wataoa huduma za kujitolea walio hai",
  },
  "supervisor.dashboard.fundraising": {
    en: "Fundraising",
    sw: "Ukusanyaji Fedha",
  },
  "supervisor.dashboard.totalFunds": {
    en: "Total funds raised",
    sw: "Jumla ya fedha zilizokusanywa",
  },
  "supervisor.dashboard.currentOrphans": {
    en: "Current orphans in care",
    sw: "Yatima walio chini ya malezi",
  },
  "supervisor.orphans.management": {
    en: "Branch Orphan Management",
    sw: "Usimamizi wa Yatima wa Tawi",
  },
  "supervisor.orphans.description": {
    en: "View and manage orphans in your branch",
    sw: "Angalia na simamizi yatima katika tawi lako",
  },
  "orphanageAdmin.dashboard.recentNotifications": {
    en: "Recent system notifications",
    sw: "Arifa za hivi karibuni za mfumo",
  },
  "orphanageAdmin.dashboard.recentSystemActivities": {
    en: "Recent System Activities",
    sw: "Shughuli za Hivi Karibuni za Mfumo",
  },
  "orphanageAdmin.dashboard.latestActions": {
    en: "Latest actions in the system",
    sw: "Vitendo vya hivi karibuni katika mfumo",
  },
  "orphanageAdmin.dashboard.allBranches": {
    en: "All branches",
    sw: "Matawi yote",
  },
  "orphanageAdmin.dashboard.activity.newBranch": {
    en: "New branch added",
    sw: "Tawi jipya limeongezwa",
  },
  "orphanageAdmin.dashboard.activity.adminCreated": {
    en: "Admin account created",
    sw: "Akaunti ya msimamizi imeundwa",
  },
  "orphanageAdmin.dashboard.activity.systemUpdate": {
    en: "System update completed",
    sw: "Usasishaji wa mfumo umekamilika",
  },
  "orphanageAdmin.dashboard.activity.fundraiserApproved": {
    en: "Fundraiser campaign approved",
    sw: "Kampeni ya ukusanyaji fedha imeidhinishwa",
  },
  "orphanageAdmin.dashboard.activity.inventoryAudit": {
    en: "Inventory audit completed",
    sw: "Uhakiki wa bidhaa umekamilika",
  },
  "orphanageAdmin.dashboard.time.twoDaysAgo": {
    en: "2 days ago",
    sw: "siku 2 zilizopita",
  },
  "orphanageAdmin.dashboard.time.threeDaysAgo": {
    en: "3 days ago",
    sw: "siku 3 zilizopita",
  },
  "orphanageAdmin.dashboard.time.fiveDaysAgo": {
    en: "5 days ago",
    sw: "siku 5 zilizopita",
  },
  "orphanageAdmin.dashboard.time.oneWeekAgo": {
    en: "1 week ago",
    sw: "wiki 1 iliyopita",
  },
  "admin.dashboard.admin": {
    en: "Admin",
    sw: "Msimamizi",
  },

  // Orphan Management
  "orphans.management": {
    en: "Orphan Management",
    sw: "Usimamizi wa Yatima",
  },
  "orphans.description": {
    en: "View and manage orphans across all branches",
    sw: "Angalia na simamia yatima katika matawi yote",
  },
  "orphans.add": {
    en: "Add Orphan",
    sw: "Ongeza Yatima",
  },
  "orphans.filter.all": {
    en: "All Orphans",
    sw: "Yatima Wote",
  },
  "orphans.filter.active": {
    en: "Active Orphans",
    sw: "Yatima Wanavyofanya Kazi",
  },
  "orphans.filter.graduated": {
    en: "Graduated Orphans",
    sw: "Yatima Waliohitimu",
  },  "orphans.filter.inactive": {
    en: "Inactive Orphans",
    sw: "Yatima Wasiohai",
  },
  "orphans.search": {
    en: "Search orphans...",
    sw: "Tafuta yatima...",
  },
  "orphans.filter.branch": {
    en: "Filter by branch",
    sw: "Chuja kwa tawi",
  },
  "orphans.filter.status": {
    en: "Filter by status",
    sw: "Chuja kwa hali",
  },
  "orphans.loading": {
    en: "Loading orphan records...",
    sw: "Inapakia rekodi za yatima...",
  },
  "orphans.error": {
    en: "Failed to load orphans data. Please try again later.",
    sw: "Imeshindwa kupakia data za yatima. Tafadhali jaribu tena baadaye.",
  },  "orphans.tryAgain": {
    en: "Try Again",
    sw: "Jaribu Tena",
  },
  "status.active": {
    en: "Active",
    sw: "Hai",
  },  "status.inactive": {
    en: "Inactive", 
    sw: "Si Hai",
  },
  "orphans.noData": {
    en: "No orphans found matching your criteria.",
    sw: "Hakuna yatima waliopatikana wanaolingana na vigezo vyako.",
  },
  "orphans.details": {
    en: "View Details",
    sw: "Angalia Maelezo",
  },
  "orphans.edit": {
    en: "Edit Orphan",
    sw: "Hariri Yatima",
  },
  "orphans.delete": {
    en: "Delete Orphan",
    sw: "Futa Yatima",
  },
  "orphans.confirmDelete": {
    en: "Are you sure you want to delete this orphan record?",
    sw: "Je, una uhakika unataka kufuta rekodi hii ya yatima?",
  },
  "orphans.deleteSuccess": {
    en: "Orphan record deleted successfully",
    sw: "Rekodi ya yatima imefutwa kwa mafanikio",
  },
  "orphans.deleteFail": {
    en: "Failed to delete orphan record",
    sw: "Imeshindwa kufuta rekodi ya yatima",
  },
  "orphans.addSuccess": {
    en: "Orphan record added successfully",
    sw: "Rekodi ya yatima imeongezwa kwa mafanikio",
  },  "orphans.addFail": {
    en: "Failed to add orphan record",
    sw: "Imeshindwa kuongeza rekodi ya yatima",
  },
  "orphans.updateSuccess": {
    en: "Orphan Updated",
    sw: "Yatima Imesasishwa",
  },
  "orphans.updateSuccessDesc": {
    en: "Orphan details have been successfully updated.",
    sw: "Maelezo ya yatima yamefanikiwa kusasishwa.",
  },
  "orphans.updateFail": {
    en: "Update Failed",
    sw: "Imeshindwa Kusasisha",
  },
  "common.errorTryAgain": {
    en: "Something went wrong. Please try again.",
    sw: "Hitilafu imetokea. Tafadhali jaribu tena.",
  },
  "orphans.editSuccess": {
    en: "Orphan record updated successfully",
    sw: "Rekodi ya yatima imesasishwa kwa mafanikio",
  },
  "orphans.editFail": {
    en: "Failed to update orphan record",
    sw: "Imeshindwa kusasisha rekodi ya yatima",
  },

  // Volunteer Management
  "volunteer.management": {
    en: "Volunteer Management",
    sw: "Usimamizi wa Kujitolea",
  },
   "volunteer.description": {
    en: "Review, approve, and manage volunteer applications",
    sw: "Kagua, idhinisha, na simamia maombi ya kujitolea",
  },
  "volunteer.search": {
    en: "Search volunteers...",
    sw: "Tafuta wajitolea...",
  },
  "volunteer.filter.all": {
    en: "All Volunteers",
    sw: "Wajitolea Wote",
  },
  "volunteer.filter.pending": {
    en: "Pending Applications",
    sw: "Maombi Yanayosubiri",
  },
  "volunteer.filter.approved": {
    en: "Approved Volunteers",
    sw: "Wajitolea Walioidhinishwa",
  },
  "volunteer.filter.rejected": {
    en: "Rejected Applications",
    sw: "Maombi Yaliyokataliwa",
  },
  "volunteer.filter.status": {
    en: "Filter by status",
    sw: "Chuja kwa hali",
  },
  "volunteer.loading": {
    en: "Loading volunteers...",
    sw: "Inapakia wajitolea...",
  },
  "volunteer.error": {
    en: "Failed to load volunteers. Please try again later.",
    sw: "Imeshindwa kupakia wajitolea. Tafadhali jaribu tena baadaye.",
  },
  "volunteer.tryAgain": {
    en: "Try Again",
    sw: "Jaribu Tena",
  },
  "volunteer.noData": {
    en: "No volunteers found matching your criteria.",
    sw: "Hakuna wajitolea waliopatikana wanaolingana na vigezo vyako.",
  },
  "volunteer.details": {
    en: "View Details",
    sw: "Angalia Maelezo",
  },
  "volunteer.approve": {
    en: "Approve",
    sw: "Idhinisha",
  },
  "volunteer.reject": {
    en: "Reject",
    sw: "Kataa",
  },
  "volunteer.delete": {
    en: "Remove",
    sw: "Ondoa",
  },
  "volunteer.approveSuccess": {
    en: "Volunteer approved successfully",
    sw: "Mjitolea ameidhinishwa kwa mafanikio",
  },
  "volunteer.approveFail": {
    en: "Failed to approve volunteer. Please try again.",
    sw: "Imeshindwa kuidhinisha mjitolea. Tafadhali jaribu tena.",
  },
  "volunteer.rejectSuccess": {
    en: "Volunteer rejected successfully",
    sw: "Mjitolea amekataliwa kwa mafanikio",
  },
  "volunteer.rejectFail": {
    en: "Failed to reject volunteer. Please try again.",
    sw: "Imeshindwa kukataa mjitolea. Tafadhali jaribu tena.",
  },
  "volunteer.deleteSuccess": {
    en: "Volunteer removed successfully",
    sw: "Mjitolea ameondolewa kwa mafanikio",
  },
  "volunteer.deleteFail": {
    en: "Failed to remove volunteer. Please try again.",
    sw: "Imeshindwa kuondoa mjitolea. Tafadhali jaribu tena.",
  },
  "volunteer.rejectDialog.title": {
    en: "Reject Volunteer Application",
    sw: "Kataa Maombi ya Kujitolea",
  },
  "volunteer.rejectDialog.description": {
    en: "Please provide a reason for rejecting this volunteer application. This will be sent to the applicant.",
    sw: "Tafadhali toa sababu ya kukataa maombi haya ya kujitolea. Hii itatumwa kwa mwombaji.",
  },
  "volunteer.rejectDialog.reason": {
    en: "Rejection Reason",
    sw: "Sababu ya Kukataa",
  },
  "volunteer.rejectDialog.placeholder": {
    en: "Enter reason for rejection...",
    sw: "Ingiza sababu ya kukataa...",
  },
  "volunteer.rejectDialog.cancel": {
    en: "Cancel",
    sw: "Ghairi",
  },
  "volunteer.rejectDialog.confirm": {
    en: "Confirm Rejection",
    sw: "Thibitisha Kukataa",
  },
  "volunteer.rejectDialog.required": {
    en: "A reason is required",
    sw: "Sababu inahitajika",
  },

  // Volunteer card translations
  "volunteer.card.pending": {
    en: "Pending",
    sw: "Inasubiri",
  },
  "volunteer.card.approved": {
    en: "Approved",
    sw: "Imeidhinishwa",
  },
  "volunteer.card.rejected": {
    en: "Rejected",
    sw: "Imekataliwa",
  },
  "volunteer.card.approve": {
    en: "Approve",
    sw: "Idhinisha",
  },
  "volunteer.card.reject": {
    en: "Reject",
    sw: "Kataa",
  },
  "volunteer.card.rejectionReason": {
    en: "Rejection Reason",
    sw: "Sababu ya Kukataa",
  },
  "volunteer.card.email": {
    en: "Email",
    sw: "Barua pepe",
  },
  "volunteer.card.phone": {
    en: "Phone",
    sw: "Simu",
  },
  "volunteer.card.scheduledDate": {
    en: "Scheduled Date",
    sw: "Tarehe Iliyopangwa",
  },
  "volunteer.card.jobRole": {
    en: "Job Role",
    sw: "Jukumu la Kazi",
  },
  "volunteer.card.registeredOn": {
    en: "Registered On",
    sw: "Alisajiliwa Tarehe",
  },
  "volunteer.card.notProvided": {
    en: "Not provided",
    sw: "Haikutolewa",
  },
  "volunteer.card.unknown": {
    en: "Unknown",
    sw: "Haijulikani",
  },  "volunteer.card.branchId": {
    en: "Branch ID",
    sw: "Kitambulisho cha Tawi",
  },

  // Orphan card translations
  "orphan.card.id": {
    en: "ID",
    sw: "Kitambulisho",
  },
  "orphan.card.age": {
    en: "Age",
    sw: "Umri",
  },
  "orphan.card.male": {
    en: "Male",
    sw: "Kiume",
  },
  "orphan.card.female": {
    en: "Female",
    sw: "Kike",
  },
  "orphan.card.personal": {
    en: "Personal",
    sw: "Binafsi",
  },
  "orphan.card.academic": {
    en: "Academic",
    sw: "Kielimu",
  },
  "orphan.card.medical": {
    en: "Medical",
    sw: "Kimatibabu",
  },
  "orphan.card.guardian": {
    en: "Guardian",
    sw: "Mlezi",
  },
  "orphan.card.origin": {
    en: "Origin",
    sw: "Asili",
  },
  "orphan.card.dateOfBirth": {
    en: "Date of Birth",
    sw: "Tarehe ya Kuzaliwa",
  },
  "orphan.card.religion": {
    en: "Religion",
    sw: "Dini",
  },
  "orphan.card.bloodGroup": {
    en: "Blood Group",
    sw: "Aina ya Damu",
  },
  "orphan.card.adoptionReason": {
    en: "Adoption Reason",
    sw: "Sababu ya Kukuza",
  },
  "orphan.card.semester": {
    en: "Semester",
    sw: "Muhula",
  },
  "orphan.card.gradeLevel": {
    en: "Grade Level",
    sw: "Kiwango cha Darasa",
  },
  "orphan.card.schoolName": {
    en: "School Name",
    sw: "Jina la Shule",
  },
  "orphan.card.subjects": {
    en: "Subjects",
    sw: "Masomo",
  },
  "orphan.card.subject": {
    en: "Subject",
    sw: "Somo",
  },
  "orphan.card.code": {
    en: "Code",
    sw: "Msimbo",
  },
  "orphan.card.grade": {
    en: "Grade",
    sw: "Daraja",
  },
  "orphan.card.noAcademicRecords": {
    en: "No academic records available.",
    sw: "Hakuna rekodi za kielimu zinazopatikana.",
  },
  "orphan.card.diagnosis": {
    en: "Diagnosis",
    sw: "Utambuzi",
  },
  "orphan.card.treatment": {
    en: "Treatment",
    sw: "Matibabu",
  },
  "orphan.card.description": {
    en: "Description",
    sw: "Maelezo",
  },
  "orphan.card.doctor": {
    en: "Doctor",
    sw: "Daktari",
  },
  "orphan.card.hospital": {
    en: "Hospital",
    sw: "Hospitali",
  },
  "orphan.card.hospitalAddress": {
    en: "Hospital Address",
    sw: "Anwani ya Hospitali",
  },
  "orphan.card.hospitalPhone": {
    en: "Hospital Phone",
    sw: "Simu ya Hospitali",
  },
  "orphan.card.noMedicalRecords": {
    en: "No medical records available.",
    sw: "Hakuna rekodi za kimatibabu zinazopatikana.",
  },
  "orphan.card.name": {
    en: "Name",
    sw: "Jina",
  },
  "orphan.card.relationship": {
    en: "Relationship",
    sw: "Uhusiano",
  },
  "orphan.card.contactNumber": {
    en: "Contact Number",
    sw: "Nambari ya Mawasiliano",
  },
  "orphan.card.email": {
    en: "Email",
    sw: "Barua pepe",
  },
  "orphan.card.occupation": {
    en: "Occupation",
    sw: "Kazi",
  },
  "orphan.card.address": {
    en: "Address",
    sw: "Anwani",
  },  "orphan.card.noGuardianInfo": {
    en: "No guardian information available.",
    sw: "Hakuna taarifa za mlezi zinazopatikana.",
  },

  // Orphan details translations
  "orphan.details.profileImage": {
    en: "Profile Image",
    sw: "Picha ya Wasifu",
  },
  "orphan.details.personalInformation": {
    en: "Personal Information",
    sw: "Taarifa za Binafsi",
  },
  "orphan.details.active": {
    en: "Active",
    sw: "Hai",
  },
  "orphan.details.inactive": {
    en: "Inactive",
    sw: "Haikai",
  },
  "orphan.details.editDetails": {
    en: "Edit Details",
    sw: "Hariri Maelezo",
  },
  "orphan.details.activate": {
    en: "Activate",
    sw: "Washa",
  },
  "orphan.details.inactivate": {
    en: "Inactivate",
    sw: "Zima",
  },
  "orphan.details.fullName": {
    en: "Full Name",
    sw: "Jina Kamili",
  },
  "orphan.details.age": {
    en: "Age",
    sw: "Umri",
  },
  "orphan.details.years": {
    en: "years",
    sw: "miaka",
  },
  "orphan.details.dateOfBirth": {
    en: "Date of Birth",
    sw: "Tarehe ya Kuzaliwa",
  },
  "orphan.details.gender": {
    en: "Gender",
    sw: "Jinsia",
  },
  "orphan.details.male": {
    en: "Male",
    sw: "Kiume",
  },
  "orphan.details.female": {
    en: "Female",
    sw: "Kike",
  },
  "orphan.details.origin": {
    en: "Origin",
    sw: "Asili",
  },
  "orphan.details.religion": {
    en: "Religion",
    sw: "Dini",
  },
  "orphan.details.bloodGroup": {
    en: "Blood Group",
    sw: "Aina ya Damu",
  },
  "orphan.details.branch": {
    en: "Branch",
    sw: "Tawi",
  },
  "orphan.details.adoptionReason": {
    en: "Reason for Adoption",
    sw: "Sababu ya Kukuza",
  },
  "orphan.details.education": {
    en: "Education",
    sw: "Elimu",
  },
  "orphan.details.currentLevel": {
    en: "Current Level",
    sw: "Kiwango cha Sasa",
  },
  "orphan.details.certificateRecords": {
    en: "Certificate Records",
    sw: "Rekodi za Vyeti",
  },
  "orphan.details.certificateRecordsDesc": {
    en: "View and manage important certificates and documents",
    sw: "Angalia na simamia vyeti na nyaraka muhimu",
  },
  "orphan.details.educationCertificate": {
    en: "Education Certificate",
    sw: "Cheti cha Elimu",
  },
  "orphan.details.birthCertificate": {
    en: "Birth Certificate",
    sw: "Cheti cha Kuzaliwa",
  },
  "orphan.details.uploadCertificate": {
    en: "Upload Certificate",
    sw: "Pakia Cheti",
  },
  "orphan.details.addCertificate": {
    en: "Add Certificate",
    sw: "Ongeza Cheti",
  },
  "orphan.details.noCertificates": {
    en: "No certificates available",
    sw: "Hakuna vyeti vilivyopatikana",
  },
  "orphan.details.certificateType": {
    en: "Certificate Type",
    sw: "Aina ya Cheti",
  },
  "orphan.details.certificateDate": {
    en: "Date Uploaded",
    sw: "Tarehe ya Kupakia",
  },
  "orphan.details.certificateOptions": {
    en: "Options",
    sw: "Chaguo",
  },
  
  // Orphan Certificates Tab
  "orphan.certificates.addTitle": {
    en: "Add Certificate",
    sw: "Ongeza Cheti",
  },
  "orphan.certificates.addDescription": {
    en: "Upload an official document or certificate for this orphan",
    sw: "Pakia hati rasmi au cheti cha mtoto huyu yatima",
  },
  "orphan.certificates.detailsTitle": {
    en: "Certificate Details",
    sw: "Maelezo ya Cheti",
  },
  "orphan.certificates.type": {
    en: "Certificate Type",
    sw: "Aina ya Cheti",
  },
  "orphan.certificates.selectType": {
    en: "Select certificate type",
    sw: "Chagua aina ya cheti",
  },
  "orphan.certificates.birthCertificate": {
    en: "Birth Certificate",
    sw: "Cheti cha Kuzaliwa",
  },
  "orphan.certificates.class7": {
    en: "Class 7 Certificate",
    sw: "Cheti cha Darasa la 7",
  },
  "orphan.certificates.form4": {
    en: "Form 4 Certificate",
    sw: "Cheti cha Kidato cha 4",
  },
  "orphan.certificates.form6": {
    en: "Form 6 Certificate",
    sw: "Cheti cha Kidato cha 6",
  },
  "orphan.certificates.issueDate": {
    en: "Issue Date",
    sw: "Tarehe ya Kutolewa",
  },
  "orphan.certificates.file": {
    en: "Certificate File",
    sw: "Faili ya Cheti",
  },
  "orphan.certificates.fileDescription": {
    en: "Upload PDF, JPG, PNG or document file. Maximum size: 5MB.",
    sw: "Pakia faili ya PDF, JPG, PNG au waraka. Ukubwa wa juu: 5MB.",
  },
  "orphan.certificates.description": {
    en: "Description",
    sw: "Maelezo",
  },
  "orphan.certificates.descriptionPlaceholder": {
    en: "Enter a brief description of this certificate",
    sw: "Ingiza maelezo mafupi ya cheti hiki",
  },
  "orphan.certificates.cancel": {
    en: "Cancel",
    sw: "Ghairi",
  },
  "orphan.certificates.save": {
    en: "Save Certificate",
    sw: "Hifadhi Cheti",
  },
  "orphan.certificates.saving": {
    en: "Saving...",
    sw: "Inahifadhi...",
  },
  "orphan.certificates.requiredFields": {
    en: "Please fill in all required fields",
    sw: "Tafadhali jaza sehemu zote zinazohitajika",
  },
  
  // Additional certificate types for display
  "orphan.details.class7Certificate": {
    en: "Class 7 Certificate",
    sw: "Cheti cha Darasa la 7",
  },
  "orphan.details.form4Certificate": {
    en: "Form 4 Certificate",
    sw: "Cheti cha Kidato cha 4",
  },
  "orphan.details.form6Certificate": {
    en: "Form 6 Certificate",
    sw: "Cheti cha Kidato cha 6",
  },
  "orphan.details.viewCertificate": {
    en: "View",
    sw: "Angalia",
  },
  "orphan.details.uploadGuardianPhoto": {
    en: "Upload Photo",
    sw: "Pakia Picha",
  },
  "orphan.details.uploadPhoto": {
    en: "Upload Photo",
    sw: "Pakia Picha",
  },
  "orphan.details.currentSchool": {
    en: "Current School",
    sw: "Shule ya Sasa",
  },
  "orphan.details.notEnrolled": {
    en: "Not enrolled",
    sw: "Hajaandikishwa",
  },
  "orphan.details.previousSchool": {
    en: "Previous School",
    sw: "Shule ya Awali",
  },
  "orphan.details.none": {
    en: "None",
    sw: "Hakuna",
  },
  "orphan.details.specialNeeds": {
    en: "Special Needs",
    sw: "Mahitaji Maalum",
  },
  "orphan.details.hobbies": {
    en: "Hobbies",
    sw: "Burudani",
  },
  "orphan.details.allergies": {
    en: "Allergies",
    sw: "Mzio",
  },
  "orphan.details.noKnownAllergies": {
    en: "No known allergies",
    sw: "Hakuna mzio unaojulikana",
  },
  "orphan.details.activateOrphan": {
    en: "Activate Orphan",
    sw: "Washa Yatima",
  },
  "orphan.details.activateOrphanDesc": {
    en: "You are about to change the status of this orphan to active. Please provide a reason for this change.",
    sw: "Unakaribia kubadilisha hali ya yatima huyu kuwa hai. Tafadhali toa sababu ya mabadiliko haya.",
  },
  "orphan.details.reasonForActivation": {
    en: "Reason for activation",
    sw: "Sababu ya kuwasha",
  },
  "orphan.details.activationPlaceholder": {
    en: "Explain why you're activating this orphan...",
    sw: "Eleza kwa nini unawasha yatima huyu...",
  },
  "orphan.details.cancel": {
    en: "Cancel",
    sw: "Ghairi",
  },
  "orphan.details.processing": {
    en: "Processing...",
    sw: "Inachakata...",
  },
  "orphan.details.inactivateOrphan": {
    en: "Inactivate Orphan",
    sw: "Zima Yatima",
  },
  "orphan.details.inactivateOrphanDesc": {
    en: "You are about to change the status of this orphan to inactive. This will remove them from active lists but preserve their records. Please provide a reason for this change.",
    sw: "Unakaribia kubadilisha hali ya yatima huyu kuwa haikai. Hii itawaondoa kwenye orodha za walio hai lakini itahifadhi rekodi zao. Tafadhali toa sababu ya mabadiliko haya.",
  },
  "orphan.details.reasonForInactivation": {
    en: "Reason for inactivation",
    sw: "Sababu ya kuzima",
  },
  "orphan.details.inactivationPlaceholder": {
    en: "Explain why you're inactivating this orphan...",
    sw: "Eleza kwa nini unazima yatima huyu...",
  },
  "orphan.details.guardianInformation": {
    en: "Guardian Information",
    sw: "Taarifa za Mlezi",
  },
  "orphan.details.guardianInformationDesc": {
    en: "Information about the primary guardian",
    sw: "Taarifa kuhusu mlezi mkuu",
  },
  "orphan.details.edit": {
    en: "Edit",
    sw: "Hariri",
  },
  "orphan.details.addGuardian": {
    en: "Add Guardian",
    sw: "Ongeza Mlezi",
  },
  "orphan.details.editGuardian": {
    en: "Edit Guardian",
    sw: "Hariri Mlezi",
  },
  "orphan.details.name": {
    en: "Name",
    sw: "Jina",
  },
  "orphan.details.relationship": {
    en: "Relationship",
    sw: "Uhusiano",
  },
  "orphan.details.phoneNumber": {
    en: "Phone Number",
    sw: "Nambari ya Simu",
  },
  "orphan.details.email": {
    en: "Email",
    sw: "Barua pepe",
  },
  "orphan.details.address": {
    en: "Address",
    sw: "Anwani",
  },
  "orphan.details.occupation": {
    en: "Occupation",
    sw: "Kazi",
  },
  "orphan.details.noGuardianInfo": {
    en: "No guardian information available",
    sw: "Hakuna taarifa za mlezi zinazopatikana",
  },
  "orphan.details.guardianAdded": {
    en: "Guardian Added",
    sw: "Mlezi Ameongezwa",
  },
  "orphan.details.guardianAddedDesc": {
    en: "Guardian information has been successfully added.",
    sw: "Taarifa za mlezi zimeongezwa kwa mafanikio.",
  },
  "orphan.details.guardianAddFailed": {
    en: "Failed to Add Guardian",
    sw: "Imeshindwa Kuongeza Mlezi",
  },
  "orphan.details.errorOccurred": {
    en: "An error occurred. Please try again.",
    sw: "Hitilafu imetokea. Tafadhali jaribu tena.",
  },
  "orphan.details.guardianUpdated": {
    en: "Guardian Updated",
    sw: "Mlezi Amebadilishwa",
  },
  "orphan.details.guardianUpdatedDesc": {
    en: "Guardian information has been successfully updated.",
    sw: "Taarifa za mlezi zimebadilishwa kwa mafanikio.",
  },
  "orphan.details.guardianUpdateFailed": {
    en: "Failed to Update Guardian",
    sw: "Imeshindwa Kubadilisha Mlezi",
  },
  "orphan.details.guardianDeleted": {
    en: "Guardian Deleted",
    sw: "Mlezi Amefutwa",
  },
  "orphan.details.guardianDeletedDesc": {
    en: "Guardian information has been successfully deleted.",
    sw: "Taarifa za mlezi zimefutwa kwa mafanikio.",
  },  "orphan.details.guardianDeleteFailed": {
    en: "Failed to Delete Guardian",
    sw: "Imeshindwa Kufuta Mlezi",
  },
  
  // Social Welfare Officer Details
  "orphan.details.socialWelfareOfficer": {
    en: "Social Welfare Officer",
    sw: "Afisa wa Maendeleo ya Jamii",
  },
  "orphan.details.socialWelfareOfficerDesc": {
    en: "Information about the social welfare officer who handled this case",
    sw: "Taarifa kuhusu afisa wa maendeleo ya jamii aliyeshughulikia kesi hii",
  },
  "orphan.details.officerName": {
    en: "Officer Name",
    sw: "Jina la Afisa",
  },
  "orphan.details.workPlace": {
    en: "Work Place",
    sw: "Mahali pa Kazi",
  },
  "orphan.details.officerPhone": {
    en: "Phone Number",
    sw: "Namba ya Simu",
  },
  "orphan.details.officerEmail": {
    en: "Email",
    sw: "Barua Pepe",
  },
  "orphan.details.assignedDate": {
    en: "Assigned Date",
    sw: "Tarehe ya Kupewa",
  },
  
  // Guardian Form
  "guardian.form.addGuardian": {
    en: "Add Guardian",
    sw: "Ongeza Mlezi",
  },
  "guardian.form.editGuardian": {
    en: "Edit Guardian",
    sw: "Hariri Mlezi",
  },
  "guardian.form.addDescription": {
    en: "Enter the guardian details below. Required fields are marked with an asterisk (*).",
    sw: "Ingiza taarifa za mlezi hapa chini. Sehemu muhimu zimeonyeshwa kwa alama ya nyota (*).",
  },
  "guardian.form.editDescription": {
    en: "Update the guardian information below.",
    sw: "Sasisha taarifa za mlezi hapa chini.",
  },
  "guardian.form.requiredFields": {
    en: "Please fill in all required fields",
    sw: "Tafadhali jaza sehemu zote muhimu",
  },
  "guardian.form.fullName": {
    en: "Full Name",
    sw: "Jina Kamili",
  },
  "guardian.form.relationship": {
    en: "Relationship",
    sw: "Uhusiano",
  },
  "guardian.form.selectRelationship": {
    en: "Select relationship",
    sw: "Chagua uhusiano",
  },
  "guardian.form.parent": {
    en: "Parent",
    sw: "Mzazi",
  },
  "guardian.form.grandparent": {
    en: "Grandparent",
    sw: "Babu/Bibi",
  },
  "guardian.form.sibling": {
    en: "Sibling",
    sw: "Ndugu",
  },
  "guardian.form.uncle": {
    en: "Uncle",
    sw: "Mjomba/Baba mdogo",
  },
  "guardian.form.aunt": {
    en: "Aunt",
    sw: "Shangazi/Mama mdogo",
  },
  "guardian.form.cousin": {
    en: "Cousin",
    sw: "Binamu",
  },
  "guardian.form.guardian": {
    en: "Guardian",
    sw: "Mlezi",
  },
  "guardian.form.familyFriend": {
    en: "Family Friend",
    sw: "Rafiki wa Familia",
  },
  "guardian.form.other": {
    en: "Other",
    sw: "Nyingine",
  },
  "guardian.form.phoneNumber": {
    en: "Phone Number",
    sw: "Namba ya Simu",
  },
  "guardian.form.sex": {
    en: "Sex",
    sw: "Jinsia",
  },
  "guardian.form.selectSex": {
    en: "Select sex",
    sw: "Chagua jinsia",
  },
  "guardian.form.male": {
    en: "Male",
    sw: "Mwanaume",
  },
  "guardian.form.female": {
    en: "Female",
    sw: "Mwanamke",
  },
  "guardian.form.email": {
    en: "Email",
    sw: "Barua pepe",
  },
  "guardian.form.address": {
    en: "Address",
    sw: "Anwani",
  },
  "guardian.form.occupation": {
    en: "Occupation",
    sw: "Kazi",
  },
  "guardian.form.cancel": {
    en: "Cancel",
    sw: "Ghairi",
  },
  "guardian.form.update": {
    en: "Update Guardian",
    sw: "Sasisha Mlezi",
  },
  "guardian.form.add": {
    en: "Add Guardian",
    sw: "Ongeza Mlezi",
  },
  
  // Volunteer Management
  "volunteers.title": {
    en: "Volunteer Management",
    sw: "Usimamizi wa Watu wa Kujitolea",
  },
  "volunteers.description": {
    en: "Review, approve, and manage volunteer applications",
    sw: "Pitia, idhinisha, na simamia maombi ya watu wa kujitolea",
  },
  "volunteers.viewAcrossBranches": {
    en: "View and manage volunteers across all branches",
    sw: "Angalia na simamia watu wa kujitolea kutoka matawi yote",
  },
  "volunteers.search": {
    en: "Search volunteers...",
    sw: "Tafuta watu wa kujitolea...",
  },
  "volunteers.status.all": {
    en: "All Volunteers",
    sw: "Watu Wote wa Kujitolea",
  },
  "volunteers.status.pending": {
    en: "Pending Approval",
    sw: "Inasubiri Idhini",
  },
  "volunteers.status.approved": {
    en: "Approved",
    sw: "Imeidhinishwa",
  },
  "volunteers.status.rejected": {
    en: "Rejected",
    sw: "Imekataliwa",
  },
  "volunteers.status.active": {
    en: "Active",
    sw: "Hai",
  },
  "volunteers.status.inactive": {
    en: "Inactive",
    sw: "Haifanyi kazi",
  },
  "volunteers.filterByStatus": {
    en: "Filter by status",
    sw: "Chuja kwa hali",
  },
  "volunteers.noResults": {
    en: "No volunteers found matching your criteria.",
    sw: "Hakuna watu wa kujitolea waliopatikana kulingana na vigezo vyako.",
  },
  "volunteers.loading": {
    en: "Loading volunteers...",
    sw: "Inapakia watu wa kujitolea...",
  },
  "volunteers.tryAgain": {
    en: "Try Again",
    sw: "Jaribu Tena",
  },
  "orphan.details.orphanUpdated": {
    en: "Orphan Updated",
    sw: "Yatima Amebadilishwa",
  },
  "orphan.details.orphanUpdatedDesc": {
    en: "Orphan information has been successfully updated.",
    sw: "Taarifa za yatima zimebadilishwa kwa mafanikio.",
  },
  "orphan.details.orphanUpdateFailed": {
    en: "Failed to Update Orphan",
    sw: "Imeshindwa Kubadilisha Yatima",
  },
  "orphan.details.orphanDeleted": {
    en: "Orphan Deleted",
    sw: "Yatima Amefutwa",
  },
  "orphan.details.orphanDeletedDesc": {
    en: "Orphan has been successfully deleted.",
    sw: "Yatima amefutwa kwa mafanikio.",
  },
  "orphan.details.orphanDeleteFailed": {
    en: "Failed to Delete Orphan",
    sw: "Imeshindwa Kufuta Yatima",
  },
  "orphan.details.orphanActivated": {
    en: "Orphan Activated",
    sw: "Yatima Amewashwa",
  },
  "orphan.details.orphanActivatedDesc": {
    en: "The orphan has been successfully activated.",
    sw: "Yatima amewashwa kwa mafanikio.",
  },
  "orphan.details.activationFailed": {
    en: "Activation Failed",
    sw: "Kuwasha Kumeshindikana",
  },
  "orphan.details.orphanInactivated": {
    en: "Orphan Inactivated",
    sw: "Yatima Amezimwa",
  },
  "orphan.details.orphanInactivatedDesc": {
    en: "The orphan has been successfully inactivated.",
    sw: "Yatima amezimwa kwa mafanikio.",
  },  "orphan.details.inactivationFailed": {
    en: "Inactivation Failed",
    sw: "Kuzima Kumeshindikana",
  },

  // Orphan form translations
  "orphan.form.requiredFields": {
    en: "Please fill in all required fields",
    sw: "Tafadhali jaza sehemu zote zinazohitajika",
  },
  "orphan.form.addNewOrphan": {
    en: "Add New Orphan",
    sw: "Ongeza Yatima Mpya",
  },
  "orphan.form.enterDetails": {
    en: "Enter the orphan's details below. Required fields are marked with an asterisk (*).",
    sw: "Ingiza maelezo ya yatima hapa chini. Sehemu zinazohitajika zimewekwa alama ya nyota (*).",
  },
  "orphan.form.personalInformation": {
    en: "Personal Information",
    sw: "Taarifa za Binafsi",
  },
  "orphan.form.fullName": {
    en: "Full Name",
    sw: "Jina Kamili",
  },
  "orphan.form.dateOfBirth": {
    en: "Date of Birth",
    sw: "Tarehe ya Kuzaliwa",
  },
  "orphan.form.gender": {
    en: "Gender",
    sw: "Jinsia",
  },
  "orphan.form.selectGender": {
    en: "Select gender",
    sw: "Chagua jinsia",
  },
  "orphan.form.male": {
    en: "Male",
    sw: "Kiume",
  },
  "orphan.form.female": {
    en: "Female",
    sw: "Kike",
  },
  "orphan.form.other": {
    en: "Other",
    sw: "Nyingine",
  },
  "orphan.form.origin": {
    en: "Origin",
    sw: "Asili",
  },
  "orphan.form.originPlaceholder": {
    en: "Enter place of origin",
    sw: "Ingiza mahali pa asili",
  },
  "orphan.form.religion": {
    en: "Religion",
    sw: "Dini",
  },
  "orphan.form.religionPlaceholder": {
    en: "Enter religion",
    sw: "Ingiza dini",
  },
  "orphan.form.bloodGroup": {
    en: "Blood Group",
    sw: "Kundi la Damu",
  },
  "orphan.form.bloodGroupPlaceholder": {
    en: "Enter blood group",
    sw: "Ingiza kundi la damu",
  },
  "orphan.form.hobbies": {
    en: "Hobbies",
    sw: "Kipaji",
  },
  "orphan.form.hobbiesPlaceholder": {
    en: "Enter hobbies",
    sw: "Ingiza kipaji",
  },
  "orphan.form.allergies": {
    en: "Allergies",
    sw: "Mzio",
  },
  "orphan.form.allergiesPlaceholder": {
    en: "Enter allergies (comma separated)",
    sw: "Ingiza mzio (tenganisha kwa koma)",
  },
  "orphan.form.education": {
    en: "Education",
    sw: "Elimu",
  },
  "orphan.form.educationLevel": {
    en: "Education Level",
    sw: "Kiwango cha Elimu",
  },
  "orphan.form.selectEducationLevel": {
    en: "Select Education Level",
    sw: "Chagua Kiwango cha Elimu",
  },
  "orphan.form.kindergarten": {
    en: "Kindergarten",
    sw: "Chekechea",
  },
  "orphan.form.primary": {
    en: "Primary",
    sw: "Shule ya Msingi",
  },
  "orphan.form.secondary": {
    en: "Secondary",
    sw: "Sekondari",
  },
  "orphan.form.highSchool": {
    en: "High School",
    sw: "Shule ya Sekondari ya Juu",
  },
  "orphan.form.college": {
    en: "College",
    sw: "Chuo",
  },
  "orphan.form.university": {
    en: "University",
    sw: "Chuo Kikuu",
  },
  "orphan.form.none": {
    en: "None",
    sw: "Hakuna",
  },
  "orphan.form.previousSchool": {
    en: "Previous School",
    sw: "Shule ya Awali",
  },
  "orphan.form.previousSchoolPlaceholder": {
    en: "Enter previous school name",
    sw: "Ingiza jina la shule ya awali",
  },
  "orphan.form.additionalInformation": {
    en: "Additional Information",
    sw: "Taarifa za Ziada",
  },
  "orphan.form.specialNeeds": {
    en: "Special Needs",
    sw: "Mahitaji Maalum",
  },
  "orphan.form.specialNeedsPlaceholder": {
    en: "Describe any special needs",
    sw: "Eleza mahitaji maalum yoyote",
  },
  "orphan.form.medicalHistory": {
    en: "Medical History",
    sw: "Historia ya Matibabu",
  },
  "orphan.form.medicalHistoryPlaceholder": {
    en: "Enter medical history details",
    sw: "Ingiza maelezo ya historia ya matibabu",
  },
  "orphan.form.adoptionReason": {
    en: "Adoption Reason",
    sw: "Sababu ya Kuasili",
  },
  "orphan.form.adoptionReasonPlaceholder": {
    en: "Enter reason for adoption",
    sw: "Ingiza sababu ya kuasili",
  },
  "orphan.form.cancel": {
    en: "Cancel",
    sw: "Ghairi",
  },
  "orphan.form.saveOrphan": {
    en: "Save Orphan",
    sw: "Hifadhi Yatima",
  },
  
  // Social Welfare Officer translations
  "orphan.form.socialWelfareSection": {
    en: "Social Welfare Officer Information",
    sw: "Taarifa za Afisa wa Maendeleo ya Jamii",
  },
  "orphan.form.socialWelfareOfficerName": {
    en: "Officer Name",
    sw: "Jina la Afisa",
  },
  "orphan.form.socialWelfareOfficerNamePlaceholder": {
    en: "Enter name of social welfare officer",
    sw: "Ingiza jina la afisa wa maendeleo ya jamii",
  },
  "orphan.form.socialWelfareOfficerWorkPlace": {
    en: "Work Place",
    sw: "Mahali pa Kazi",
  },
  "orphan.form.socialWelfareOfficerWorkPlacePlaceholder": {
    en: "Enter work place",
    sw: "Ingiza mahali pa kazi",
  },
  "orphan.form.socialWelfareOfficerPhoneNumber": {
    en: "Phone Number",
    sw: "Namba ya Simu",
  },
  "orphan.form.socialWelfareOfficerPhoneNumberPlaceholder": {
    en: "Enter phone number",
    sw: "Ingiza namba ya simu",
  },
  "orphan.form.socialWelfareOfficerEmail": {
    en: "Email",
    sw: "Barua Pepe",
  },
  "orphan.form.socialWelfareOfficerNotes": {
    en: "Notes",
    sw: "Maelezo",
  },
  // New translation keys for new orphan form fields
  "orphan.form.arrivalDate": {
    en: "Date of Arrival",
    sw: "Tarehe ya Kuwasili",
  },
  "orphan.form.arrivalDatePlaceholder": {
    en: "Select date of arrival at the orphanage",
    sw: "Chagua tarehe ya kuwasili kwenye kituo cha watoto",
  },
  "orphan.form.referralSection": {
    en: "Referral Information",
    sw: "Taarifa za Rufaa",
  },
  "orphan.form.referralOfficer": {
    en: "Referring Officer",
    sw: "Afisa wa Rufaa",
  },
  "orphan.form.referralOfficerPlaceholder": {
    en: "Enter name of referring officer",
    sw: "Ingiza jina la afisa wa rufaa",
  },
  "orphan.form.referralDepartment": {
    en: "Department",
    sw: "Idara",
  },
  "orphan.form.referralDepartmentPlaceholder": {
    en: "Enter referring department",
    sw: "Ingiza idara ya rufaa",
  },
  "orphan.form.referralPhone": {
    en: "Officer Phone",
    sw: "Simu ya Afisa",
  },
  "orphan.form.referralPhonePlaceholder": {
    en: "Enter referring officer's phone number",
    sw: "Ingiza namba ya simu ya afisa wa rufaa",
  },
  "orphan.form.referralDate": {
    en: "Referral Date",
    sw: "Tarehe ya Rufaa",
  },
  "orphan.form.referralDocument": {
    en: "Referral Document",
    sw: "Nyaraka ya Rufaa",
  },
  "orphan.form.referralDocumentPlaceholder": {
    en: "Upload referral document",
    sw: "Pakia nyaraka ya rufaa",
  },
  "orphan.form.uploadDocument": {
    en: "Upload Document",
    sw: "Pakia Nyaraka",
  },
  "orphan.form.educationTimeFrame": {
    en: "Education Time Frame",
    sw: "Muda wa Elimu",
  },
  "orphan.form.educationStartDate": {
    en: "Start Date",
    sw: "Tarehe ya Kuanza",
  },
  "orphan.form.educationEndDate": {
    en: "End Date",
    sw: "Tarehe ya Kumaliza",
  },
  "orphan.form.educationCertificate": {
    en: "Education Certificate",
    sw: "Cheti cha Elimu",
  },
  "orphan.form.uploadCertificate": {
    en: "Upload Certificate",
    sw: "Pakia Cheti",
  },
  "orphan.form.guardianSection": {
    en: "Guardian Information",
    sw: "Taarifa za Mlezi",
  },
  "orphan.form.guardianName": {
    en: "Guardian Name",
    sw: "Jina la Mlezi",
  },
  "orphan.form.guardianNamePlaceholder": {
    en: "Enter guardian's full name",
    sw: "Ingiza jina kamili la mlezi",
  },
  "orphan.form.guardianPhone": {
    en: "Guardian Phone",
    sw: "Namba ya Simu ya Mlezi",
  },
  "orphan.form.guardianPhonePlaceholder": {
    en: "Enter guardian's phone number",
    sw: "Ingiza namba ya simu ya mlezi",
  },
  "orphan.form.guardianResidence": {
    en: "Place of Residence",
    sw: "Mahali pa Kuishi",
  },
  "orphan.form.guardianResidencePlaceholder": {
    en: "Enter guardian's place of residence",
    sw: "Ingiza mahali mlezi anapoishi",
  },
  "orphan.form.relationship": {
    en: "Relationship with Child",
    sw: "Uhusiano na Mtoto",
  },
  "orphan.form.relationshipPlaceholder": {
    en: "Enter relationship (e.g. uncle, none)",
    sw: "Ingiza uhusiano (mfano mjomba, hakuna)",
  },
  "orphan.form.guardianSex": {
    en: "Gender",
    sw: "Jinsia",
  },
  "orphan.form.guardianContactNumber": {
    en: "Contact Number",
    sw: "Namba ya Mawasiliano",
  },
  "orphan.form.guardianContactNumberPlaceholder": {
    en: "Enter contact number",
    sw: "Ingiza namba ya mawasiliano",
  },
  "orphan.form.guardianEmail": {
    en: "Email",
    sw: "Barua Pepe",
  },
  "orphan.form.guardianEmailPlaceholder": {
    en: "Enter email address",
    sw: "Ingiza anwani ya barua pepe",
  },
  "orphan.form.guardianAddress": {
    en: "Address",
    sw: "Anwani",
  },
  "orphan.form.guardianAddressPlaceholder": {
    en: "Enter address",
    sw: "Ingiza anwani",
  },
  "orphan.form.guardianOccupation": {
    en: "Occupation",
    sw: "Kazi",
  },
  "orphan.form.guardianOccupationPlaceholder": {
    en: "Enter occupation",
    sw: "Ingiza aina ya kazi",
  },
  "orphan.form.guardianRelationship": {
    en: "Relationship",
    sw: "Uhusiano",
  },
  "orphan.form.guardianRelationshipPlaceholder": {
    en: "Enter relationship (e.g. uncle, aunt)",
    sw: "Ingiza uhusiano (k.m. mjomba, shangazi)",
  },
  "orphan.form.childPhoto": {
    en: "Child Photo",
    sw: "Picha ya Mtoto",
  },
  "orphan.form.uploadChildPhoto": {
    en: "Upload Child Photo",
    sw: "Pakia Picha ya Mtoto",
  },
  "orphan.form.guardianPhoto": {
    en: "Guardian Photo",
    sw: "Picha ya Mlezi",
  },
  "orphan.form.uploadGuardianPhoto": {
    en: "Upload Guardian Photo",
    sw: "Pakia Picha ya Mlezi",
  },
  "orphan.form.birthCertificate": {
    en: "Birth Certificate",
    sw: "Cheti cha Kuzaliwa",
  },
  "orphan.form.uploadBirthCertificate": {
    en: "Upload Birth Certificate",
    sw: "Pakia Cheti cha Kuzaliwa",
  },
  "orphan.form.additionalFiles": {
    en: "Additional Files",
    sw: "Faili za Ziada",
  },
  "orphan.form.uploadAdditionalFiles": {
    en: "Upload Additional Files",
    sw: "Pakia Faili za Ziada",
  },
  "orphan.form.birthDate": {
    en: "Birth Date",
    sw: "Tarehe ya Kuzaliwa",
  },
  "orphan.form.additionalInfoTitle": {
    en: "Additional Information",
    sw: "Taarifa za Ziada",
  },
  "orphan.form.basicInfoTitle": {
    en: "Basic Information",
    sw: "Taarifa za Msingi",
  },
  "orphan.form.medicalInfoTitle": {
    en: "Medical Information",
    sw: "Taarifa za Matibabu",
  },
  "orphan.form.editTitle": {
    en: "Edit Orphan",
    sw: "Hariri Taarifa za Yatima",
  },
  "orphan.form.editDescription": {
    en: "Update the orphan's details below. Required fields are marked with an asterisk (*).",
    sw: "Sasisha taarifa za yatima hapa chini. Sehemu muhimu zimeonyeshwa kwa alama ya nyota (*).",
  },
  "orphanage.registration.howTo": {
    en: "How to Register Your Orphanage",
    sw: "Jinsi ya Kusajili Kituo chako cha Watoto Yatima",
  },
  "orphanage.registration.step1.title": {
    en: "Complete Registration Form",
    sw: "Jaza Fomu ya Usajili",
  },
  "orphanage.registration.step1.desc": {
    en: "Fill out all required information on this registration page.",
    sw: "Jaza taarifa zote zinazohitajika kwenye ukurasa huu wa usajili.",
  },
  "orphanage.registration.step2.title": {
    en: "Document Verification",
    sw: "Uthibitishaji wa Nyaraka",
  },
  "orphanage.registration.step2.desc": {
    en: "Submit your government certificate and official documents.",
    sw: "Wasilisha cheti chako cha serikali na nyaraka rasmi.",
  },
  "orphanage.registration.step3.title": {
    en: "Review Process",
    sw: "Mchakato wa Ukaguzi",
  },
  "orphanage.registration.step3.desc": {
    en: "Our team will review your application within 5-7 business days.",
    sw: "Timu yetu itakagua maombi yako ndani ya siku 5-7 za kazi.",
  },
  "orphanage.registration.step4.title": {
    en: "Account Activation",
    sw: "Uanzishaji wa Akaunti",
  },
  "orphanage.registration.step4.desc": {
    en: "Once approved, you'll receive login credentials via email.",
    sw: "Mara tu inapoidhinishwa, utapokea hati za kuingia kupitia barua pepe.",
  },
  "orphanage.registration.whyRegister": {
    en: "Benefits of Registration",
    sw: "Faida za Usajili",
  },
  "orphanage.registration.benefit1.title": {
    en: "Centralized Management",
    sw: "Usimamizi wa Pamoja",
  },
  "orphanage.registration.benefit1.desc": {
    en: "Manage orphans, staff, donations, and operations all in one place.",
    sw: "Simamia watoto yatima, wafanyakazi, michango, na shughuli zote mahali pamoja.",
  },
  "orphanage.registration.benefit2.desc": {
    en: "Connect with donors, volunteers, and support networks more efficiently.",
    sw: "Unganisha na wafadhili, kujitolea, na mitandao ya msaada kwa ufanisi zaidi.",
  },
  "orphanage.registration.benefit3.title": {
    en: "Analytics & Reporting",
    sw: "Uchambuzi na Ripoti",
  },
  "orphanage.registration.benefit3.desc": {
    en: "Benefit from analytics and reporting tools to improve your operations.",
    sw: "Nufaika kutoka kwa zana za uchambuzi na ripoti ili kuboresha shughuli zako.",
  },
  "orphanage.registration.benefit4.title": {
    en: "Transparency & Trust",
    sw: "Uwazi na Imani",
  },
  "orphanage.registration.benefit4.desc": {
    en: "Enhance transparency and trust with stakeholders and the community.",
    sw: "Boresha uwazi na imani na washikadau na jamii.",
  },
  "orphanage.registration.title": {
    en: "Orphanage Registration",
    sw: "Usajili wa Kituo cha Watoto Yatima",
  },
  "orphanage.registration.description": {
    en: "Register your orphanage in our system to streamline management, increase visibility, and connect with potential donors and volunteers.",
    sw: "Sajili kituo chako cha watoto yatima katika mfumo wetu ili kurahisisha usimamizi, kuongeza uelewa, na kuunganisha na wafadhili na watu wa kujitolea.",
  },
  "orphanage.registration.formTitle": {
    en: "Registration Form",
    sw: "Fomu ya Usajili",
  },
  "orphanage.registration.formDescription": {
    en: "Please fill out all required fields marked with an asterisk (*)",
    sw: "Tafadhali jaza sehemu zote zinazohitajika zilizowekwa alama ya nyota (*)",
  },
  "orphanage.registration.benefit2.title": {
    en: "Connect & Network",
    sw: "Unganisha na Mtandao",
  },
  "orphanage.registration.chooseFile": {
    en: "Choose file",
    sw: "Chagua faili",
  },
  "orphanage.registration.noFile": {
    en: "No file chosen",
    sw: "Hakuna faili iliyochaguliwa",
  },
  "orphanage.registration.pdfOnly": {
    en: "Only PDF files are accepted",
    sw: "Faili za PDF pekee zinakubaliwa",
  },
  "orphanage.registration.errorMessage": {
    en: "There was an error submitting your registration request. Please try again later.",
    sw: "Kulikuwa na hitilafu katika kuwasilisha ombi lako la usajili. Tafadhali jaribu tena baadaye.",
  },
  "orphanage.registration.personalDetails": {
    en: "Personal Details",
    sw: "Maelezo Binafsi",
  },
  "orphanage.registration.name": {
    en: "Name",
    sw: "Jina",
  },
  "orphanage.registration.enterName": {
    en: "Enter your full name",
    sw: "Ingiza jina lako kamili",
  },
  "orphanage.registration.gender": {
    en: "Gender",
    sw: "Jinsia",
  },
  "orphanage.registration.selectGender": {
    en: "Select Gender",
    sw: "Chagua Jinsia",
  },
  "orphanage.registration.male": {
    en: "Male",
    sw: "Mume",
  },
  "orphanage.registration.female": {
    en: "Female",
    sw: "Mke",
  },
  "orphanage.registration.email": {
    en: "Email",
    sw: "Barua Pepe",
  },
  "orphanage.registration.emailPlaceholder": {
    en: "e.g. example@email.com",
    sw: "k.m. mfano@barua.com",
  },
  "orphanage.registration.phone": {
    en: "Phone Number",
    sw: "Nambari ya Simu",
  },
  "orphanage.registration.phonePlaceholder": {
    en: "e.g. +254712345678",
    sw: "k.m. +254712345678",
  },
  "orphanage.registration.phoneFormat": {
    en: "Format: +countrycode followed by 9 digits (e.g. +254712345678)",
    sw: "Muundo: +msimbo wa nchi ikifuatiwa na tarakimu 9 (k.m. +254712345678)",
  },
  "orphanage.registration.centerDetails": {
    en: "Center Details",
    sw: "Maelezo ya Kituo",
  },
  "orphanage.registration.centerName": {
    en: "Name of Center",
    sw: "Jina la Kituo",
  },
  "orphanage.registration.enterCenterName": {
    en: "Enter center name",
    sw: "Ingiza jina la kituo",
  },
  "orphanage.registration.location": {
    en: "Location",
    sw: "Mahali",
  },
  "orphanage.registration.enterLocation": {
    en: "Enter center location",
    sw: "Ingiza eneo la kituo",
  },
  "orphanage.registration.certificate": {
    en: "Government Certificate (PDF only)",
    sw: "Cheti cha Serikali (PDF pekee)",
  },
  "orphanage.registration.submit": {
    en: "Submit",
    sw: "Wasilisha",
  },
  "orphanage.registration.thankYou": {
    en: "Thank You!",
    sw: "Asante!",
  },
  "orphanage.registration.successMessage": {
    en: "Your registration request has been submitted successfully.",
    sw: "Ombi lako la usajili limewasilishwa kwa mafanikio.",
  },
  "orphanage.registration.detailMessage": {
    en: "We appreciate your effort to join the Orphanage Information System. Our team will review your submission and contact you soon.",
    sw: "Tunashukuru jitihada yako ya kujiunga na Mfumo wa Habari wa Kituo cha Watoto Yatima. Timu yetu itakagua wasilisho lako na kuwasiliana nawe hivi karibuni.",
  },  "orphanage.registration.goHome": {
    en: "Go to Home",
    sw: "Rudi Mwanzo",
  },
  
  // Auth-related translations
  "auth.signIn": {
    en: "Sign In",
    sw: "Ingia",
  },
  "common.chooseFile": {
    en: "Choose file",
    sw: "Chagua faili",
  },
  "common.noFileChosen": {
    en: "No file chosen",
    sw: "Hakuna faili iliyochaguliwa",
  },
  
  // Superuser Dashboard and Report translations
  "superuser.dashboard.systemStats": {
    en: "The system currently manages",
    sw: "Mfumo kwa sasa unasimamia"
  },
  "superuser.dashboard.centers": {
    en: "orphanage centers",
    sw: "vituo vya watoto yatima"
  },
  "superuser.dashboard.branches": {
    en: "branches",
    sw: "matawi"
  },
  "superuser.dashboard.orphans": {
    en: "orphans",
    sw: "watoto yatima"
  },
  "superuser.dashboard.fundraising": {
    en: "TSh",
    sw: "TSh"
  },
  "superuser.dashboard.and": {
    en: "and",
    sw: "na"
  },
  "superuser.dashboard.volunteers": {
    en: "volunteers",
    sw: "watu waliojitolea"
  },
  "report.systemReport": {
    en: "System Report",
    sw: "Ripoti ya Mfumo"
  },
  "report.systemSummary": {
    en: "System Summary",
    sw: "Muhtasari wa Mfumo"
  },
  "report.orgWide": {
    en: "Organization-wide Overview",
    sw: "Muhtasari wa Shirika Zima"
  },
  "report.totalBranches": {
    en: "Total Branches",
    sw: "Jumla ya Matawi"
  },
  "report.totalOrphansCount": {
    en: "Total Orphans",
    sw: "Jumla ya Yatima"
  },
  "report.totalVolunteers": {
    en: "Total Volunteers",
    sw: "Jumla ya Watu Waliojitolea"
  },
  "report.totalFundraisers": {
    en: "Total Fundraisers",
    sw: "Jumla ya Michango"
  },
  "report.branchComparison": {
    en: "Branch Comparison",
    sw: "Ulinganisho wa Matawi"
  },
  "report.centreComparison": {
    en: "Centre Comparison",
    sw: "Ulinganisho wa Vituo"
  },
  "report.performanceMetrics": {
    en: "Performance Metrics",
    sw: "Vigezo vya Utendaji"
  },
  "report.branchPrefix": {
    en: "Branch",
    sw: "Tawi"
  },
  "report.centrePrefix": {
    en: "Centre",
    sw: "Kituo"
  },
  "report.topPerformer": {
    en: "Top Performer",
    sw: "Mtendaji Bora"
  },
  "report.highGrowth": {
    en: "High Growth",
    sw: "Ukuaji wa Juu"
  },
  "report.mostVolunteers": {
    en: "Most Volunteers",
    sw: "Watu Waliojitolea Wengi"
  },
  "report.needsAttention": {
    en: "Needs Attention",
    sw: "Inahitaji Umakini"
  },
  "report.recentSystemReports": {
    en: "Recent System Reports",
    sw: "Ripoti za Mfumo za Hivi Karibuni"
  },
  "report.previouslyGeneratedReports": {
    en: "Previously Generated Reports",
    sw: "Ripoti zilizotengenezwa hapo awali"
  },
  "report.quarterlySystemOverview": {
    en: "Quarterly System Overview",
    sw: "Muhtasari wa Mfumo wa Robo Mwaka"
  },
  "report.branchPerformanceAnalysis": {
    en: "Branch Performance Analysis",
    sw: "Uchambuzi wa Utendaji wa Matawi"
  },
  "report.centrePerformanceAnalysis": {
    en: "Centre Performance Analysis",
    sw: "Uchambuzi wa Utendaji wa Vituo"
  },
  "report.staffEfficiencyReport": {
    en: "Staff Efficiency Report",
    sw: "Ripoti ya Ufanisi wa Wafanyakazi"
  },  "report.resourceAllocationSummary": {
    en: "Resource Allocation Summary",
    sw: "Muhtasari wa Ugawaji Rasilimali",
  },
  "report.detailedAnalytics": {
    en: "Detailed Analytics",
    sw: "Uchambuzi wa Kina",
  },
  
  // Missing report tab translations
  "report.orphans": {
    en: "Orphans",
    sw: "Yatima",
  },
  "report.fundraising": {
    en: "Fundraising",
    sw: "Uchangishaji",
  },
  "report.volunteers": {
    en: "Volunteers", 
    sw: "Wanaojitolea",
  },
  "report.staff": {
    en: "Staff",
    sw: "Wafanyakazi",
  },  "report.branches": {
    en: "Branches",
    sw: "Matawi",
  },  "report.inventory": {
    en: "Inventory",
    sw: "Bidhaa",
  },
  "report.category": {
    en: "Category",
    sw: "Kategoria",
  },
  "report.allCategories": {
    en: "All Categories",
    sw: "Kategoria Zote",
  },
  "report.food": {
    en: "Food",
    sw: "Chakula",
  },
  "report.clothing": {
    en: "Clothing",
    sw: "Mavazi",
  },
  "report.medicine": {
    en: "Medicine",
    sw: "Dawa",
  },
  "report.schoolSupplies": {
    en: "School Supplies",
    sw: "Vifaa vya Shule",
  },
  "report.other": {
    en: "Other",
    sw: "Nyingine",
  },
  
  // Additional report translations
  "report.system": {
    en: "System Report",
    sw: "Ripoti ya Mfumo",
  },
  "report.comprehensive": {
    en: "Comprehensive Report",
    sw: "Ripoti Kamili",
  },
  "roles.Supervisor": {
    en: "Supervisor",
    sw: "Msimamizi",
  },
  "roles.OrphanageAdmin": {
    en: "Orphanage Admin",
    sw: "Msimamizi wa Kituo cha Watoto Yatima",
  },
  "report.fullAccess": {
    en: "Full Access",
    sw: "Upatikanaji Kamili",
  },
  "report.fullAccess.description": {
    en: "You have full access to branch reports",
    sw: "Una upatikanaji kamili kwa ripoti za tawi",
  },
  "report.generator": {
    en: "Report Generator",
    sw: "Kizalishaji cha Ripoti",
  },
  "report.systemAnalytics": {
    en: "System Analytics",
    sw: "Uchanganuzi wa Mfumo",
  },
  "report.analytics": {
    en: "Analytics",
    sw: "Uchanganuzi",
  },
  "report.title": {
    en: "Reports",
    sw: "Ripoti",
  },  "report.generate": {
    en: "Generate detailed reports for your branch",
    sw: "Tengeneza ripoti za kina kwa tawi lako",
  },
  "report.generateReport": {
    en: "Generate Report",
    sw: "Tengeneza Ripoti",
  },
  "report.restricted": {
    en: "Restricted Access",
    sw: "Upatikanaji Uliowekewa Mipaka",
  },
  "report.restriction.description": {
    en: "You can only view and generate reports for your assigned branch",
    sw: "Unaweza tu kuona na kutengeneza ripoti za tawi lako ulilotengewa",
  },
  "report.summary": {
    en: "Branch Summary",
    sw: "Muhtasari wa Tawi",
  },
  "report.branchOverview": {
    en: "Quick overview of your branch",
    sw: "Muhtasari wa haraka wa tawi lako",
  },
  "report.totalOrphans": {
    en: "Total Orphans",
    sw: "Jumla ya Yatima",
  },
  "report.activeVolunteers": {
    en: "Active Volunteers",
    sw: "Wanaojitolea Wanaofanya Kazi",
  },
  "report.fundraisingCampaigns": {
    en: "Fundraising Campaigns",
    sw: "Kampeni za Uchangishaji",
  },
  "report.recentReports": {
    en: "Recent Reports",
    sw: "Ripoti za Hivi Karibuni",
  },
  "report.previouslyGenerated": {
    en: "Previously generated reports",
    sw: "Ripoti zilizotangulia kutengenezwa",
  },
  "report.monthlyOrphan": {
    en: "Monthly Orphan Report",
    sw: "Ripoti ya Kila Mwezi ya Yatima",
  },
  "report.inventoryStatus": {
    en: "Inventory Status Report",
    sw: "Ripoti ya Hali ya Bidhaa",
  },
  "report.volunteerHours": {
    en: "Volunteer Hours Report",
    sw: "Ripoti ya Masaa ya Wanaojitolea",
  },
  "report.fundraisingSummary": {
    en: "Fundraising Summary",
    sw: "Muhtasari wa Uchangishaji",
  },
  "report.loadingData": {
    en: "Loading data...",
    sw: "Inapakia data...",
  },
  "report.errorLoading": {
    en: "Error Loading Data",
    sw: "Hitilafu Kupakia Data",
  },
  "report.noDataAvailable": {
    en: "No data available",
    sw: "Hakuna data inayopatikana",
  },
  
  // Additional report generator translations
  "report.status": {
    en: "Status",
    sw: "Hali",
  },  "report.pending": {
    en: "Pending",
    sw: "Inasubiri",
  },
  "report.approved": {
    en: "Approved",
    sw: "Imeidhinishwa",
  },
  "report.rejected": {
    en: "Rejected",
    sw: "Imekataliwa",
  },
  "report.completed": {
    en: "Completed",
    sw: "Imekamilika",
  },
  "report.includeData": {
    en: "Include Data",
    sw: "Jumuisha Data",
  },
  "report.selectFilters": {
    en: "Select Filters",
    sw: "Chagua Vichujio",
  },
  "report.useDateRange": {
    en: "Use Date Range",
    sw: "Tumia Kipindi cha Tarehe",
  },  "report.dateRange": {
    en: "Date Range",
    sw: "Kipindi cha Tarehe",
  },
  "report.generatingReportEllipsis": {
    en: "Generating Report...",
    sw: "Inazalisha Ripoti...",
  },  "report.processing": {
    en: "Processing",
    sw: "Inachakata",
  },
  "report.generatingFor": {
    en: "Generating report for",
    sw: "Inazalisha ripoti ya",
  },
  // Inventory status
  "report.inStock": {
    en: "In Stock",
    sw: "Zinapatikana",
  },
  "report.lowStock": {
    en: "Low Stock",
    sw: "Zinaisha",
  },
  "report.outOfStock": {
    en: "Out of Stock",
    sw: "Zimeisha",
  },
  "report.statistics": {
    en: "Statistics",
    sw: "Takwimu",
  },
  "report.format": {
    en: "Export Format",
    sw: "Muundo wa Kuhamishia",
  },
  "report.allTimeData": {
    en: "Report will include all time data",
    sw: "Ripoti itajumuisha data ya wakati wote",
  },
  "report.orphanSpecific": {
    en: "Orphan-Specific Report",
    sw: "Ripoti Mahususi ya Yatima",
  },
  "report.generatingDetailed": {
    en: "Generating a detailed report for",
    sw: "Kutengeneza ripoti ya kina kwa",
  },
  "report.personalInfo": {
    en: "personal information",
    sw: "taarifa binafsi",
  },
  "orphan.selected": {
    en: "the selected orphan",
    sw: "yatima aliyechaguliwa",
  },
  "report.selectBranch": {
    en: "Select Branch",
    sw: "Chagua Tawi",
  },
  "report.selectCentre": {
    en: "Select Centre", 
    sw: "Chagua Kituo",
  },
  "report.allCentres": {
    en: "All Centres",
    sw: "Vituo Vyote",
  },  // report.systemReport is defined elsewhere
  "centre.yourCentre": {
    en: "Your Centre",
    sw: "Kituo Chako",
  },
  
  // Orphan age groups and statuses for reports
  "report.ageGroup": {
    en: "Age Group",
    sw: "Kikundi cha Umri",
  },
  "report.allAgeGroups": {
    en: "All Age Groups",
    sw: "Vikundi Vyote vya Umri",
  },
  "report.infant": {
    en: "Infant (0-2 years)",
    sw: "Mtoto mchanga (miaka 0-2)",
  },
  "report.toddler": {
    en: "Toddler (3-5 years)",
    sw: "Mtoto mdogo (miaka 3-5)",
  },
  "report.child": {
    en: "Child (6-12 years)",
    sw: "Mtoto (miaka 6-12)",
  },
  "report.teenager": {
    en: "Teenager (13-17 years)",
    sw: "Kijana (miaka 13-17)",
  },
  "report.allStatuses": {
    en: "All Statuses",
    sw: "Hali Zote",
  },
  "report.active": {
    en: "Active",
    sw: "Hai",
  },
  "report.inactive": {
    en: "Inactive",
    sw: "Isiyo Hai",
  },  "report.adopted": {
    en: "Adopted",
    sw: "Ametolewa",
  },
  "report.reportGenerator": {
    en: "Report Generator",
    sw: "Jenereta ya Ripoti",
  },  "report.systemAnalyticsTab": {
    en: "System Analytics",
    sw: "Uchambuzi wa Mfumo",
  },
  "report.createSystemReports": {
    en: "Create System Reports",
    sw: "Tengeneza Ripoti za Mfumo",
  },
  "report.allBranches": {
    en: "All Branches",
    sw: "Matawi Yote",
  },
  "report.exportFormat": {
    en: "Export Format",
    sw: "Muundo wa Uhamishaji",
  },
  "report.document": {
    en: "Document",
    sw: "Nyaraka",
  },
  "report.reportNote": {
    en: "Report Note",
    sw: "Maelezo ya Ripoti",
  },
  "report.reportDescription": {
    en: "Report Description",
    sw: "Maelezo ya Ripoti",
  },
  "report.totalOrphanageCenters": {
    en: "Total Orphanage Centers",
    sw: "Jumla ya Vituo vya Yatima",  },
  "report.totalAdmins": {
    en: "Total Admins",
    sw: "Jumla ya Wasimamizi",
  },

  // Analytics translations
  "analytics.detailedAnalytics": {
    en: "Detailed Analytics",
    sw: "Uchambuzi wa Kina",
  },
  "analytics.performanceMetrics": {
    en: "Performance Metrics",
    sw: "Vipimo vya Utendaji",
  },
  "analytics.importantMetrics": {
    en: "Important Metrics",
    sw: "Vipimo Muhimu",
  },
    // Analytics - Categories
  "branch.orphanageCenters": {
    en: "Orphanage Centers",
    sw: "Vituo vya Yatima",
  },
  "analytics.branches": {
    en: "Branches",
    sw: "Matawi",
  },
  "analytics.orphans": {
    en: "Orphans",
    sw: "Yatima",
  },
  "admin.admins": {
    en: "Admins",
    sw: "Wasimamizi",
  },
  "fundraiser.donations": {
    en: "Donations",
    sw: "Michango",
  },
  "fundraiser.activeFundraisers": {
    en: "Active Fundraisers",
    sw: "Ukusanyaji Fedha Unaoendelea",
  },
  "inventory.inventoryItems": {
    en: "Inventory Items",
    sw: "Bidhaa za Ghala",
  },
  "volunteer.volunteers": {
    en: "Volunteers",    sw: "Wataalam wa Kujitolea",
  },
  
  // Analytics - Report sections
  "report.visualRepresentation": {
    en: "Visual Representation",
    sw: "Uwakilishi wa Picha",
  },
  "report.orphanageData": {
    en: "Orphanage Data",
    sw: "Data ya Vituo vya Yatima",
  },
  "report.donations": {
    en: "Donations",
    sw: "Michango",  },
  "report.demographics": {
    en: "Demographics",
    sw: "Takwimu za Idadi",
  },
  "report.inventoryTab": {
    en: "Inventory",
    sw: "Bidhaa",
  },
  
  // Analytics - Metrics
  "report.avgOrphansPerCenter": {
    en: "Avg. Orphans per Center",
    sw: "Wastani wa Yatima kwa Kituo",
  },
  "report.avgDonationsPerFundraiser": {
    en: "Avg. Donations per Fundraiser",
    sw: "Wastani wa Michango kwa Ukusanyaji",
  },  "report.adminOrphanRatio": {
    en: "Admin to Orphan Ratio",
    sw: "Uwiano wa Msimamizi kwa Yatima",
  },
  "report.inventoryPerCenter": {
    en: "Inventory Items per Center",
    sw: "Bidhaa za Ghala kwa Kituo",
  },
  "report.importantMetrics": {
    en: "Key performance indicators and system metrics",
    sw: "Viashiria muhimu vya utendaji na vipimo vya mfumo",
  },
  // Superuser translations
  "superuser.title": {
    en: "Superuser",
    sw: "Msimamizi Mkuu",
  },
  "superuser.dashboard.title": {
    en: "Superuser Dashboard",
    sw: "Dashibodi ya Msimamizi Mkuu",
  },
  "superuser.dashboard.description": {
    en: "Manage orphanage centers, administrators, and system operations",
    sw: "Simamia vituo vya yatima, wasimamizi, na utendaji wa mfumo",
  },
  "superuser.dashboard.overview": {
    en: "Overview",
    sw: "Muhtasari",
  },
  "superuser.dashboard.orphanageAdmins": {
    en: "Orphanage Admins",
    sw: "Wasimamizi wa Vituo",
  },
  "superuser.dashboard.registrationRequests": {
    en: "Registration Requests",
    sw: "Maombi ya Usajili",
  },
  "superuser.dashboard.leaveRequests": {
    en: "Leave Requests",
    sw: "Maombi ya Kujitoa",
  },
  "superuser.dashboard.systemReports": {
    en: "System Reports",
    sw: "Ripoti za Mfumo",
  },
  "superuser.dashboard.totalOrphanageCenters": {
    en: "Total Orphanage Centers",
    sw: "Jumla ya Vituo vya Yatima",
  },
  "superuser.dashboard.totalBranches": {
    en: "Total Branches",
    sw: "Jumla ya Matawi",
  },
  "superuser.dashboard.totalOrphans": {
    en: "Total Orphans",
    sw: "Jumla ya Yatima",
  },
  "superuser.dashboard.totalFundraising": {
    en: "Total Fundraising",
    sw: "Jumla ya Ukusanyaji Fedha",
  },
  "superuser.dashboard.totalVolunteers": {
    en: "Total Volunteers",
    sw: "Jumla ya Wataalam wa Kujitolea",
  },
  "superuser.dashboard.systemSummary": {
    en: "System Summary",
    sw: "Muhtasari wa Mfumo",
  },
  "superuser.dashboard.overviewDescription": {
    en: "Overview of orphanage centers and system statistics",
    sw: "Muhtasari wa vituo vya yatima na takwimu za mfumo",
  },  "superuser.dashboard.systemStatsText": {
    en: "The system currently manages",
    sw: "Mfumo kwa sasa unasimamia",
  },
  "superuser.dashboard.centersText": {
    en: "orphanage centers",
    sw: "vituo vya yatima",
  },
  "superuser.dashboard.branchesText": {
    en: "branches",
    sw: "matawi",
  },
  "superuser.dashboard.orphansText": {
    en: "orphans",
    sw: "yatima",
  },
  "superuser.dashboard.fundraisingText": {
    en: "TSh",
    sw: "TSh",
  },
  "superuser.dashboard.andText": {
    en: "and",
    sw: "na",
  },
  "superuser.dashboard.volunteersText": {
    en: "volunteers",
    sw: "wataalam wa kujitolea",
  },
  "superuser.dashboard.adminsManagement": {
    en: "Orphanage Administrators Management",
    sw: "Usimamizi wa Wasimamizi wa Vituo vya Yatima",
  },
  "superuser.dashboard.addNewAdmin": {
    en: "Add New Admin",
    sw: "Ongeza Msimamizi Mpya",
  },
  "superuser.dashboard.addNewAdminTitle": {
    en: "Add New Orphanage Admin",
    sw: "Ongeza Msimamizi Mpya wa Kituo",
  },
  "common.logout": {
    en: "Logout",
    sw: "Toka",
  },

}

// Use the context type we already defined at the top of the file

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
})

// Create the provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>("en")

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as AppLanguage
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "sw")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`)
      return key
    }
    return translations[key][language]
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// Translation component for easy usage in JSX
export const T = ({ k }: { k: string }) => {
  const { language } = useLanguage()  
  // Make sure the key exists in translations
  if (translations[k]?.[language]) {
    return <>{translations[k][language]}</>
  }
  
  console.log(`Missing translation: ${k}`)
  return <>{k}</>
}
