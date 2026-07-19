"use client"

import * as React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
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
  min?: string // YYYY-MM-DD
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
  disabled,
  min
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const portalRef = useRef<HTMLDivElement>(null)

  const parsedDate = value ? new Date(value) : null
  const [currentYear, setCurrentYear] = useState(parsedDate ? parsedDate.getFullYear() : new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(parsedDate ? parsedDate.getMonth() : new Date().getMonth())

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      const clickedOutsideContainer = containerRef.current && !containerRef.current.contains(event.target as Node)
      const clickedOutsidePortal = portalRef.current && !portalRef.current.contains(event.target as Node)
      if (clickedOutsideContainer && clickedOutsidePortal) {
        setIsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay()
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
    const selected = new Date(Date.UTC(currentYear, currentMonth, day))
    const formatted = selected.toISOString().split("T")[0]
    onChange?.(formatted)
    setIsOpen(false)
  }

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

  const totalDays = getDaysInMonth(currentMonth, currentYear)
  const firstDayIndex = getFirstDayOfMonth(currentMonth, currentYear)
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1)
  const paddingArray = Array.from({ length: firstDayIndex }, (_, i) => i)
  const yearsRange = Array.from({ length: 120 }, (_, i) => new Date().getFullYear() - i)

  const toggleOpen = useCallback(() => {
    if (!disabled) {
      setIsOpen(prev => !prev)
    }
  }, [disabled])

  const renderCalendar = () => (
    <div
      className="w-80 rounded-2xl border border-border bg-card p-4 shadow-2xl"
      style={{ animation: "fadeIn 0.15s ease-out" }}
    >
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
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
            className="bg-transparent font-bold text-sm text-foreground focus:outline-none cursor-pointer border border-transparent hover:border-border rounded px-1 py-0.5"
          >
            {MONTHS.map((name, idx) => (
              <option key={name} value={idx} className="bg-card text-foreground">{name}</option>
            ))}
          </select>
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
          const isBeforeMin = min ? dateStr < min : false

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDateSelect(day)}
              disabled={isBeforeMin}
              className={cn(
                "h-8 w-8 rounded-lg text-xs font-medium flex items-center justify-center transition-all",
                "hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400",
                isSelected && "bg-emerald-600 hover:bg-emerald-600 text-white font-bold shadow-sm",
                isToday && !isSelected && "border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold",
                isBeforeMin && "opacity-30 cursor-not-allowed hover:bg-transparent hover:text-foreground"
              )}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="relative w-full" ref={containerRef}>
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={toggleOpen}
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
        <Portal>
          <div ref={portalRef} className="fixed inset-0 z-[9998]" onClick={() => setIsOpen(false)}>
            <div
              className="absolute z-[9999] animate-in fade-in zoom-in-95 duration-200"
              style={{
                top: containerRef.current?.getBoundingClientRect().bottom ?? 0,
                left: containerRef.current?.getBoundingClientRect().left ?? 0,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {renderCalendar()}
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}

function Portal({ children }: { children: React.ReactNode }) {
  if (typeof document === "undefined") return null
  return createPortal(children, document.body)
}
