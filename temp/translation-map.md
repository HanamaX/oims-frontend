# Translation Replacement Map

This is a helper file to track the translation replacements needed in report-stats-new.tsx.

## Replacements to Make

| Old Translation | New Translation |
|-----------------|-----------------|
| t("report.orphansCount") | ta("analytics.orphansCount") |
| t("report.count") | ta("analytics.count") |
| t("report.inventory.categories") | ta("analytics.inventory.categories") |
| t("report.inventory.stockStatus") | ta("analytics.inventory.stockStatus") |
| t("report.inventory.transactions") | ta("analytics.inventory.transactions") |
| t("report.inventory.items") | ta("analytics.inventory.items") |
| t("report.fundraising.amounts") | ta("analytics.fundraising.amounts") |
| t("report.fundraising.status") | ta("analytics.fundraising.status") |
| t("report.fundraising.timeline") | ta("analytics.fundraising.timeline") |
| t("report.fundraising.campaigns") | ta("analytics.fundraising.campaigns") |
| t("report.volunteers.status") | ta("analytics.volunteers.status") |
| t("report.volunteers.skills") | ta("analytics.volunteers.skills") |
| t("report.volunteers.volunteerHours") | ta("analytics.volunteers.volunteerHours") |
| t("report.volunteers.count") | ta("analytics.volunteers.count") |
| t("report.staff.departments") | ta("analytics.staff.departments") |
| t("report.staff.status") | ta("analytics.staff.status") |
| t("report.staff.roles") | ta("analytics.staff.roles") |

## Implementation Plan

1. Update all tooltip formatters
2. Update all tab triggers
3. Update any remaining labels and values
