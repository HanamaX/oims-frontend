"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define available languages
export type Language = "en" | "sw"

// Create context type
type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// Create translations object
const translations: Record<string, Record<Language, string>> = {  // New staff management keys
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
  "staff.noName": {
    en: "No Name",
    sw: "Hakuna Jina",
  },
  
  // New inventory item translation keys
  "inventoryDetails.loadingDetails": {
    en: "Loading item details...",
    sw: "Inapakia maelezo ya bidhaa...",
  },
  "inventoryDetails.noDataFound": {
    en: "No data found for this inventory item",
    sw: "Hakuna data iliyopatikana kwa bidhaa hii",
  },
  "inventoryDetails.failedToLoad": {
    en: "Failed to load inventory item details",
    sw: "Imeshindwa kupakia maelezo ya bidhaa",
  },
  "inventoryDetails.backToInventory": {
    en: "Back to Inventory",
    sw: "Rudi kwenye Orodha ya Bidhaa",
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
    sw: "Bei ya Kitengo",
  },
  "inventoryDetails.totalValue": {
    en: "Total Value",
    sw: "Thamani Jumla",
  },
  "inventoryDetails.totalIn": {
    en: "Total In",
    sw: "Jumla ya Upokeaji",
  },
  "inventoryDetails.totalOut": {
    en: "Total Out",
    sw: "Jumla ya Usambazaji",
  },
  "inventoryDetails.units": {
    en: "units",
    sw: "vipande",
  },
  "inventoryDetails.transactionHistory": {
    en: "Transaction History",
    sw: "Historia ya Miamala",
  },
  "inventoryDetails.noTransactions": {
    en: "No transaction history available",
    sw: "Hakuna historia ya miamala iliyopatikana",
  },
  "inventoryDetails.received": {
    en: "Received ",
    sw: "Imepokelewa ",
  },
  "inventoryDetails.distributed": {
    en: "Distributed ",
    sw: "Imesambazwa ",
  },
  "inventoryDetails.noDescription": {
    en: "No description provided",
    sw: "Hakuna maelezo yaliyotolewa",
  },
  // Removed duplicate "inventory.branch" key to resolve object literal property duplication error
  // "inventory.branch": {
  //   en: "Branch",
  //   sw: "Tawi",
  // },

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
  },
  "dashboard.settings": {
    en: "Settings",
    sw: "Mipangilio",
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
  },
  "common.updating": {
    en: "Updating...",
    sw: "Inasasisha...",
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
  "centerManagement.loadingMessage": {
    en: "Loading center information...",
    sw: "Inapakia taarifa za kituo...",
  },
  "centerManagement.description": {
    en: "Manage your orphanage center and branches",
    sw: "Simamia kituo chako cha yatima na matawi",
  },
  "centerManagement.createDescription": {
    en: "Create your main orphanage center",
    sw: "Unda kituo chako kikuu cha yatima",
  },
  "centerManagement.readOnlyMode": {
    en: "Read-Only Mode: Center information can only be viewed",
    sw: "Hali ya Kusoma Tu: Taarifa za kituo zinaweza kuonwa tu",
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
  },
  "centerOverview.centerName": {
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
  // Removed duplicate "staff.active" key to resolve object literal property duplication error
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
  },
  "branch.orphansInBranch": {
    en: "orphans in this branch",
    sw: "yatima katika tawi hili",
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
    sw: "Uwezo wa Yatima",
  },  "branch.orphans": {
    en: "orphans",
    sw: "yatima",
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
    sw: "Msimamizi wa Yatima",
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
  "staff.suspended": {
    en: "Suspended",
    sw: "Amesimamishwa",
  },
  "staff.active": {
    en: "Active",
    sw: "Anafanya kazi",
  },
  // "staff.inactive" duplicate removed to resolve object literal property duplication error
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
  // "staff.admin" duplicate removed to resolve object literal property duplication error
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
  },
  "orphan.hasProfileImage": {
    en: "Has Profile Image",
    sw: "Ana Picha ya Wasifu",
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
  },
  "orphan.medical.records": {
    en: "Medical Records",
    sw: "Rekodi za Matibabu",
  },
  "orphan.loadingDetails": {
    en: "Loading orphan details...",
    sw: "Inapakia maelezo ya yatima...",
  },
  "orphan.branch": {
    en: "Branch",
    sw: "Tawi",
  },

  // UI Elements
  "ui.backToOrphans": {
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
  },
  "inventory.viewManage": {
    en: "View and manage all inventory items in the system",
    sw: "Angalia na simamia bidhaa zote kwenye mfumo",
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
  "inventory.addSuccess": {
    en: "Inventory item \"{0}\" added successfully",
    sw: "Bidhaa \"{0}\" imeongezwa kwa mafanikio",
  },
  "inventory.addFail": {
    en: "Failed to add inventory item. Please try again.",
    sw: "Imeshindwa kuongeza bidhaa. Tafadhali jaribu tena.",
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
  },
  "inventory.noItemsFound": {
    en: "No inventory items found matching your criteria.",
    sw: "Hakuna bidhaa zilizopatikana zinazofanana na vigezo vyako.",
  },
  "inventory.failedToLoad": {
    en: "Failed to load inventory items. Please try again.",
    sw: "Imeshindwa kupakia bidhaa. Tafadhali jaribu tena.",
  },
  "inventory.noDataFound": {
    en: "No inventory data found",
    sw: "Hakuna data ya bidhaa iliyopatikana",
  },
  "inventory.branch": {
    en: "Branch",
    sw: "Tawi",
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
  },
  "fundraisers.completed": {
    en: "Completed",
    sw: "Imekamilika",
  },
  "fundraisers.noFundraisersFound": {
    en: "No fundraisers found matching your criteria.",
    sw: "Hakuna mikakati ya kukusanya fedha inayofanana na vigezo vyako.",
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
  },
  "orphanageAdmin.dashboard.activeVolunteers": {
    en: "Active volunteers",
    sw: "Wajitolea wanaofanya kazi",
  },
  "orphanageAdmin.dashboard.notifications": {
    en: "Notifications",
    sw: "Arifa",
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
    sw: "Yatima Wanaishi",
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
  },
  "orphans.tryAgain": {
    en: "Try Again",
    sw: "Jaribu Tena",
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
  },
  "orphans.addFail": {
    en: "Failed to add orphan record",
    sw: "Imeshindwa kuongeza rekodi ya yatima",
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

  // Fundraiser Management
  "fundraiser.management": {
    en: "Fundraiser Management",
    sw: "Usimamizi wa Michango",
  },
  "fundraiser.description": {
    en: "View and manage fundraising campaigns",
    sw: "Angalia na simamia kampeni za ukusanyaji fedha",
  },
  "fundraiser.add": {
    en: "Add Fundraiser",
    sw: "Ongeza Mchango",
  },
  "fundraiser.search": {
    en: "Search fundraisers...",
    sw: "Tafuta michango...",
  },
  "fundraiser.filter.status": {
    en: "Filter by status",
    sw: "Chuja kwa hali",
  },
  "fundraiser.filter.all": {
    en: "All Fundraisers",
    sw: "Michango Yote",
  },
  "fundraiser.filter.pending": {
    en: "Pending Approval",
    sw: "Inasubiri Idhini",
  },
  "fundraiser.filter.approved": {
    en: "Approved",
    sw: "Imeidhinishwa",
  },
  "fundraiser.filter.active": {
    en: "Active",
    sw: "Inafanya Kazi",
  },
  "fundraiser.filter.completed": {
    en: "Completed",
    sw: "Imekamilika",
  },
  "fundraiser.filter.rejected": {
    en: "Rejected",
    sw: "Imekataliwa",
  },
  "fundraiser.loading": {
    en: "Loading fundraisers...",
    sw: "Inapakia michango...",
  },
  "fundraiser.error": {
    en: "Failed to load fundraisers. Please try again later.",
    sw: "Imeshindwa kupakia michango. Tafadhali jaribu tena baadaye.",
  },
  "fundraiser.tryAgain": {
    en: "Try Again",
    sw: "Jaribu Tena",
  },
  "fundraiser.noData": {
    en: "No fundraisers found matching your criteria.",
    sw: "Hakuna michango iliyopatikana inayolingana na vigezo vyako.",
  },
  "fundraiser.details": {
    en: "View Details",
    sw: "Angalia Maelezo",
  },
  "fundraiser.approve": {
    en: "Approve",
    sw: "Idhinisha",
  },
  "fundraiser.reject": {
    en: "Reject",
    sw: "Kataa",
  },
  "fundraiser.complete": {
    en: "Mark as Completed",
    sw: "Weka kama Imekamilika",
  },
  "fundraiser.cancel": {
    en: "Cancel Fundraiser",
    sw: "Ghairi Mchango",
  },
  "fundraiser.delete": {
    en: "Delete",
    sw: "Futa",
  },
  "fundraiser.approveSuccess": {
    en: "Fundraiser approved successfully",
    sw: "Mchango umeidhinishwa kwa mafanikio",
  },
  "fundraiser.approveFail": {
    en: "Failed to approve fundraiser. Please try again.",
    sw: "Imeshindwa kuidhinisha mchango. Tafadhali jaribu tena.",
  },
  "fundraiser.rejectSuccess": {
    en: "Fundraiser rejected successfully",
    sw: "Mchango umekataliwa kwa mafanikio",
  },
  "fundraiser.rejectFail": {
    en: "Failed to reject fundraiser. Please try again.",
    sw: "Imeshindwa kukataa mchango. Tafadhali jaribu tena.",
  },
  "fundraiser.deleteSuccess": {
    en: "Fundraiser deleted successfully",
    sw: "Mchango umefutwa kwa mafanikio",
  },
  "fundraiser.deleteFail": {
    en: "Failed to delete fundraiser. Please try again.",
    sw: "Imeshindwa kufuta mchango. Tafadhali jaribu tena.",
  },
  "fundraiser.completeSuccess": {
    en: "Fundraiser marked as completed successfully",
    sw: "Mchango umewekwa kama umekamilika kwa mafanikio",
  },
  "fundraiser.completeFail": {
    en: "Failed to mark fundraiser as completed. Please try again.",
    sw: "Imeshindwa kuweka mchango kama umekamilika. Tafadhali jaribu tena.",
  },
  "fundraiser.cancelSuccess": {
    en: "Fundraiser cancelled successfully",
    sw: "Mchango umeghairiwa kwa mafanikio",
  },
  "fundraiser.cancelFail": {
    en: "Failed to cancel fundraiser. Please try again.",
    sw: "Imeshindwa kughairi mchango. Tafadhali jaribu tena.",
  },
  "fundraiser.rejectDialog.title": {
    en: "Reject Fundraiser",
    sw: "Kataa Mchango",
  },
  "fundraiser.rejectDialog.description": {
    en: "Please provide a reason for rejecting this fundraiser. This will be sent to the organizer.",
    sw: "Tafadhali toa sababu ya kukataa mchango huu. Hii itatumwa kwa mpangaji.",
  },
  "fundraiser.rejectDialog.reason": {
    en: "Rejection Reason",
    sw: "Sababu ya Kukataa",
  },
  "fundraiser.rejectDialog.placeholder": {
    en: "Enter reason for rejection...",
    sw: "Ingiza sababu ya kukataa...",
  },
  "fundraiser.rejectDialog.cancel": {
    en: "Cancel",
    sw: "Ghairi",
  },
  "fundraiser.rejectDialog.confirm": {
    en: "Confirm Rejection",
    sw: "Thibitisha Kukataa",
  },
  "fundraiser.rejectDialog.required": {
    en: "A reason is required",
    sw: "Sababu inahitajika",
  },
  "fundraiser.coordinator": {
    en: "Coordinator",
    sw: "Mratibu",
  },
  "fundraiser.purpose": {
    en: "Purpose",
    sw: "Madhumuni",
  },
  "fundraiser.date": {
    en: "Date",
    sw: "Tarehe",
  },
  "fundraiser.status": {
    en: "Status",
    sw: "Hali",
  },
  "fundraiser.actions": {
    en: "Actions",
    sw: "Vitendo",
  },

  // Reports & Analytics
  "report.title": {
    en: "Reports & Analytics",
    sw: "Ripoti na Uchambuzi",
  },
  "report.generate": {
    en: "Generate detailed reports and view analytics for your branch",
    sw: "Tengeneza ripoti za kina na angalia uchambuzi wa tawi lako",
  },
  "report.system": {
    en: "System Reports & Analytics",
    sw: "Ripoti na Uchambuzi wa Mfumo",
  },
  "report.comprehensive": {
    en: "Comprehensive reports and analytics across all branches",
    sw: "Ripoti kamili na uchambuzi katika matawi yote",
  },
  "report.restricted": {
    en: "Report access is restricted",
    sw: "Upatikanaji wa ripoti umezuiliwa",
  },
  "report.restriction.description": {
    en: "Branch administrators can only generate reports for data within their assigned branch.",
    sw: "Wasimamizi wa matawi wanaweza kutengeneza ripoti za data ndani ya tawi lao tu.",
  },
  "report.fullAccess": {
    en: "Full system access",
    sw: "Ufikiaji kamili wa mfumo",
  },
  "report.fullAccess.description": {
    en: "As a Super Admin, you can generate reports for individual branches or the entire system.",
    sw: "Kama Msimamizi Mkuu, unaweza kutengeneza ripoti kwa matawi ya mtu binafsi au mfumo mzima.",
  },
  "report.generator": {
    en: "Report Generator",
    sw: "Jenereta ya Ripoti",
  },
  "report.analytics": {
    en: "Analytics Dashboard",
    sw: "Dashibodi ya Uchambuzi",
  },
  "report.systemAnalytics": {
    en: "System Analytics",
    sw: "Uchambuzi wa Mfumo",
  },
  "report.orphans": {
    en: "Orphans",
    sw: "Yatima",
  },
  "report.inventory": {
    en: "Inventory",
    sw: "Bidhaa",
  },
  "report.fundraising": {
    en: "Fundraising",
    sw: "Ukusanyaji Fedha",
  },
  "report.volunteers": {
    en: "Volunteers",
    sw: "Wajitolea",
  },
  "report.staff": {
    en: "Staff",
    sw: "Wafanyakazi",
  },
  "report.branches": {
    en: "Branches",
    sw: "Matawi",
  },
  "report.summary": {
    en: "Summary",
    sw: "Muhtasari",
  },
  "report.branchOverview": {
    en: "Branch overview at a glance",
    sw: "Muhtasari wa tawi kwa haraka",
  },
  "report.systemSummary": {
    en: "System Summary",
    sw: "Muhtasari wa Mfumo",
  },
  "report.orgWide": {
    en: "Organization-wide metrics",
    sw: "Vipimo vya shirika zima",
  },
  "report.totalOrphans": {
    en: "Total Orphans",
    sw: "Jumla ya Yatima",
  },
  "report.activeVolunteers": {
    en: "Active Volunteers",
    sw: "Wajitolea Wanaofanya Kazi",
  },
  "report.fundraisingCampaigns": {
    en: "Fundraising Campaigns",
    sw: "Kampeni za Ukusanyaji Fedha",
  },
  "report.recentReports": {
    en: "Recent Reports",
    sw: "Ripoti za Hivi Karibuni",
  },
  "report.previouslyGenerated": {
    en: "Previously generated reports",
    sw: "Ripoti zilizotolewa awali",
  },
  "report.monthlyOrphan": {
    en: "Monthly Orphan Report",
    sw: "Ripoti ya Kila Mwezi ya Yatima",
  },
  "report.inventoryStatus": {
    en: "Inventory Status",
    sw: "Hali ya Bidhaa",
  },  "report.volunteerHours": {
    en: "Volunteer Hours Q2",
    sw: "Masaa ya Kujitolea Robo ya 2",
  },
  "report.fundraisingSummary": {
    en: "Fundraising Summary",
    sw: "Muhtasari wa Ukusanyaji Fedha",
  },
  "report.branchComparison": {
    en: "Branch Comparison",
    sw: "Ulinganisho wa Matawi",
  },
  "report.performanceMetrics": {
    en: "Performance metrics by branch",
    sw: "Vipimo vya utendaji kwa tawi",
  },
  "report.totalBranches": {
    en: "Total Branches",
    sw: "Jumla ya Matawi",
  },
  "report.totalVolunteers": {
    en: "Total Volunteers",
    sw: "Jumla ya Wajitolea",
  },
  "report.totalFundraisers": {
    en: "Total Fundraisers",
    sw: "Jumla ya Ukusanyaji Fedha",
  },
  "report.branchPrefix": {
    en: "Branch",
    sw: "Tawi",
  },
  "report.topPerformer": {
    en: "Top Performer",
    sw: "Mtendeaji Bora Zaidi",
  },
  "report.highGrowth": {
    en: "High Growth",
    sw: "Ukuaji wa Juu",
  },
  "report.mostVolunteers": {
    en: "Most Volunteers",
    sw: "Wajitolea Wengi Zaidi",
  },
  "report.needsAttention": {
    en: "Needs Attention",
    sw: "Inahitaji Umakini",
  },
  "report.recentSystemReports": {
    en: "Recent System Reports",
    sw: "Ripoti za Mfumo za Hivi Karibuni",
  },
  "report.quarterlySystemOverview": {
    en: "Quarterly System Overview",
    sw: "Muhtasari wa Mfumo wa Robo Mwaka",
  },
  "report.branchPerformanceAnalysis": {
    en: "Branch Performance Analysis",
    sw: "Uchambuzi wa Utendaji wa Tawi",
  },
  "report.staffEfficiencyReport": {
    en: "Staff Efficiency Report",
    sw: "Ripoti ya Ufanisi wa Wafanyakazi",
  },
  "report.resourceAllocationSummary": {
    en: "Resource Allocation Summary",
    sw: "Muhtasari wa Ugawaji Rasilimali",
  },
  // Report generator form fields and labels
  "report.dateRange": {
    en: "Date Range",
    sw: "Kipindi cha Tarehe",
  },
  "report.ageGroup": {
    en: "Age Group",
    sw: "Kikundi cha Umri",
  },
  "report.allAgeGroups": {
    en: "All Age Groups",
    sw: "Vikundi Vyote vya Umri",
  },
  "report.status": {
    en: "Status",
    sw: "Hali",
  },
  "report.allStatuses": {
    en: "All Statuses",
    sw: "Hali Zote",
  },
  "report.format": {
    en: "Report Format",
    sw: "Muundo wa Ripoti",
  },
  "report.includeData": {
    en: "Reports will include data from the selected date range.",
    sw: "Ripoti zitajumuisha data kutoka kipindi cha tarehe kilichochaguliwa.",
  },
  "report.selectFilters": {
    en: "Make sure to select the appropriate filters for the most relevant results.",
    sw: "Hakikisha umechagua vichujio sahihi kwa matokeo muhimu zaidi.",
  },
  "report.generateReport": {
    en: "Generate Report",
    sw: "Tengeneza Ripoti",
  },  "report.infant": {
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
  },  "report.active": {
    en: "Active",
    sw: "Hai",
  },
  "volunteers.status.pending": {
    en: "Pending",
    sw: "Inasubiri",
  },
  "volunteers.status.approved": {
    en: "Approved", 
    sw: "Imeidhinishwa",
  },
  "volunteers.status.rejected": {
    en: "Rejected",
    sw: "Imekataliwa",
  },  "volunteers.filter.branch": {
    en: "Filter by branch",
    sw: "Chuja kwa tawi",
  },

  // Center Management translations
  "centerManagement.title": {
    en: "Center Management",
    sw: "Usimamizi wa Kituo",
  },
  "centerManagement.description.exists": {
    en: "Manage your orphanage center and branches",
    sw: "Simamia kituo chako cha yatima na matawi",
  },
  "centerManagement.description.create": {
    en: "Create your main orphanage center",
    sw: "Unda kituo chako kikuu cha yatima",
  },
  "centerManagement.loading": {
    en: "Loading center information...",
    sw: "Inapakia taarifa za kituo...",
  },
  "centerManagement.tabs.overview": {
    en: "Center Overview",
    sw: "Muhtasari wa Kituo",
  },
  "centerManagement.tabs.branches": {
    en: "Branches",
    sw: "Matawi",
  },
  "centerManagement.tabs.staff": {
    en: "Staff",
    sw: "Wafanyakazi",
  },
  "centerManagement.deleteDialog.title": {
    en: "Confirm Orphanage Center Deletion",
    sw: "Thibitisha Ufutaji wa Kituo cha Yatima",
  },
  "centerManagement.deleteDialog.description": {
    en: "Are you sure you want to delete the orphanage center",
    sw: "Je, una uhakika unataka kufuta kituo cha yatima",
  },
  "centerManagement.deleteDialog.warning": {
    en: "This action cannot be undone. All data associated with this center including all branches, orphans, staff records, inventory, donations, and other information will be permanently deleted.",
    sw: "Kitendo hiki hakiwezi kubatilishwa na kitafuta kabisa akaunti yao na ufikiaji wa mfumo.",
  },
  "centerManagement.deleteDialog.criticalWarning": {
    en: "This is a critical action that will remove ALL data from your system.",
    sw: "Hii ni hatua muhimu ambayo itaondoa data YOTE kutoka mfumo wako.",
  },
  "centerManagement.deleteDialog.deleting": {
    en: "Deleting...",
    sw: "Inafuta...",
  },
  "centerManagement.deleteDialog.deleteButton": {
    en: "Delete Orphanage Center",
    sw: "Futa Kituo cha Yatima",
  },
  "centerManagement.deleteDialog.deleteError": {
    en: "Cannot delete center: Missing center ID",
    sw: "Haiwezi kufuta kituo: Kitambulisho cha kituo hakipatikani",
  },
  
  // Center Overview translations
  "centerOverview.create.title": {
    en: "Create Orphanage Center",
    sw: "Unda Kituo cha Yatima",
  },
  "centerOverview.create.description": {
    en: "Enter the details for your main orphanage center",
    sw: "Ingiza maelezo ya kituo chako kikuu cha yatima",
  },
  "centerOverview.edit.title": {
    en: "Edit Orphanage Center",
    sw: "Hariri Kituo cha Yatima",
  },
  "centerOverview.edit.description": {
    en: "Update the details for your orphanage center",
    sw: "Sasisha maelezo ya kituo chako cha yatima",
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
  "centerOverview.form.creating": {
    en: "Creating...",
    sw: "Inaunda...",
  },
  "centerOverview.form.createButton": {
    en: "Create Center",
    sw: "Unda Kituo",
  },
  "centerOverview.form.updating": {
    en: "Updating...",
    sw: "Inasasisha...",
  },
  "centerOverview.form.updateButton": {
    en: "Update Center",
    sw: "Sasisha Kituo",
  },
  "centerOverview.actions.editDetails": {
    en: "Edit Center Details",
    sw: "Hariri Maelezo ya Kituo",
  },
  "centerOverview.actions.deleteCenter": {
    en: "Delete Center",
    sw: "Futa Kituo",
  },
  "centerOverview.success.created": {
    en: "Center created successfully",
    sw: "Kituo kimeundwa kwa ufanisi",
  },
  "centerOverview.success.updated": {
    en: "Center information updated successfully",
    sw: "Taarifa za kituo zimesasishwa kwa ufanisi",
  },
  "centerOverview.success.deleted": {
    en: "Center has been deleted successfully",
    sw: "Kituo kimefutwa kwa ufanisi",
  },
  "centerOverview.error.save": {
    en: "Failed to save center information. Please try again.",
    sw: "Imeshindwa kuhifadhi taarifa za kituo. Tafadhali jaribu tena.",
  },
  "centerOverview.error.delete": {
    en: "Failed to delete center",
    sw: "Imeshindwa kufuta kituo",
  },

  // Staff Settings translations
  "staff.settings": {
    en: "Staff Settings",
    sw: "Mipangilio ya Wafanyakazi",
  },
  "staff.information": {
    en: "Staff Information",
    sw: "Taarifa za Mfanyakazi",
  },
  "staff.staffMember": {
    en: "Staff Member",
    sw: "Mfanyakazi",
  },
  "staff.inactive": {
    en: "Inactive",
    sw: "Hafanyi kazi",
  },
  "staff.cannotChangeSelfStatus": {
    en: "You cannot change your own account status",
    sw: "Huwezi kubadilisha hali ya akaunti yako mwenyewe",
  },
  "common.gender": {
    en: "Gender",
    sw: "Jinsia",
  },
  "common.phone": {
    en: "Phone",
    sw: "Simu",
  },
  "common.email": {
    en: "Email",
    sw: "Barua pepe",
  },
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
})

// Create the provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
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
  if (translations[k] && translations[k][language]) {
    return <>{translations[k][language]}</>
  }
  
  console.log(`Missing translation: ${k}`)
  return <>{k}</>
}
