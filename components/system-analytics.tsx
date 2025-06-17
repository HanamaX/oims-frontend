import React from 'react'
import { useSystemAnalytics } from '@/hooks/use-system-analytics'
import ReportStats from '@/components/report-stats-new'
import { ReportType } from '@/lib/report-service'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAnalyticsTranslations } from '@/hooks/use-analytics-translations'
import { Badge } from '@/components/ui/badge'
import styles from './analytics-styles.module.css'

interface SystemAnalyticsProps {
  reportType: ReportType
  branchId?: string
  sampleData: any
}

export default function SystemAnalytics({ reportType, branchId, sampleData }: SystemAnalyticsProps) {
  const { analyticsData, loading } = useSystemAnalytics({ reportType, branchId })
  const { t: ta, language } = useAnalyticsTranslations() // New analytics-specific translations
  
  // Helper function for formatting currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language === "sw" ? 'sw-TZ' : 'en-US', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0)
  }
  
  // Ensure sampleData exists for the current report type
  const safeSampleData = sampleData || {}
  
  // Check if we have real data for this report type
  const hasRealData = analyticsData && Object.keys(analyticsData).length > 0
    if (loading) {
    return (      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
        <span className="ml-2 text-green-600">{ta("analytics.loading")}</span>
      </div>
    )
  }
  // Show the report metadata card if we have real data
  const renderMetadata = () => {
    if (!hasRealData || !analyticsData.metadata) return null
    
    const { metadata } = analyticsData
    
    return (      <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
        <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base text-green-800">{ta("analytics.reportInfo")}</CardTitle>
            <Badge variant="outline" className="bg-green-100 text-green-700">
              {metadata.reportType}
            </Badge>
          </div>
          <CardDescription>{metadata.reportScope}: {metadata.scopeDetails}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{ta("analytics.centreName")}</p>
              <p className="font-medium">{metadata.centreName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{ta("analytics.createdBy")}</p>
              <p className="font-medium">{metadata.createdBy} ({metadata.creatorRole})</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{ta("analytics.createdAt")}</p>
              <p className="font-medium">{new Date(metadata.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{ta("analytics.totalRecords")}</p>
              <p className="font-medium">{metadata.totalRecordsProcessed} ({metadata.filteredRecordsReturned} {ta("analytics.filtered")})</p>
            </div>
          </div>
          
          {metadata.appliedFilters && (
            <div className="mt-2 pt-2 border-t border-green-100">
              <p className="text-sm text-muted-foreground">{ta("analytics.appliedFilters")}</p>
              <p className="font-medium">{metadata.appliedFilters}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
    // Show branch statistics if available
  const renderBranchStats = () => {
    if (!hasRealData || !analyticsData.branchStatistics || analyticsData.branchStatistics.length === 0) return null
    
    return (      <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
        <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <CardTitle className="text-base text-green-800">{ta("analytics.branchStats")}</CardTitle>
          <CardDescription>{ta("analytics.branchStatsDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">            {analyticsData.branchStatistics.map((branch: any) => (
              <div key={branch.branchCode} className="p-3 bg-green-50 rounded-md border border-green-100">
                <h4 className="text-green-800 font-medium">{branch.branchName}</h4>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{ta("analytics.totalOrphans")}</p>
                    <p className="font-medium">{branch.totalOrphans}</p>
                  </div>
                  <div>                    <p className="text-xs text-muted-foreground">{ta("analytics.genderDistribution")}</p>
                    <p className="font-medium">
                      {Object.entries(branch.genderDistribution).map(([gender, count]) => {
                        // Translate gender labels
                        const translatedGender = gender === 'Male' 
                          ? ta("analytics.male") 
                          : gender === 'Female' 
                            ? ta("analytics.female") 
                            : gender;
                        return `${translatedGender}: ${count}`;
                      }).join(', ')}
                    </p>
                  </div>
                  <div>                    <p className="text-xs text-muted-foreground">{ta("analytics.statusDistribution")}</p>
                    <p className="font-medium">
                      {Object.entries(branch.statusDistribution).map(([status, count]) => {
                        // Translate status labels
                        let translatedStatus = status;
                        if (status === 'Active') translatedStatus = ta("analytics.active");
                        else if (status === 'Inactive') translatedStatus = ta("analytics.inactive");
                        else if (status === 'Adopted') translatedStatus = ta("analytics.adopted");
                        return `${translatedStatus}: ${count}`;
                      }).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
    // Render inventory summary cards
  const renderInventorySummary = () => {
    if (reportType !== 'inventory' || !hasRealData) return null
    
    return (      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <CardTitle className="text-base text-green-800">{ta("analytics.inventorySummary")}</CardTitle>
            <CardDescription>{ta("analytics.inventorySummaryDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex justify-between">
              <span className="text-green-700">{ta("analytics.totalItems")}</span>
              <span className="font-medium text-green-800">{analyticsData.totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">{ta("analytics.healthyStockItems")}</span>
              <span className="font-medium text-green-800">{analyticsData.healthyStockItems}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">{ta("analytics.lowStockItems")}</span>
              <span className="font-medium text-green-800">{analyticsData.lowStockItems}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">{ta("analytics.noStockItems")}</span>
              <span className="font-medium text-green-800">{analyticsData.noStockItems}</span>
            </div>
          </CardContent>
        </Card>
          <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <CardTitle className="text-base text-green-800">{ta("analytics.inventoryValue")}</CardTitle>
            <CardDescription>{ta("analytics.inventoryValueDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex justify-between">
              <span className="text-green-700">{ta("analytics.totalValue")}</span>              <span className="font-medium text-green-800">
                {formatCurrency(analyticsData.totalInventoryValue)}
              </span>
            </div>            <div className="flex justify-between">
              <span className="text-green-700">{ta("analytics.averageItemValue")}</span>              <span className="font-medium text-green-800">
                {formatCurrency(analyticsData.averageItemValue)}
              </span>
            </div>
          </CardContent>
        </Card>
          <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <CardTitle className="text-base text-green-800">{ta("analytics.recentTransactions")}</CardTitle>
            <CardDescription>{ta("analytics.recentTransactionsDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {analyticsData.recentTransactions && analyticsData.recentTransactions.slice(0, 3).map((transaction: any, idx: number) => (
                <div key={transaction.transactionId} className="p-2 bg-green-50 rounded-md border border-green-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-800">{transaction.itemName}</span>
                    <Badge                      variant={transaction.transactionType === 'IN' ? 'default' : 'destructive'} 
                      className={transaction.transactionType === 'IN' ? 'bg-green-600' : ''}
                    >
                      {transaction.transactionType === 'IN' 
                        ? ta("analytics.transactionIn") 
                        : ta("analytics.transactionOut")}
                    </Badge>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>{transaction.date}</span>
                    <span>{transaction.quantity} units</span>
                  </div>
                </div>
              ))}
                {(!analyticsData.recentTransactions || analyticsData.recentTransactions.length === 0) && (
                <div className="text-center text-gray-500 p-2">
                  {ta("analytics.noRecentTransactions")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  // Render admin/staff summary cards
  const renderAdminSummary = () => {
    if (reportType !== 'staff' || !hasRealData) return null
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">        <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <CardTitle className="text-base text-green-800">{ta("analytics.adminSummary")}</CardTitle>
            <CardDescription>{ta("analytics.adminSummaryDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex justify-between">
              <span className="text-green-700">{ta("analytics.totalAdmins")}</span>
              <span className="font-medium text-green-800">{analyticsData.totalAdmins || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">{ta("analytics.activeAdmins")}</span>
              <span className="font-medium text-green-800">{analyticsData.statistics?.activeAdmins || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">{ta("analytics.suspendedAdmins")}</span>
              <span className="font-medium text-green-800">{analyticsData.statistics?.suspendedAdmins || 0}</span>
            </div>
          </CardContent>
        </Card>
          <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <CardTitle className="text-base text-green-800">{ta("analytics.roleBreakdown")}</CardTitle>
            <CardDescription>{ta("analytics.roleBreakdownDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex justify-between">
              <span className="text-green-700">{ta("analytics.supervisors")}</span>
              <span className="font-medium text-green-800">{analyticsData.statistics?.supervisors || analyticsData.roleDistribution?.['ROLE_SUPERVISOR'] || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">{ta("analytics.orphanageAdmins")}</span>
              <span className="font-medium text-green-800">{analyticsData.statistics?.orphanageAdmins || analyticsData.roleDistribution?.['ROLE_ORPHANAGE_ADMIN'] || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">{ta("analytics.superUsers")}</span>
              <span className="font-medium text-green-800">{analyticsData.statistics?.superusers || analyticsData.roleDistribution?.['ROLE_SUPERUSER'] || 0}</span>
            </div>
          </CardContent>
        </Card>
          <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <CardTitle className="text-base text-green-800">{ta("analytics.branchAssignment")}</CardTitle>
            <CardDescription>{ta("analytics.branchAssignmentDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">            {Object.entries(analyticsData.branchAssignmentStats || {}).map(([branch, count]) => (
              <div key={branch} className="flex justify-between">
                <span className="text-green-700">{branch}</span>
                <span className="font-medium text-green-800">{Number(count)}</span>
              </div>
            ))}
            {(!analyticsData.branchAssignmentStats || Object.keys(analyticsData.branchAssignmentStats).length === 0) && (
              <div className="text-center text-gray-500">
                {ta("analytics.noBranchAssignments")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }
  // Render admin list table
  const renderAdminList = () => {
    if (reportType !== 'staff' || !hasRealData || !analyticsData.admins || analyticsData.admins.length === 0) return null
    
    return (      <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 mt-6">
        <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <CardTitle className="text-base text-green-800">{ta("analytics.adminList")}</CardTitle>
          <CardDescription>{ta("analytics.adminListDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-green-50">
                <tr>
                  <th className="px-4 py-2">{ta("analytics.name")}</th>
                  <th className="px-4 py-2">{ta("analytics.username")}</th>
                  <th className="px-4 py-2">{ta("analytics.email")}</th>
                  <th className="px-4 py-2">{ta("analytics.role")}</th>
                  <th className="px-4 py-2">{ta("analytics.branch")}</th>
                  <th className="px-4 py-2">{ta("analytics.status")}</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.admins.map((admin: any) => (
                  <tr key={admin.publicId} className="border-b hover:bg-green-50 transition-colors">
                    <td className="px-4 py-2 font-medium">{admin.fullName || 'N/A'}</td>
                    <td className="px-4 py-2">{admin.username}</td>
                    <td className="px-4 py-2">{admin.email}</td>
                    <td className="px-4 py-2">
                      {admin.primaryRole?.replace('ROLE_', '') || admin.roles?.[0]?.replace('ROLE_', '') || 'N/A'}
                    </td>
                    <td className="px-4 py-2">{admin.branchName || 'N/A'}</td>                    <td className="px-4 py-2">                      <Badge className={admin.accountStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {admin.accountStatus === 'Active' 
                          ? ta("analytics.active") 
                          : admin.accountStatus === 'Inactive' 
                            ? ta("analytics.inactive")
                            : admin.accountStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>        </CardContent>
      </Card>
    )
  }
  
  // Render fundraising summary cards
  const renderFundraisingSummary = () => {
    if (reportType !== 'fundraising' || !hasRealData) return null
    
    return (      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <CardTitle className="text-base text-green-800">{ta("analytics.fundraisingSummary")}</CardTitle>
            <CardDescription>{ta("analytics.fundraisingSummaryDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex justify-between">
              <span className="text-green-700">{ta("analytics.totalAmountRaised")}</span>              <span className="font-medium text-green-800">
                {formatCurrency(analyticsData.totalAmountRaised)}
              </span>
            </div>            <div className="flex justify-between">
              <span className="text-green-700">{ta("analytics.totalContributions")}</span>
              <span className="font-medium text-green-800">{analyticsData.totalContributions || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">{ta("analytics.uniqueContributors")}</span>
              <span className="font-medium text-green-800">{analyticsData.uniqueContributors || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">{ta("analytics.recurringContributors")}</span>
              <span className="font-medium text-green-800">{analyticsData.recurringContributors || 0}</span>
            </div>
          </CardContent>
        </Card>
          <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <CardTitle className="text-base text-green-800">{ta("analytics.contributionAnalysis")}</CardTitle>
            <CardDescription>{ta("analytics.contributionAnalysisDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex justify-between">
              <span className="text-green-700">{ta("analytics.averageContribution")}</span><span className="font-medium text-green-800">
                {formatCurrency(analyticsData.averageContributionAmount)}
              </span>
            </div>            <div className="flex justify-between">
              <span className="text-green-700">{ta("analytics.retentionRate")}</span>
              <span className="font-medium text-green-800">
                {analyticsData.uniqueContributors > 0 
                  ? Math.round((analyticsData.recurringContributors / analyticsData.uniqueContributors) * 100)
                  : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
          <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <CardTitle className="text-base text-green-800">{ta("analytics.topEvents")}</CardTitle>
            <CardDescription>{ta("analytics.topEventsDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {analyticsData.contributionsByEvent && Object.entries(analyticsData.contributionsByEvent).slice(0, 3).map(([eventName, amount]) => (
                <div key={eventName} className="p-2 bg-green-50 rounded-md border border-green-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-800">{eventName}</span>                    <span className="text-sm text-green-600">
                      {formatCurrency(Number(amount))}
                    </span>
                  </div>
                </div>
              ))}
                {(!analyticsData.contributionsByEvent || Object.keys(analyticsData.contributionsByEvent).length === 0) && (
                <div className="text-center text-gray-500 p-2">
                  {ta("analytics.noFundraisingEvents")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Prepare the data for ReportStats
    const prepareReportData = () => {
      if (!hasRealData) return safeSampleData;
      
      // Ensure all required chart data properties exist based on report type
      const safeData = {
        ...analyticsData // Real data
      };
        // Add default empty arrays for chart data based on report type
      if (reportType === 'orphans') {
        safeData.demographics = safeData.demographics || [];
        safeData.ageGroups = safeData.ageGroups || [];
        safeData.statusDistribution = safeData.statusDistribution || [];
        safeData.branchDistribution = safeData.branchDistribution || [];
      } else if (reportType === 'inventory') {
        safeData.categories = safeData.categories || [];
        safeData.stockStatus = safeData.stockStatus || [];
        safeData.transactions = safeData.transactions || [];
      } else if (reportType === 'staff') {
        safeData.departments = safeData.departments || [];
        safeData.status = safeData.status || [];
        safeData.roles = safeData.roles || [];      
      } else if (reportType === 'fundraising') {
        safeData.amounts = safeData.amounts || [];
        safeData.status = safeData.status || [];
        safeData.timeline = safeData.timeline || [];      
      } else if (reportType === 'volunteers') {
        safeData.skills = safeData.skills || [];
        safeData.status = safeData.status || [];
        safeData.hoursByMonth = safeData.hoursByMonth || [];
        safeData.branchDistribution = safeData.branchDistribution || [];
      }
      
      return safeData;
    };
    
    return (
    <>
      {renderMetadata()}
      
      <ReportStats 
        data={prepareReportData()} 
        type={reportType}
      />
      
      {renderBranchStats()}
      
      {hasRealData && reportType === 'orphans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">          <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <CardTitle className="text-base text-green-800">{ta("analytics.orphanSummary")}</CardTitle>
              <CardDescription>{ta("analytics.summaryDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex justify-between">
                <span className="text-green-700">{ta("analytics.totalOrphans")}</span>
                <span className="font-medium text-green-800">{analyticsData.totalOrphans}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">{ta("analytics.activeOrphans")}</span>
                <span className="font-medium text-green-800">{analyticsData.totalActivated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">{ta("analytics.inactiveOrphans")}</span>
                <span className="font-medium text-green-800">{analyticsData.totalDeactivated}</span>
              </div>
            </CardContent>
          </Card>
            <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2">
            <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <CardTitle className="text-base text-green-800">{ta("analytics.branchDistribution")}</CardTitle>
              <CardDescription>{ta("analytics.branchDistributionDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">                {analyticsData.branchDistribution?.map((branch: any) => {
                  // Calculate the percentage and round to nearest 10
                  const percentage = Math.round((branch.value / analyticsData.totalOrphans) * 100 / 10) * 10;
                  const widthClass = `width${percentage}`;
                  
                  return (
                    <div key={branch.name} className="flex items-center">
                      <div className={styles.barContainer}>
                        <div className={`${styles.barFill} ${styles[widthClass]}`}></div>
                      </div>
                      <div className="flex justify-between items-center w-32">
                        <span className="text-sm">{branch.name}</span>
                        <span className="text-sm font-medium">{branch.value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
        {reportType === 'inventory' && renderInventorySummary()}      {reportType === 'staff' && (
        <>
          {renderAdminSummary()}          {renderAdminList()}
        </>
      )}
      {reportType === 'fundraising' && renderFundraisingSummary()}      {reportType === 'volunteers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">          <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <CardTitle className="text-base text-green-800">{ta("analytics.volunteerSummary")}</CardTitle>
              <CardDescription>{ta("analytics.volunteerSummaryDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex justify-between">
                <span className="text-green-700">{ta("analytics.totalVolunteers")}</span>
                <span className="font-medium text-green-800">{analyticsData.totalVolunteers ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">{ta("analytics.activeVolunteers")}</span>
                <span className="font-medium text-green-800">{analyticsData.activeVolunteers ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">{ta("analytics.pendingVolunteers")}</span>
                <span className="font-medium text-green-800">{analyticsData.pendingVolunteers ?? 0}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">              <CardTitle className="text-base text-green-800">{ta("analytics.volunteersBySkill")}</CardTitle>
              <CardDescription>{ta("analytics.volunteersBySkillDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {analyticsData.volunteersByJobRole && Object.entries(analyticsData.volunteersByJobRole).map(([skill, count]) => (
                <div key={skill} className="flex justify-between">
                  <span className="text-green-700">{skill}</span>
                  <span className="font-medium text-green-800">{Number(count)}</span>
                </div>
              ))}
              {(!analyticsData.volunteersByJobRole || Object.keys(analyticsData.volunteersByJobRole).length === 0) && (                <div className="text-center text-gray-500">
                  {ta("analytics.noVolunteerSkills")}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">              <CardTitle className="text-base text-green-800">{ta("analytics.volunteersByBranch")}</CardTitle>
              <CardDescription>{ta("analytics.volunteersByBranchDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {analyticsData.volunteersByBranch && Object.entries(analyticsData.volunteersByBranch).map(([branch, count]) => (
                <div key={branch} className="flex justify-between">
                  <span className="text-green-700">{branch}</span>
                  <span className="font-medium text-green-800">{Number(count)}</span>
                </div>
              ))}
              {(!analyticsData.volunteersByBranch || Object.keys(analyticsData.volunteersByBranch).length === 0) && (                <div className="text-center text-gray-500">
                  {ta("analytics.noVolunteerBranches")}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
