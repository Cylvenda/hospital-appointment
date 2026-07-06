"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Clock01Icon } from "@hugeicons/core-free-icons"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value?: string // HH:MM (24-hour format)
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"))
const PERIODS = ["AM", "PM"]

export function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  className,
  disabled
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Parse 24h value to 12h pieces
  const parse24h = (val?: string) => {
    if (!val) return { hour: "09", minute: "00", period: "AM" }
    const [hStr, mStr] = val.split(":")
    let h = parseInt(hStr || "9")
    const m = mStr || "00"
    const period = h >= 12 ? "PM" : "AM"
    if (h > 12) h -= 12
    if (h === 0) h = 12
    
    // Find closest 5-minute interval for initial selection
    const mInt = parseInt(m)
    const closestM = String(Math.round(mInt / 5) * 5 % 60).padStart(2, "0")

    return {
      hour: String(h).padStart(2, "0"),
      minute: closestM,
      period
    }
  }

  const {
    hour: selectedHour,
    minute: selectedMinute,
    period: selectedPeriod,
  } = parse24h(value)

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Calculate 24h format on change
  const handleTimeChange = (h: string, m: string, p: string) => {
    let hour24 = parseInt(h)
    if (p === "PM" && hour24 < 12) hour24 += 12
    if (p === "AM" && hour24 === 12) hour24 = 0
    const formatted = `${String(hour24).padStart(2, "0")}:${m}`
    onChange?.(formatted)
  }

  const selectHour = (h: string) => {
    handleTimeChange(h, selectedMinute, selectedPeriod)
  }

  const selectMinute = (m: string) => {
    handleTimeChange(selectedHour, m, selectedPeriod)
  }

  const selectPeriod = (p: string) => {
    handleTimeChange(selectedHour, selectedMinute, p)
  }

  const getDisplayValue = () => {
    if (!value) return ""
    const { hour, minute, period } = parse24h(value)
    return `${hour}:${minute} ${period}`
  }

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
        <HugeiconsIcon icon={Clock01Icon} className="mr-2 h-4 w-4 text-muted-foreground" />
        {getDisplayValue() || placeholder}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-64 rounded-2xl border border-border bg-card p-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex gap-2 justify-center">
            {/* Hours Column */}
            <div className="flex flex-col gap-1 items-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Hour</span>
              <div className="h-40 overflow-y-auto w-16 scrollbar-none rounded-lg border border-border bg-muted/20 p-1 flex flex-col gap-0.5">
                {HOURS.map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => selectHour(h)}
                    className={cn(
                      "py-1 text-xs rounded font-medium transition-all text-center",
                      selectedHour === h
                        ? "bg-emerald-600 text-white font-bold"
                        : "hover:bg-emerald-500/10 text-foreground"
                    )}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes Column */}
            <div className="flex flex-col gap-1 items-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Min</span>
              <div className="h-40 overflow-y-auto w-16 scrollbar-none rounded-lg border border-border bg-muted/20 p-1 flex flex-col gap-0.5">
                {MINUTES.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => selectMinute(m)}
                    className={cn(
                      "py-1 text-xs rounded font-medium transition-all text-center",
                      selectedMinute === m
                        ? "bg-emerald-600 text-white font-bold"
                        : "hover:bg-emerald-500/10 text-foreground"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Period Column (AM/PM) */}
            <div className="flex flex-col gap-1 items-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">AM/PM</span>
              <div className="h-40 w-16 rounded-lg border border-border bg-muted/20 p-1 flex flex-col gap-1 justify-center">
                {PERIODS.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => selectPeriod(p)}
                    className={cn(
                      "py-2 text-xs rounded font-bold transition-all text-center",
                      selectedPeriod === p
                        ? "bg-emerald-600 text-white font-bold shadow-sm"
                        : "hover:bg-emerald-500/10 text-foreground"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
