// This is a temporary helper script to collect and organize all the translations that need to be updated

/**
 * Tooltip formatters to update
 * 
 * 1. Basic format:
 * <Tooltip formatter={(value) => [`${value} ${t("report.orphansCount")}`, t("report.count")]} />
 * 
 * Change to:
 * <Tooltip formatter={(value) => [`${value} ${ta("analytics.orphansCount")}`, ta("analytics.count")]} />
 * 
 * 2. Currency format:
 * <Tooltip formatter={(value) => [formatCurrency(value as number), t("report.fundraising.amount")]} />
 * 
 * Change to:
 * <Tooltip formatter={(value) => [formatCurrency(value as number), ta("analytics.fundraising.amount")]} />
 * 
 * 3. Items format:
 * <Tooltip formatter={(value) => [`${value} ${t("report.inventory.items")}`, t("report.count")]} />
 * 
 * Change to:
 * <Tooltip formatter={(value) => [`${value} ${ta("analytics.inventory.items")}`, ta("analytics.count")]} />
 * 
 * 4. Staff format:
 * <Tooltip formatter={(value) => [`${value} ${t("dashboard.staff")}`, t("report.count")]} />
 * 
 * Change to:
 * <Tooltip formatter={(value) => [`${value} ${ta("analytics.staff")}`, ta("analytics.count")]} />
 */

// List of translations to update:
const translationsToUpdate = [
  {
    old: 't("report.orphansCount")',
    new: 'ta("analytics.orphansCount")'
  },
  {
    old: 't("report.count")',
    new: 'ta("analytics.count")'
  },
  {
    old: 't("report.inventory.items")',
    new: 'ta("analytics.inventory.items")'
  },
  {
    old: 't("report.inventory.transactions")',
    new: 'ta("analytics.inventory.transactions")'
  },
  {
    old: 't("report.fundraising.amount")',
    new: 'ta("analytics.fundraising.amount")'
  },
  {
    old: 't("report.fundraising.campaigns")',
    new: 'ta("analytics.fundraising.campaigns")'
  },
  {
    old: 't("report.volunteers.count")',
    new: 'ta("analytics.volunteers.count")'
  },
  {
    old: 't("report.volunteers.volunteerHours")',
    new: 'ta("analytics.volunteers.volunteerHours")'
  },
  {
    old: 't("dashboard.staff")',
    new: 'ta("analytics.staff")'
  }
];
