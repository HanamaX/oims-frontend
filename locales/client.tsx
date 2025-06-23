"use client"

import { createContext, useContext, useState, useMemo, type ReactNode } from "react"

type Language = "en" | "sw"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// Default translation function that just returns the key
const defaultT = (key: string): string => key

// Create context with default values to avoid undefined errors
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: defaultT,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Add translations for staff and branch management
  const translations: Record<string, Record<Language, string>> = {
    // Staff edit form translations
    "staff.staffMember": {
      en: "Staff Member",
      sw: "Mfanyakazi",
    },
    "staff.information": {
      en: "Staff Information",
      sw: "Taarifa za Mfanyakazi",
    },
    "staff.accountCreated": {
      en: "Account Created",
      sw: "Akaunti Imeundwa",
    },
    "staff.settings": {
      en: "Staff Settings",
      sw: "Mipangilio ya Mfanyakazi",
    },
    "staff.assignedBranch": {
      en: "Assigned Branch",
      sw: "Tawi Lililopangiwa",
    },
    "staff.accountStatus": {
      en: "Account Status",
      sw: "Hali ya Akaunti",
    },
    "staff.inactive": {
      en: "Inactive",
      sw: "Haitumiki",
    },
    "staff.active": {
      en: "Active",
      sw: "Inatumika",
    },
    "staff.suspended": {
      en: "Suspended",
      sw: "Imesimamishwa",
    },
    "staff.notAssigned": {
      en: "Not Assigned",
      sw: "Haijapangwa",
    },
    "staff.notSpecified": {
      en: "Not Specified",
      sw: "Haijabainishwa",
    },
    "staff.cannotChangeSelfStatus": {
      en: "You cannot change your own account status",
      sw: "Huwezi kubadilisha hali ya akaunti yako mwenyewe",
    },
    "staff.cannotDeleteSelfAccount": {
      en: "You cannot delete your own account",
      sw: "Huwezi kufuta akaunti yako mwenyewe",
    },
    "staff.deleteThisStaffMember": {
      en: "Delete this staff member",
      sw: "Futa mfanyakazi huyu",
    },
    "staff.updateStaff": {
      en: "Update Staff",
      sw: "Sasisha Mfanyakazi",
    },
    "staff.updating": {
      en: "Updating...",
      sw: "Inasasisha...",
    },
    "staff.deleting": {
      en: "Deleting...",
      sw: "Inafuta...",
    },
    "staff.deleteStaff": {
      en: "Delete Staff",
      sw: "Futa Mfanyakazi",
    },
    "staff.confirmStaffDeletion": {
      en: "Confirm Staff Deletion",
      sw: "Thibitisha Kufuta Mfanyakazi",
    },
    "staff.deleteConfirmMessage": {
      en: "Are you sure you want to delete staff member",
      sw: "Una uhakika unataka kufuta mfanyakazi",
    },
    "staff.deleteWarning": {
      en: "This action cannot be undone and will permanently remove their account and access to the system.",
      sw: "Hatua hii haiwezi kutenduliwa na itaondoa akaunti yao na upatikanaji wa mfumo kwa kudumu.",
    },
    "staff.superAdminNote": {
      en: "Super Admins don't need branch assignments as they have access to all branches. You can only modify the account status for Super Admins.",
      sw: "Wasimamizi Wakuu hawahitaji kukabidhiwa matawi kwani wana upatikanaji wa matawi yote. Unaweza kubadilisha tu hali ya akaunti kwa Wasimamizi Wakuu.",
    },
    "staff.adminNote": {
      en: "You can only modify the branch assignment and account status for this admin. To change other details, ask the admin to update their own profile.",
      sw: "Unaweza kubadilisha tu ugawaji wa tawi na hali ya akaunti kwa msimamizi huyu. Kubadilisha maelezo mengine, mwombe msimamizi asasishe wasifu wao.",
    },
    "staff.selfDeleteWarning": {
      en: "Note: You cannot suspend or delete your own account for security reasons.",
      sw: "Kumbuka: Huwezi kusimamisha au kufuta akaunti yako kwa sababu za usalama.",
    },
    "staff.suspendNote": {
      en: "Note: Suspending an admin will prevent them from logging in but preserve their account data.",
      sw: "Kumbuka: Kusimamisha msimamizi kutazuia kuingia lakini kuhifadhi data ya akaunti yao.",
    },
    "staff.noName": {
      en: "No Name",
      sw: "Hakuna Jina",
    },
    "staff.admin": {
      en: "Admin",
      sw: "Msimamizi",
    },
    "staff.superAdmin": {
      en: "Super Admin",
      sw: "Msimamizi Mkuu",
    },
    
    // Branch details translations
    "branch.backToCenter": {
      en: "Back to Center",
      sw: "Rudi kwenye Kituo",
    },
    "branch.headquarters": {
      en: "Headquarters",
      sw: "Makao Makuu",
    },
    "branch.phoneNumber": {
      en: "Phone Number",
      sw: "Namba ya Simu",
    },
    "branch.createdDate": {
      en: "Created Date",
      sw: "Tarehe ya Kuundwa",
    },
    "branch.orphans": {
      en: "Orphans",
      sw: "Yatima",
    },
    "branch.orphansInBranch": {
      en: "orphans in this branch",
      sw: "yatima katika tawi hili",
    },
    
    // Center Overview translations
    "centerOverview.centerOverview": {
      en: "Center Overview",
      sw: "Muhtasari wa Kituo",
    },
    "centerOverview.centerOverviewDescription": {
      en: "View and manage your orphanage center details below.",
      sw: "Tazama na simamia maelezo ya kituo chako cha yatima hapa chini.",
    },
    "centerOverview.centerName": {
      en: "Center Name",
      sw: "Jina la Kituo",
    },
    "centerOverview.location": {
      en: "Location",
      sw: "Mahali",
    },
    "centerOverview.phoneNumber": {
      en: "Phone Number",
      sw: "Namba ya Simu",
    },
    "centerOverview.address": {
      en: "Address",
      sw: "Anuani",
    },
    "centerOverview.email": {
      en: "Email",
      sw: "Barua pepe",
    },
    "centerOverview.description": {
      en: "Description",
      sw: "Maelezo",
    },
    "centerOverview.edit": {
      en: "Edit Center",
      sw: "Hariri Kituo",
    },
    "centerOverview.delete": {
      en: "Delete Center",
      sw: "Futa Kituo",
    },
    "centerOverview.editCenter": {
      en: "Edit Center",
      sw: "Hariri Kituo",
    },
    "centerOverview.editCenterDescription": {
      en: "Update your orphanage center details below.",
      sw: "Sasisha maelezo ya kituo chako cha yatima hapa chini.",
    },
    "centerOverview.save": {
      en: "Save",
      sw: "Hifadhi",
    },
    // Common translations
    "common.email": {
      en: "Email",
      sw: "Barua pepe",
    },
    "common.phone": {
      en: "Phone",
      sw: "Simu",
    },
    "common.gender": {
      en: "Gender",
      sw: "Jinsia",
    },
    // Profile role translations
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
      sw: "Mwanajitolea",
    },
    "profile.role.donor": {
      en: "Donor",
      sw: "Mchangiaji",
    },
    "profile.notSpecified": {
      en: "Not Specified",
      sw: "Haijabainishwa",
    },

    // Registration Requests translations
    "registrationRequests.title": {
      en: "Orphanage Registration Requests",
      sw: "Maombi ya Usajili wa Kituo cha Yatima",
    },
    "registrationRequests.noRequests": {
      en: "No registration requests found.",
      sw: "Hakuna maombi ya usajili yaliyopatikana.",
    },
    "registrationRequests.loading": {
      en: "Loading registration requests...",
      sw: "Inapakia maombi ya usajili...",
    },
    "registrationRequests.gender": {
      en: "Gender:",
      sw: "Jinsia:",
    },
    "registrationRequests.email": {
      en: "Email:",
      sw: "Barua pepe:",
    },
    "registrationRequests.center": {
      en: "Center:",
      sw: "Kituo:",
    },
    "registrationRequests.region": {
      en: "Region:",
      sw: "Eneo:",
    },
    "registrationRequests.certificate": {
      en: "Certificate:",
      sw: "Cheti:",
    },
    "registrationRequests.viewPdf": {
      en: "View PDF",
      sw: "Tazama PDF",
    },
    "registrationRequests.status": {
      en: "Status:",
      sw: "Hali:",
    },
    "registrationRequests.approve": {
      en: "Approve",
      sw: "Kubali",
    },
    "registrationRequests.decline": {
      en: "Decline",
      sw: "Kataa",
    },
  };

  const t = (key: string): string => {
    // Get translation from the translations object
    const translation = translations[key]?.[language];
    // If translation exists, return it, otherwise return the key
    return translation || key;
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  return context
}

export function T({ k }: Readonly<{ k: string }>) {
  const { t } = useLanguage()
  return <>{t(k)}</>
}
