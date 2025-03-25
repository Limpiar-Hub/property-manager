"use client"

import { useEffect, useState, useRef } from "react"

interface BarChartProps {
  data: { month: string; value: number }[]
  height?: number
}

export default function ResponsiveBarChart({ data, height = 300 }: BarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [, setChartWidth] = useState(0)

  useEffect(() => {
    const updateWidth = () => {
      if (chartRef.current) {
        setChartWidth(chartRef.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)

    return () => window.removeEventListener("resize", updateWidth)
  }, [])


  const maxValue = Math.max(...data.map((item) => item.value))


  const yAxisLabels = [
    { value: 0, label: "0" },
    { value: 5000, label: "5k" },
    { value: 10000, label: "10k" },
    { value: 15000, label: "15k" },
    { value: 20000, label: "20k" },
    { value: 25000, label: "25k" },
    { value: 30000, label: "30k" },
    { value: 35000, label: "35k" },
    { value: 40000, label: "40k" },
  ]

  return (
    <div className="w-full">
      <div className="flex" style={{ height: `${height}px` }}>
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between pr-2 text-xs text-gray-500">
          {yAxisLabels.map((label, index) => (
            <div key={index} className="flex items-center h-6">
              {label.label}
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div ref={chartRef} className="flex-1 relative">
          {/* Horizontal grid lines */}
          <div className="absolute inset-0">
            {yAxisLabels.map((label, index) => (
              <div
                key={index}
                className="absolute w-full border-t border-gray-100"
                style={{
                  bottom: `${(label.value / maxValue) * 100}%`,
                  height: "1px",
                }}
              />
            ))}
          </div>

    
          <div className="absolute inset-0 flex items-end">
            {data.map((item, index) => (
              <div key={index} className="flex-1 flex justify-center items-end h-full px-1">
                <div
                  className="w-[80%] bg-blue-500 rounded-t-[5rem]"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                    minHeight: item.value > 0 ? "4px" : "0px",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex mt-2 pl-8">
        {data.map((item, index) => (
          <div key={index} className="flex-1 text-center text-xs text-gray-500">
            {item.month}
          </div>
        ))}
      </div>
    </div>
  )
}

