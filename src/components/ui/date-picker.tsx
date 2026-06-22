"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03Icon, ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  value?: string // YYYY-MM-DD
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Parse initial date
  const parsedDate = value ? new Date(value) : null
  const [currentYear, setCurrentYear] = useState(parsedDate ? parsedDate.getFullYear() : new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(parsedDate ? parsedDate.getMonth() : new Date().getMonth())

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Sync state if value changes externally
  useEffect(() => {
    if (value) {
      const d = new Date(value)
      if (!isNaN(d.getTime())) {
        setCurrentYear(d.getFullYear())
        setCurrentMonth(d.getMonth())
      }
    }
  }, [value])

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay()
    // Align Sunday = 6, Monday = 0, etc.
    return day === 0 ? 6 : day - 1
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(prev => prev - 1)
    } else {
      setCurrentMonth(prev => prev - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(prev => prev + 1)
    } else {
      setCurrentMonth(prev => prev + 1)
    }
  }

  const handleDateSelect = (day: number) => {
    // Build the date in UTC so the displayed day does not drift when serialized.
    const selected = new Date(Date.UTC(currentYear, currentMonth, day))
    const formatted = selected.toISOString().split("T")[0]
    onChange?.(formatted)
    setIsOpen(false)
  }

  // Format date for display: "May 17, 2026"
  const getDisplayValue = () => {
    if (!value) return ""
    const d = new Date(value)
    if (isNaN(d.getTime())) return ""
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  // Generate days array
  const totalDays = getDaysInMonth(currentMonth, currentYear)
  const firstDayIndex = getFirstDayOfMonth(currentMonth, currentYear)
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1)
  const paddingArray = Array.from({ length: firstDayIndex }, (_, i) => i)

  // Generate Year options for clinical DOB use case (e.g. past 100 years to current)
  const yearsRange = Array.from({ length: 120 }, (_, i) => new Date().getFullYear() - i)

  return (
    <div className="relative w-full" ref={containerRef}>
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full justify-start text-left font-normal border-border bg-background hover:bg-muted/40",
          !value && "text-muted-foreground",
          className
        )}
      >
        <HugeiconsIcon icon={Calendar03Icon} className="mr-2 h-4 w-4 text-muted-foreground" />
        {getDisplayValue() || placeholder}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-80 rounded-2xl border border-border bg-card p-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
          {/* Header selectors */}
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5">
              {/* Month Selector */}
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                className="bg-transparent font-bold text-sm text-foreground focus:outline-none cursor-pointer border border-transparent hover:border-border rounded px-1 py-0.5"
              >
                {MONTHS.map((name, idx) => (
                  <option key={name} value={idx} className="bg-card text-foreground">{name}</option>
                ))}
              </select>
              {/* Year Selector */}
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                className="bg-transparent font-bold text-sm text-foreground focus:outline-none cursor-pointer border border-transparent hover:border-border rounded px-1 py-0.5"
              >
                {yearsRange.map(yr => (
                  <option key={yr} value={yr} className="bg-card text-foreground">{yr}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {paddingArray.map(p => (
              <div key={`pad-${p}`} className="h-8 w-8" />
            ))}
            {daysArray.map(day => {
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              const isSelected = value === dateStr
              const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString()

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  className={cn(
                    "h-8 w-8 rounded-lg text-xs font-medium flex items-center justify-center transition-all",
                    "hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400",
                    isSelected && "bg-emerald-600 hover:bg-emerald-600 text-white font-bold shadow-sm",
                    isToday && !isSelected && "border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold"
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
