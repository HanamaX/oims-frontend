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
  },
  "staff.finance": {
    en: "Finance",
    sw: "Fedha",  },

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
  },
  "inventory.close": {
    en: "Close",
    sw: "Funga",
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
  },
  "admin.dashboard.dateUnavailable": {
    en: "Date unavailable",
    sw: "Tarehe haipatikani",
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
  },
  "orphans.filter.inactive": {
    en: "Inactive Orphans",
    sw: "Yatima Wasiokuwa Hai",
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

  // Common UI elements
  "ui.loading": {
    en: "Loading...",
    sw: "Inapakia...",
  },
  "ui.notAvailable": {
    en: "Not available",
    sw: "Haupatikani",
  },
  "ui.pagination.showing": {
    en: "Showing",
    sw: "Inaonyesha",
  },
  "ui.pagination.of": {
    en: "of",
    sw: "kati ya",
  },
  "ui.pagination.orphans": {
    en: "orphans",
    sw: "yatima",
  },
  "ui.pagination.volunteers": {
    en: "volunteers",
    sw: "wajitolea",
  },
  "ui.pagination.fundraisers": {
    en: "fundraisers",
    sw: "michango",
  },  "ui.pagination.items": {
    en: "items",
    sw: "vitu",
  },
  
  // Profile Page
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
    en: "Profile Information",
    sw: "Taarifa za Wasifu",
  },
  "profile.view.description": {
    en: "View and update your personal information",
    sw: "Angalia na sasisha taarifa zako binafsi",
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
    en: "Email",
    sw: "Barua Pepe",
  },
  "profile.label.phone": {
    en: "Phone",
    sw: "Namba ya Simu",
  },
  "profile.label.phoneOptional": {
    en: "Phone (optional)",
    sw: "Namba ya Simu (hiyari)",
  },
  "profile.label.gender": {
    en: "Gender",
    sw: "Jinsia",
  },
  "profile.label.genderOptional": {
    en: "Gender (optional)",
    sw: "Jinsia (hiyari)",
  },
  "profile.label.role": {
    en: "Role",
    sw: "Wajibu",
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
  "profile.gender.male": {
    en: "Male",
    sw: "Mwanaume",
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
    en: "Prefer not to say",
    sw: "Napendelea kutosema",
  },
  "profile.role.superAdmin": {
    en: "Super Admin",
    sw: "Msimamizi Mkuu",
  },
  "profile.role.admin": {
    en: "Admin",
    sw: "Msimamizi",
  },
  "profile.role.volunteer": {
    en: "Volunteer",
    sw: "Mjitolea",
  },
  "profile.role.donor": {
    en: "Donor",
    sw: "Mfadhili",
  },
  "profile.notSpecified": {
    en: "Not Specified",
    sw: "Haijabainishwa",
  },
  "profile.uploadImage.clickTo": {
    en: "Click to upload profile image",
    sw: "Bofya kupakia picha ya wasifu",
  },
  "profile.uploadImage.formats": {
    en: "PNG, JPG or JPEG (max. 4MB)",
    sw: "PNG, JPG au JPEG (upeo. 4MB)",
  },
  "profile.uploadImage.error": {
    en: "Image is invalid or too large. Maximum size is 4MB.",
    sw: "Picha ni batili au kubwa mno. Ukubwa wa juu ni 4MB.",
  },
  "profile.button.cancel": {
    en: "Cancel",
    sw: "Ghairi",
  },
  "profile.button.saveChanges": {
    en: "Save Changes",
    sw: "Hifadhi Mabadiliko",
  },
  "profile.button.updating": {
    en: "Updating...",
    sw: "Inasasisha...",
  },
  "profile.error.name": {
    en: "Name is required",
    sw: "Jina linahitajika",
  },
  "profile.error.email": {
    en: "Email is required",
    sw: "Barua pepe inahitajika",
  },
  "profile.error.update": {
    en: "Failed to update profile. Please try again.",
    sw: "Imeshindwa kusasisha wasifu. Tafadhali jaribu tena.",
  },
  "profile.error.imageUpload": {
    en: "Failed to upload profile image. Please try again.",
    sw: "Imeshindwa kupakia picha ya wasifu. Tafadhali jaribu tena.",
  },
  "profile.error.imageSize": {
    en: "Image file size must be less than 4MB",
    sw: "Ukubwa wa faili ya picha lazima uwe chini ya 4MB",
  },
  "profile.success.update": {
    en: "Profile updated successfully!",
    sw: "Wasifu umesasishwa kwa mafanikio!",
  },
  "profile.password.title": {
    en: "Change Password",
    sw: "Badilisha Nenosiri",
  },
  "profile.password.description": {
    en: "Update your account password",
    sw: "Sasisha nenosiri la akaunti yako",
  },
  "profile.password.current": {
    en: "Current Password",
    sw: "Nenosiri la Sasa",
  },
  "profile.password.new": {
    en: "New Password",
    sw: "Nenosiri Jipya",
  },
  "profile.password.confirm": {
    en: "Confirm New Password",
    sw: "Thibitisha Nenosiri Jipya",
  },
  "profile.password.button": {
    en: "Change Password",
    sw: "Badilisha Nenosiri",
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
    en: "New passwords do not match",
    sw: "Manenosiri mapya hayalingani",
  },
  "profile.password.error.length": {
    en: "Password must be at least 8 characters long",
    sw: "Nenosiri lazima liwe na urefu wa angalau herufi 8",
  },
  "profile.password.error.update": {
    en: "Failed to update password. Please ensure your current password is correct.",
    sw: "Imeshindwa kusasisha nenosiri. Tafadhali hakikisha nenosiri lako la sasa ni sahihi.",
  },
  "profile.password.success": {
    en: "Password updated successfully!",
    sw: "Nenosiri limesasishwa kwa mafanikio!",
  },
  "profile.loading": {
    en: "Loading...",
    sw: "Inapakia...",
  },
  "ui.error": {
    en: "An error occurred",
    sw: "Hitilafu imetokea",
  },
  "ui.success": {
    en: "Success",
    sw: "Mafanikio",
  },
  "ui.warning": {
    en: "Warning",
    sw: "Onyo",
  },
  "ui.info": {
    en: "Information",
    sw: "Habari",
  },
  "ui.close": {
    en: "Close",
    sw: "Funga",
  },
  "ui.search": {
    en: "Search",
    sw: "Tafuta",
  },
  "ui.filter": {
    en: "Filter",
    sw: "Chuja",
  },
  "ui.view": {
    en: "View",
    sw: "Angalia",
  },
  "ui.edit": {
    en: "Edit",
    sw: "Hariri",
  },
  "ui.delete": {
    en: "Delete",
    sw: "Futa",
  },
  "ui.cancel": {
    en: "Cancel",
    sw: "Ghairi",
  },
  "ui.confirm": {
    en: "Confirm",
    sw: "Thibitisha",
  },
  "ui.save": {
    en: "Save",
    sw: "Hifadhi",
  },
  "ui.submit": {
    en: "Submit",
    sw: "Wasilisha",
  },
  "ui.update": {
    en: "Update",
    sw: "Sasisha",
  },
  "ui.add": {
    en: "Add",
    sw: "Ongeza",
  },
  "ui.remove": {
    en: "Remove",
    sw: "Ondoa",
  },
  "ui.back": {
    en: "Back",
    sw: "Rudi",
  },
  "ui.next": {
    en: "Next",
    sw: "Ifuatayo",
  },
  "ui.previous": {
    en: "Previous",
    sw: "Iliyotangulia",
  },

  // Status indicators
  "status.active": {
    en: "Active",
    sw: "Inayofanya kazi",
  },
  "status.inactive": {
    en: "Inactive",
    sw: "Isiyofanya kazi",
  },
  "status.pending": {
    en: "Pending",
    sw: "Inasubiri",
  },
  "status.approved": {
    en: "Approved",
    sw: "Imeidhinishwa",
  },
  "status.rejected": {
    en: "Rejected",
    sw: "Imekataliwa",
  },
  "status.completed": {
    en: "Completed",
    sw: "Imekamilika",
  },
  "status.cancelled": {
    en: "Cancelled",
    sw: "Imeghairiwa",
  },
  "status.draft": {
    en: "Draft",
    sw: "Rasimu",
  },
  "status.archived": {
    en: "Archived",
    sw: "Imehifadhiwa",
  },
  "status.lowStock": {
    en: "Low Stock",
    sw: "Hifadhi Ndogo",
  },
  "status.outOfStock": {
    en: "Out of Stock",
    sw: "Imeisha",
  },
  "status.inStock": {
    en: "In Stock",
    sw: "Inapatikana",
  },
  "status.processing": {
    en: "Processing",
    sw: "Inachakatwa",
  },
  "status.shipping": {
    en: "Shipping",
    sw: "Inasafirishwa",
  },
  "status.delivered": {
    en: "Delivered",
    sw: "Imepokelewa",
  }
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
