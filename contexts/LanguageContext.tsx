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
const translations: Record<string, Record<Language, string>> = {
  // Common
  "app.name": {
    en: "HopeFoundation",
    sw: "HopeFoundation",
  },
  "app.tagline": {
    en: "Empowering children, building futures",
    sw: "Kuwawezesha watoto, kujenga mustakabali",
  },
  "app.description": {
    en: "Join us in our mission to provide care, education, and opportunities for orphaned children.",
    sw: "Jiunge nasi katika dhamira yetu ya kutoa huduma, elimu, na fursa kwa watoto yatima.",
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
  },
  "branch.orphans": {
    en: "orphans",
    sw: "yatima",
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
  },
  "staff.finance": {
    en: "Finance",
    sw: "Fedha",
  },

  // Orphan
  "orphan.age": {
    en: "Age",
    sw: "Umri",
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
  },
  "orphan.education": {
    en: "Education Level",
    sw: "Kiwango cha Elimu",
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
  },
  "home.share.description": {
    en: "Share your campaign and reach more people via most popular social media channels.",
    sw: "Shiriki kampeni yako na ufikie watu wengi zaidi kupitia njia maarufu za mitandao ya kijamii.",
  },
  "footer.support": {
    en: "Support | Terms of Service | Privacy Policy",
    sw: "Msaada | Masharti ya Huduma | Sera ya Faragha",
  },
  "footer.copyright": {
    en: "© 2025 HopeFoundation. All rights reserved.",
    sw: "© 2025 HopeFoundation. Haki zote zimehifadhiwa.",
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
export function T({ k }: { k: string }) {
  const { t } = useLanguage()
  return <>{t(k)}</>
}
