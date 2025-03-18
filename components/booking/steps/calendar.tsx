"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

import {
  addDays,
  startOfDay,
  // eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfMonth,
  startOfToday,
  isWithinRange,
  isBefore,
} from "date-fns"

interface CalendarProps {
  type: "one-time" | "multiple-day"
  onSelect: (date: string) => void
  onRangeSelect: (range: { start: string; end: string }) => void
  selectedDate?: string
  dateRange?: { start: string; end: string }
}

function eachDayOfIntervalCustom({ start, end }: { start: Date; end: Date }) {
  const dates = [];
  let currentDate = startOfDay(start);
  const endDate = startOfDay(end);

  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }

  return dates;
}


export default function Calendar({ type, onSelect, onRangeSelect, selectedDate, dateRange }: CalendarProps) {
  const today = startOfToday()
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"))
  // const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())
  const firstDayCurrentMonth = parse(currentMonth)
  const [rangeStart, setRangeStart] = useState<Date | null>(dateRange?.start ? new Date(dateRange.start) : null)

  const days = eachDayOfIntervalCustom({
    start: startOfMonth(firstDayCurrentMonth),
    end: endOfMonth(firstDayCurrentMonth),
  })

  const previousMonth = () => {
    const firstDayNextMonth = addDays(firstDayCurrentMonth, -1)
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  const nextMonth = () => {
    const firstDayNextMonth = addDays(firstDayCurrentMonth, 1)
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  const handleDateClick = (day: Date) => {
    if (type === "one-time") {
      onSelect(format(day, "yyyy-MM-dd"))
    } else {
      if (!rangeStart) {
        setRangeStart(day)
        onRangeSelect({ start: format(day, "yyyy-MM-dd"), end: format(day, "yyyy-MM-dd") })
      } else {
        const start = isBefore(rangeStart, day) ? rangeStart : day
        const end = isBefore(rangeStart, day) ? day : rangeStart
        onRangeSelect({ start: format(start, "yyyy-MM-dd"), end: format(end, "yyyy-MM-dd") })
        setRangeStart(null)
      }
    }
  }

  const isInRange = (day: Date) => {
    if (!dateRange) return false
    const start = new Date(dateRange.start)
    const end = new Date(dateRange.end)
    return isWithinRange(day, start, end)
  }

  const isRangeStart = (day: Date) => dateRange?.start && isEqual(day, new Date(dateRange.start))
  const isRangeEnd = (day: Date) => dateRange?.end && isEqual(day, new Date(dateRange.end))

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">{format(firstDayCurrentMonth, "MMMM yyyy")}</h2>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs leading-6 text-center text-gray-500 mb-2">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day: Date, dayIdx: number) => {
          const isSelected: boolean = selectedDate ? isEqual(day, new Date(selectedDate)) : false

          return (
            <div
              key={day.toString()}
              className={`
          ${dayIdx === 0 ? colStartClasses[getDay(day)] : ""}
          p-0.5
              `}
            >
              <button
          onClick={() => handleDateClick(day)}
          className={`
            w-full aspect-square flex items-center justify-center text-sm rounded-full
            hover:bg-gray-100 relative
            ${!isSameMonth(day, firstDayCurrentMonth) ? "text-gray-300" : ""}
            ${isToday(day) ? "font-bold" : ""}
            ${isSelected ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
            ${isInRange(day) ? "bg-blue-50" : ""}
            ${isRangeStart(day) ? "bg-blue-500 text-white rounded-l-full" : ""}
            ${isRangeEnd(day) ? "bg-blue-500 text-white rounded-r-full" : ""}
          `}
              >
          {format(day, "d")}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const colStartClasses = ["", "col-start-2", "col-start-3", "col-start-4", "col-start-5", "col-start-6", "col-start-7"]