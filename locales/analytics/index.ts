"use client"

import { Language } from '@/contexts/LanguageContext'

// Define the translation record type
type TranslationRecord = Record<string, Record<Language, string>>

// Analytics & Reports translation file
const analyticsTranslations: TranslationRecord = {
  // Dashboard analytics titles
  "analytics.title": {
    en: "Analytics Dashboard",
    sw: "Dashibodi ya Uchambuzi",
  },
  "analytics.loading": {
    en: "Loading analytics data...",
    sw: "Inapakia data ya uchambuzi...",
  },
  
  // Report metadata
  "analytics.reportInfo": {
    en: "Report Information",
    sw: "Taarifa ya Ripoti",
  },
  "analytics.centreName": {
    en: "Centre Name",
    sw: "Jina la Kituo",
  },
  "analytics.createdBy": {
    en: "Created By",
    sw: "Imetengenezwa Na",
  },
  "analytics.createdAt": {
    en: "Created At",
    sw: "Imetengenezwa Tarehe",
  },
  "analytics.totalRecords": {
    en: "Total Records",
    sw: "Jumla ya Rekodi",
  },
  "analytics.filtered": {
    en: "filtered",
    sw: "zilizochujwa",
  },
  "analytics.appliedFilters": {
    en: "Applied Filters",
    sw: "Vichunguzi Vilivyotumika",
  },
  
  // Branch statistics
  "analytics.branchStats": {
    en: "Branch Statistics",
    sw: "Takwimu za Tawi",
  },
  "analytics.branchStatsDesc": {
    en: "Overview of key metrics across branches",
    sw: "Muhtasari wa vipimo muhimu katika matawi",
  },
  
  // Common metrics and labels
  "analytics.total": {
    en: "Total",
    sw: "Jumla",
  },
  "analytics.active": {
    en: "Active",
    sw: "Amilifu",
  },
  "analytics.inactive": {
    en: "Inactive",
    sw: "Siyo Amilifu",
  },
  "analytics.pending": {
    en: "Pending",
    sw: "Inasubiri",
  },
  "analytics.approved": {
    en: "Approved",
    sw: "Imeidhinishwa",
  },
  "analytics.completed": {
    en: "Completed",
    sw: "Imekamilika",
  },
  "analytics.rejected": {
    en: "Rejected",
    sw: "Imekataliwa",
  },
  "analytics.male": {
    en: "Male",
    sw: "Kiume",
  },
  "analytics.female": {
    en: "Female",
    sw: "Kike",
  },
  "analytics.adopted": {
    en: "Adopted",
    sw: "Ametarajiwa",
  },
  "analytics.count": {
    en: "Count",
    sw: "Idadi",
  },
  "analytics.percentage": {
    en: "Percentage",
    sw: "Asilimia",
  },
  "analytics.locale": {
    en: "en",
    sw: "sw",
  },
  "analytics.name": {
    en: "Name",
    sw: "Jina",
  },
  "analytics.username": {
    en: "Username",
    sw: "Jina la Mtumiaji",
  },
  "analytics.email": {
    en: "Email",
    sw: "Barua pepe",
  },
  "analytics.role": {
    en: "Role",
    sw: "Wajibu",
  },
  "analytics.branch": {
    en: "Branch",
    sw: "Tawi",
  },
  "analytics.status": {
    en: "Status",
    sw: "Hali",
  },
  
  // Orphan analytics
  "analytics.orphanSummary": {
    en: "Orphan Summary",
    sw: "Muhtasari wa Yatima",
  },
  "analytics.summaryDesc": {
    en: "Overview of key metrics",
    sw: "Muhtasari wa vipimo muhimu",
  },
  "analytics.totalOrphans": {
    en: "Total Orphans",
    sw: "Jumla ya Yatima",
  },
  "analytics.activeOrphans": {
    en: "Active Orphans",
    sw: "Yatima Waamilifu",
  },
  "analytics.inactiveOrphans": {
    en: "Inactive Orphans",
    sw: "Yatima Wasio Amilifu",
  },
  "analytics.genderDistribution": {
    en: "Gender Distribution",
    sw: "Mgawanyo wa Jinsia",
  },
  "analytics.statusDistribution": {
    en: "Status Distribution",
    sw: "Mgawanyo wa Hali",
  },
  "analytics.ageDistribution": {
    en: "Age Distribution",
    sw: "Mgawanyo wa Umri",
  },
  "analytics.branchDistribution": {
    en: "Branch Distribution",
    sw: "Mgawanyo wa Matawi",
  },
  "analytics.branchDistributionDesc": {
    en: "Orphans distributed across branches",
    sw: "Yatima walivyosambazwa kwenye matawi",
  },
  "analytics.orphansCount": {
    en: "orphans",
    sw: "yatima",
  },
  "analytics.noOrphanData": {
    en: "No orphan data available",
    sw: "Hakuna data ya yatima",
  },
  "analytics.age.0-2": {
    en: "0-2 years",
    sw: "Miaka 0-2",
  },
  "analytics.age.3-5": {
    en: "3-5 years",
    sw: "Miaka 3-5",
  },
  "analytics.age.6-12": {
    en: "6-12 years",
    sw: "Miaka 6-12",
  },
  "analytics.age.13-17": {
    en: "13-17 years",
    sw: "Miaka 13-17",
  },
  "analytics.orphans.demographics": {
    en: "Demographics",
    sw: "Idadi ya Watu",
  },
  "analytics.orphans.ageDistribution": {
    en: "Age Groups",
    sw: "Vikundi vya Umri",
  },
  "analytics.orphans.status": {
    en: "Status",
    sw: "Hali",
  },
  
  // Inventory analytics
  "analytics.inventorySummary": {
    en: "Inventory Summary",
    sw: "Muhtasari wa Bohari",
  },
  "analytics.inventorySummaryDesc": {
    en: "Overview of inventory items and status",
    sw: "Muhtasari wa vitu vya bohari na hali",
  },
  "analytics.totalItems": {
    en: "Total Items",
    sw: "Jumla ya Bidhaa",
  },
  "analytics.healthyStockItems": {
    en: "Healthy Stock Items",
    sw: "Bidhaa zenye Stoki Nzuri",
  },
  "analytics.lowStockItems": {
    en: "Low Stock Items",
    sw: "Bidhaa zenye Stoki Ndogo",
  },
  "analytics.noStockItems": {
    en: "Out of Stock Items",
    sw: "Bidhaa Zilizoisha Stoki",
  },
  "analytics.inventoryValue": {
    en: "Inventory Value",
    sw: "Thamani ya Bohari",
  },
  "analytics.inventoryValueDesc": {
    en: "Financial overview of inventory",
    sw: "Muhtasari wa kifedha wa bohari",
  },
  "analytics.totalValue": {
    en: "Total Value",
    sw: "Thamani ya Jumla",
  },
  "analytics.averageItemValue": {
    en: "Average Item Value",
    sw: "Wastani wa Thamani ya Bidhaa",
  },
  "analytics.recentTransactions": {
    en: "Recent Transactions",
    sw: "Miamala ya Hivi Karibuni",
  },
  "analytics.recentTransactionsDesc": {
    en: "Latest inventory movements",
    sw: "Harakati za hivi karibuni za bohari",
  },
  "analytics.transactionIn": {
    en: "IN",
    sw: "NDANI",
  },
  "analytics.transactionOut": {
    en: "OUT",
    sw: "NJE",
  },
  "analytics.noRecentTransactions": {
    en: "No recent transactions",
    sw: "Hakuna miamala ya hivi karibuni",
  },
  "analytics.food": {
    en: "Food",
    sw: "Chakula",
  },
  "analytics.clothing": {
    en: "Clothing",
    sw: "Mavazi",
  },
  "analytics.medicine": {
    en: "Medicine",
    sw: "Dawa",
  },
  "analytics.schoolSupplies": {
    en: "School Supplies",
    sw: "Vifaa vya Shule",
  },
  "analytics.other": {
    en: "Other",
    sw: "Nyingine",
  },
  "analytics.inStock": {
    en: "In Stock",
    sw: "Ipo Stoki",
  },
  "analytics.lowStock": {
    en: "Low Stock",
    sw: "Stoki Ndogo",
  },
  "analytics.outOfStock": {
    en: "Out of Stock",
    sw: "Imeisha Stoki",
  },
  "analytics.noInventoryData": {
    en: "No inventory data available",
    sw: "Hakuna data ya bohari",
  },
  "analytics.inventory.categories": {
    en: "Categories",
    sw: "Aina",
  },
  "analytics.inventory.stockStatus": {
    en: "Stock Status",
    sw: "Hali ya Stoki",
  },
  "analytics.inventory.transactions": {
    en: "Transactions",
    sw: "Miamala",
  },
  "analytics.inventory.items": {
    en: "items",
    sw: "vitu",
  },
  
  // Fundraising analytics
  "analytics.fundraisingSummary": {
    en: "Fundraising Summary",
    sw: "Muhtasari wa Ukusanyaji Fedha",
  },
  "analytics.fundraisingSummaryDesc": {
    en: "Overview of fundraising campaigns and amounts",
    sw: "Muhtasari wa kampeni za ukusanyaji fedha na kiasi",
  },
  "analytics.totalCampaigns": {
    en: "Total Campaigns",
    sw: "Jumla ya Kampeni",
  },
  "analytics.totalAmount": {
    en: "Total Amount",
    sw: "Jumla ya Kiasi",
  },
  "analytics.totalAmountRaised": {
    en: "Total Amount Raised",
    sw: "Jumla ya Kiasi Kilichokusanywa",
  },
  "analytics.totalContributions": {
    en: "Total Contributions",
    sw: "Jumla ya Michango",
  },
  "analytics.uniqueContributors": {
    en: "Unique Contributors",
    sw: "Wachangiaji wa Kipekee",
  },
  "analytics.recurringContributors": {
    en: "Recurring Contributors",
    sw: "Wachangiaji wa Mara kwa Mara",
  },
  "analytics.contributionAnalysis": {
    en: "Contribution Analysis",
    sw: "Uchambuzi wa Michango",
  },
  "analytics.contributionAnalysisDesc": {
    en: "Metrics on donation patterns",
    sw: "Vipimo vya mitindo ya michango",
  },
  "analytics.averageContribution": {
    en: "Average Contribution",
    sw: "Wastani wa Mchango",
  },
  "analytics.retentionRate": {
    en: "Retention Rate",
    sw: "Kiwango cha Ubakie",
  },
  "analytics.topEvents": {
    en: "Top Events",
    sw: "Matukio Bora",
  },
  "analytics.topEventsDesc": {
    en: "Highest performing fundraising events",
    sw: "Matukio ya ukusanyaji fedha yenye ufanisi mkubwa",
  },
  "analytics.noFundraisingEvents": {
    en: "No fundraising events data",
    sw: "Hakuna data ya matukio ya ukusanyaji fedha",
  },
  "analytics.noFundraisingData": {
    en: "No fundraising data available",
    sw: "Hakuna data ya ukusanyaji fedha",
  },
  "analytics.fundraising.amounts": {
    en: "Amounts",
    sw: "Kiasi",
  },
  "analytics.fundraising.status": {
    en: "Status",
    sw: "Hali",
  },
  "analytics.fundraising.timeline": {
    en: "Timeline",
    sw: "Muda",
  },
  "analytics.fundraising.campaigns": {
    en: "campaigns",
    sw: "kampeni",
  },
  "analytics.fundraising.amount": {
    en: "Amount",
    sw: "Kiasi",
  },
  
  // Volunteer analytics
  "analytics.volunteerSummary": {
    en: "Volunteer Summary",
    sw: "Muhtasari wa Kujitolea",
  },
  "analytics.volunteerSummaryDesc": {
    en: "Overview of volunteer activities and contributions",
    sw: "Muhtasari wa shughuli za kujitolea na michango",
  },
  "analytics.totalVolunteers": {
    en: "Total Volunteers",
    sw: "Jumla ya Wanaojitolea",
  },
  "analytics.activeVolunteers": {
    en: "Active Volunteers",
    sw: "Wanaojitolea Waamilifu",
  },
  "analytics.pendingVolunteers": {
    en: "Pending Volunteers",
    sw: "Wanaojitolea Wanaosubiri",
  },
  "analytics.volunteersBySkill": {
    en: "Volunteers by Skill",
    sw: "Wanaojitolea kwa Ujuzi",
  },
  "analytics.volunteersBySkillDesc": {
    en: "Breakdown of volunteer skills",
    sw: "Mgawanyo wa ujuzi wa wanaojitolea",
  },
  "analytics.noVolunteerSkills": {
    en: "No volunteer skills data available",
    sw: "Hakuna data ya ujuzi wa wanaojitolea",
  },
  "analytics.volunteersByBranch": {
    en: "Volunteers by Branch",
    sw: "Wanaojitolea kwa Tawi",
  },
  "analytics.volunteersByBranchDesc": {
    en: "Distribution of volunteers across branches",
    sw: "Mgawanyo wa wanaojitolea katika matawi",
  },
  "analytics.noVolunteerBranches": {
    en: "No volunteer branch data available",
    sw: "Hakuna data ya matawi ya wanaojitolea",
  },
  "analytics.noVolunteerData": {
    en: "No volunteer data available",
    sw: "Hakuna data ya wanaojitolea",
  },
  "analytics.volunteers.status": {
    en: "Status",
    sw: "Hali",
  },
  "analytics.volunteers.skills": {
    en: "Skills",
    sw: "Ujuzi",
  },
  "analytics.volunteers.volunteerHours": {
    en: "Volunteer Hours",
    sw: "Masaa ya Kujitolea",
  },
  "analytics.volunteers.count": {
    en: "volunteers",
    sw: "wanaojitolea",
  },
  
  // Staff analytics
  "analytics.staffSummary": {
    en: "Staff Summary",
    sw: "Muhtasari wa Wafanyakazi",
  },
  "analytics.staffSummaryDesc": {
    en: "Overview of staff members and roles",
    sw: "Muhtasari wa wafanyakazi na majukumu",
  },
  "analytics.totalStaff": {
    en: "Total Staff",
    sw: "Jumla ya Wafanyakazi",
  },
  "analytics.noStaffData": {
    en: "No staff data available",
    sw: "Hakuna data ya wafanyakazi",
  },
  "analytics.staff": {
    en: "staff",
    sw: "wafanyakazi",
  },
  "analytics.staff.departments": {
    en: "Departments",
    sw: "Idara",
  },
  "analytics.staff.status": {
    en: "Status",
    sw: "Hali",
  },
  "analytics.staff.roles": {
    en: "Roles",
    sw: "Majukumu",
  },
  
  // Admin analytics
  "analytics.adminSummary": {
    en: "Admin Summary",
    sw: "Muhtasari wa Msimamizi",
  },
  "analytics.adminSummaryDesc": {
    en: "Overview of administrative metrics",
    sw: "Muhtasari wa vipimo vya kiutawala",
  },
  "analytics.totalAdmins": {
    en: "Total Admins",
    sw: "Jumla ya Wasimamizi",
  },
  "analytics.activeAdmins": {
    en: "Active Admins",
    sw: "Wasimamizi Waamilifu",
  },
  "analytics.suspendedAdmins": {
    en: "Suspended Admins",
    sw: "Wasimamizi Waliosimamishwa",
  },
  "analytics.roleBreakdown": {
    en: "Role Breakdown",
    sw: "Mgawanyo wa Majukumu",
  },
  "analytics.roleBreakdownDesc": {
    en: "Distribution of admin roles",
    sw: "Mgawanyo wa majukumu ya wasimamizi",
  },
  "analytics.supervisors": {
    en: "Supervisors",
    sw: "Wasimamizi",
  },
  "analytics.orphanageAdmins": {
    en: "Orphanage Admins",
    sw: "Wasimamizi wa Nyumba ya Yatima",
  },
  "analytics.superUsers": {
    en: "Super Users",
    sw: "Watumiaji wa Juu",
  },
  "analytics.branchAssignment": {
    en: "Branch Assignment",
    sw: "Mgao wa Matawi",
  },
  "analytics.branchAssignmentDesc": {
    en: "Admin distribution across branches",
    sw: "Mgawanyo wa wasimamizi katika matawi",
  },
  "analytics.noBranchAssignments": {
    en: "No branch assignment data",
    sw: "Hakuna data ya mgao wa matawi",
  },
  "analytics.adminList": {
    en: "Admin List",
    sw: "Orodha ya Wasimamizi",
  },
  "analytics.adminListDesc": {
    en: "Detailed list of all administrators",
    sw: "Orodha ya kina ya wasimamizi wote",
  },
  "analytics.noAdminData": {
    en: "No admin data available",
    sw: "Hakuna data ya msimamizi",
  },
  
  // Education
  "analytics.education": {
    en: "Education",
    sw: "Elimu",
  },
  "analytics.healthcare": {
    en: "Healthcare",
    sw: "Afya",
  },
  "analytics.facilities": {
    en: "Facilities",
    sw: "Vifaa",
  },
  "analytics.events": {
    en: "Events",
    sw: "Matukio",
  },
  "analytics.activities": {
    en: "Activities",
    sw: "Shughuli",
  },
  "analytics.administration": {
    en: "Administration",
    sw: "Utawala",
  },
  
  // Report Generation
  "analytics.reportGenerator": {
    en: "Report Generator",
    sw: "Jenereta ya Ripoti",
  },
  "analytics.generateReport": {
    en: "Generate Report",
    sw: "Tengeneza Ripoti",
  },
  "analytics.reportType": {
    en: "Report Type",
    sw: "Aina ya Ripoti",
  },
  "analytics.dateRange": {
    en: "Date Range",
    sw: "Kipindi cha Tarehe",
  },
  "analytics.from": {
    en: "From",
    sw: "Kutoka",
  },
  "analytics.to": {
    en: "To",
    sw: "Hadi",
  },
  "analytics.filters": {
    en: "Filters",
    sw: "Vichunguzi",
  },
  "analytics.category": {
    en: "Category",
    sw: "Aina",
  },
  "analytics.exportFormat": {
    en: "Export Format",
    sw: "Muundo wa Kuhamishia",
  },
  "analytics.pdf": {
    en: "PDF",
    sw: "PDF",
  },
  "analytics.excel": {
    en: "Excel",
    sw: "Excel",
  },
  "analytics.generating": {
    en: "Generating report...",
    sw: "Inatengeneza ripoti...",
  },
  "analytics.downloadReport": {
    en: "Download Report",
    sw: "Pakua Ripoti",
  }
}

export default analyticsTranslations
