"use client"

import { useLanguage } from '@/contexts/LanguageContext'
import { useAnalyticsTranslations } from '@/hooks/use-analytics-translations'

/**
 * This is a utility script to help convert from the old translation system
 * to the new analytics-specific translation system.
 * 
 * Instructions:
 * 1. First, locate all instances of t("report.xxx") in your file
 * 2. Open the file in VS Code
 * 3. Replace with ta("analytics.xxx") using the mapping below
 * 
 * Note: This is just a reference guide and isn't meant to be used directly in code.
 */

export default function AnalyticsTranslationHelper() {
  const { t } = useLanguage()
  const { t: ta } = useAnalyticsTranslations()
  
  // This component does nothing except help with the migration
  return null
}

/**
 * Translation Key Mapping
 * 
 * Old → New
 * ---------------
 * t("report.loadingAnalyticsData") → ta("analytics.loading")
 * t("report.reportInformation") → ta("analytics.reportInfo")
 * t("report.centreName") → ta("analytics.centreName")
 * t("report.createdBy") → ta("analytics.createdBy")
 * t("report.createdAt") → ta("analytics.createdAt")
 * t("report.totalRecords") → ta("analytics.totalRecords")
 * t("report.filtered") → ta("analytics.filtered")
 * t("report.appliedFilters") → ta("analytics.appliedFilters")
 * t("report.branchStatistics") → ta("analytics.branchStats")
 * t("report.branchStatsDescription") → ta("analytics.branchStatsDesc")
 * t("report.totalOrphans") → ta("analytics.totalOrphans")
 * t("report.genderDistribution") → ta("analytics.genderDistribution")
 * t("report.gender.male") → ta("analytics.male")
 * t("report.gender.female") → ta("analytics.female")
 * t("report.statusDistribution") → ta("analytics.statusDistribution")
 * t("report.active") → ta("analytics.active")
 * t("report.inactive") → ta("analytics.inactive")
 * t("report.adopted") → ta("analytics.adopted")
 * t("report.inventorySummary") → ta("analytics.inventorySummary")
 * t("report.inventorySummaryDescription") → ta("analytics.inventorySummaryDesc")
 * t("report.totalItems") → ta("analytics.totalItems")
 * t("report.food") → ta("analytics.food")
 * t("report.clothing") → ta("analytics.clothing")
 * t("report.medicine") → ta("analytics.medicine")
 * t("report.schoolSupplies") → ta("analytics.schoolSupplies")
 * t("report.other") → ta("analytics.other")
 * t("report.inStock") → ta("analytics.inStock")
 * t("report.lowStock") → ta("analytics.lowStock")
 * t("report.outOfStock") → ta("analytics.outOfStock")
 * t("report.fundraisingSummary") → ta("analytics.fundraisingSummary")
 * t("report.fundraisingSummaryDescription") → ta("analytics.fundraisingSummaryDesc")
 * t("report.totalCampaigns") → ta("analytics.totalCampaigns")
 * t("report.totalAmount") → ta("analytics.totalAmount")
 * t("report.volunteerSummary") → ta("analytics.volunteerSummary")
 * t("report.volunteerSummaryDescription") → ta("analytics.volunteerSummaryDesc")
 * t("report.totalVolunteers") → ta("analytics.totalVolunteers")
 * t("report.activeVolunteers") → ta("analytics.activeVolunteers")
 * t("report.staffSummary") → ta("analytics.staffSummary")
 * t("report.staffSummaryDescription") → ta("analytics.staffSummaryDesc")
 * t("report.totalStaff") → ta("analytics.totalStaff")
 * t("report.adminSummary") → ta("analytics.adminSummary")
 * t("report.adminSummaryDescription") → ta("analytics.adminSummaryDesc")
 * t("report.totalAdmins") → ta("analytics.totalAdmins")
 * 
 * # Chart Translations
 * t("report.orphansCount") → ta("analytics.orphansCount")
 * t("report.count") → ta("analytics.count")
 * t("report.inventory.categories") → ta("analytics.inventory.categories")
 * t("report.inventory.stockStatus") → ta("analytics.inventory.stockStatus")
 * t("report.inventory.transactions") → ta("analytics.inventory.transactions")
 * t("report.inventory.items") → ta("analytics.inventory.items")
 * t("report.fundraising.amounts") → ta("analytics.fundraising.amounts")
 * t("report.fundraising.status") → ta("analytics.fundraising.status")
 * t("report.fundraising.timeline") → ta("analytics.fundraising.timeline")
 * t("report.fundraising.campaigns") → ta("analytics.fundraising.campaigns")
 * t("report.fundraising.amount") → ta("analytics.fundraising.amount")
 * t("report.volunteers.status") → ta("analytics.volunteers.status")
 * t("report.volunteers.skills") → ta("analytics.volunteers.skills")
 * t("report.volunteers.volunteerHours") → ta("analytics.volunteers.volunteerHours")
 * t("report.volunteers.count") → ta("analytics.volunteers.count")
 * t("report.staff.departments") → ta("analytics.staff.departments")
 * t("report.staff.status") → ta("analytics.staff.status")
 * t("report.staff.roles") → ta("analytics.staff.roles")
 * 
 * # Age Groups
 * t("report.age.0-2") → ta("analytics.age.0-2")
 * t("report.age.3-5") → ta("analytics.age.3-5")
 * t("report.age.6-12") → ta("analytics.age.6-12")
 * t("report.age.13-17") → ta("analytics.age.13-17")
 * 
 * # Report Generator
 * t("report.reportGenerator") → ta("analytics.reportGenerator")
 * t("report.generateReport") → ta("analytics.generateReport")
 * t("report.reportType") → ta("analytics.reportType")
 * t("report.dateRange") → ta("analytics.dateRange")
 * t("report.from") → ta("analytics.from")
 * t("report.to") → ta("analytics.to")
 * t("report.filters") → ta("analytics.filters")
 * t("report.branch") → ta("analytics.branch")
 * t("report.category") → ta("analytics.category")
 * t("report.status") → ta("analytics.status")
 * t("report.exportFormat") → ta("analytics.exportFormat")
 * t("report.pdf") → ta("analytics.pdf")
 * t("report.excel") → ta("analytics.excel")
 * t("report.generating") → ta("analytics.generating")
 * t("report.downloadReport") → ta("analytics.downloadReport")
 */
