# Analytics Translations System

This directory contains translations specific to the analytics and reporting sections of the application.

## How to Use

1. Import the analytics translations hook in your component:

```tsx
import { useAnalyticsTranslations } from '@/hooks/use-analytics-translations'
```

2. Use the hook to get the translation function:

```tsx
const { t: ta } = useAnalyticsTranslations()
```

3. Use the translation function with the appropriate key:

```tsx
<span>{ta("analytics.loading")}</span>
```

## Why a Separate Translations System?

The analytics and reporting sections have many specific translation needs that are only used in those parts of the application. By keeping these translations separate, we:

1. Keep the main translation context smaller and more manageable
2. Make it easier to add new analytics-specific translations
3. Provide better organization for the translations
4. Avoid potential key conflicts with the main translation system

## Migrated Components

The following components have been migrated to use the new analytics translation system:

1. `system-analytics.tsx` - All summary cards and analytics-specific UI elements
2. `report-stats-new.tsx` - All chart labels, tooltips, and data point translations
3. `report-generator-new.tsx` - Report generation UI and options

## Migration from Previous System

If you're migrating from the previous translation system (using the main LanguageContext), refer to the `migration-helper.tsx` file for a mapping of old translation keys to new ones.

## Adding New Translations

To add new analytics-specific translations:

1. Open `index.ts` in this directory
2. Add your new translation keys and values
3. Use them in your components with the `ta()` function

## Example

```tsx
// In your component
import { useAnalyticsTranslations } from '@/hooks/use-analytics-translations'

export default function AnalyticsComponent() {
  const { t: ta } = useAnalyticsTranslations()
  
  return (
    <div>
      <h2>{ta("analytics.title")}</h2>
      <p>{ta("analytics.loading")}</p>
    </div>
  )
}
```

## Formatting Guidelines

- For section titles, use the pattern: `analytics.[section]` (e.g., `analytics.orphanSummary`)
- For descriptions, use the pattern: `analytics.[section]Desc` (e.g., `analytics.orphanSummaryDesc`) 
- For status values, use the direct key: `analytics.active`, `analytics.inactive`, etc.
- For count labels, use the pattern: `analytics.[type].count` (e.g., `analytics.volunteers.count`)
- For section-specific items, use the pattern: `analytics.[section].[item]` (e.g., `analytics.inventory.items`)
