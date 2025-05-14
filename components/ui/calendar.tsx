"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

// Icon components defined outside of the main component
const IconLeft = () => <ChevronLeft className="h-4 w-4" />
const IconRight = () => <ChevronRight className="h-4 w-4" />

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  // Create a state to store selected month/year
  const [month, setMonth] = React.useState<Date | undefined>(
    props.selected instanceof Date ? props.selected : props.defaultMonth ?? new Date()
  )
  
  // Handle month change from the DayPicker
  React.useEffect(() => {
    if (props.selected instanceof Date) {
      setMonth(props.selected)
    } else if (props.defaultMonth) {
      setMonth(props.defaultMonth)
    }
  }, [props.selected, props.defaultMonth])
  
  // Generate years for the dropdown (10 years before and after current year)
  const currentYear = month?.getFullYear() ?? new Date().getFullYear()
  const years = React.useMemo(() => {
    return Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)
  }, [currentYear])
  
  // Handle year selection
  const handleYearChange = (year: string) => {
    if (!month) return
    
    const newDate = new Date(month)
    newDate.setFullYear(parseInt(year))
    setMonth(newDate)
    
    // If onMonthChange is provided, call it
    if (props.onMonthChange) {
      props.onMonthChange(newDate)
    }
  }
  
  // Create year selection items outside of the render function
  const yearItems = years.map((year) => (
    <SelectItem key={year} value={year.toString()} className="text-xs">
      {year}
    </SelectItem>
  ))

  return (
    <div className="relative">
      <DayPicker
        month={month}
        onMonthChange={setMonth}
        showOutsideDays={showOutsideDays}
        className={cn("p-3 bg-white", className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4 ",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium hidden", /* Hide default month/year display */
          nav: "space-x-1 flex items-center mb-2",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 mt-4 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1 ",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex pt-3 ",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft,
          IconRight,
        }}
        {...props}
      />
      
      {/* Custom month/year selector */}
      <div className="absolute top-[10px] inset-x-0 flex justify-center items-center pointer-events-none z-10">
        <div className="flex items-center gap-1 pointer-events-auto">
          <span className="text-sm font-medium">
            {month ? format(month, "MMMM") : format(new Date(), "MMMM")}
          </span>
          <Select 
            value={currentYear.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="h-7 w-[4.5rem] text-xs border-none bg-transparent">
              <SelectValue placeholder={currentYear.toString()} />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {yearItems}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
