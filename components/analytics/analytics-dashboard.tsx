"use client"

import { useState } from "react"
import { ArrowUpIcon, CopyIcon, BarChart4Icon, CircleDotIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ResponsiveBarChart from "./responsive-bar-chart"

export default function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState("This Week")
  const [chartTimeframe, setChartTimeframe] = useState("This Month")


  const chartData = [
    { month: "Jan", value: 20000 },
    { month: "Feb", value: 30000 },
    { month: "Mar", value: 17000 },
    { month: "Apr", value: 25000 },
    { month: "May", value: 17000 },
    { month: "Jun", value: 25000 },
    { month: "Jul", value: 30000 },
    { month: "Aug", value: 35000 },
    { month: "Sep", value: 35000 },
    { month: "Oct", value: 28000 },
    { month: "Nov", value: 40000 },
  ]

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[140px] bg-white border">
            <SelectValue placeholder="This Week" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Today">Today</SelectItem>
            <SelectItem value="This Week">This Week</SelectItem>
            <SelectItem value="This Month">This Month</SelectItem>
            <SelectItem value="This Year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bookings Card */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
              <h3 className="text-2xl sm:text-3xl font-bold">137,789</h3>
            </div>
            <Button variant="ghost" size="icon">
              <CopyIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Bookings</p>
              <p className="text-lg sm:text-xl font-semibold">100,000</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending Bookings</p>
              <p className="text-lg sm:text-xl font-semibold">20,000</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Cancelled Bookings</p>
              <p className="text-lg sm:text-xl font-semibold">17,789</p>
            </div>
          </div>

          <div className="flex items-center mt-4">
            <div className="flex items-center text-green-500 mr-4">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">21.9%</span>
            </div>
            <div className="text-gray-400 text-sm">
              <span className="mr-1">+56</span>
              <span>This Week</span>
            </div>
          </div>
        </div>

        {/* Payments Card */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Payments</p>
              <h3 className="text-2xl sm:text-3xl font-bold">$37,789</h3>
            </div>
            <Button variant="ghost" size="icon">
              <BarChart4Icon className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Completed Payments</p>
              <p className="text-lg sm:text-xl font-semibold">$30,000</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending Payments</p>
              <p className="text-lg sm:text-xl font-semibold">$7,000</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Cancelled Payments</p>
              <p className="text-lg sm:text-xl font-semibold">$789</p>
            </div>
          </div>

          <div className="flex items-center mt-4">
            <div className="flex items-center text-green-500 mr-4">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">21.9%</span>
            </div>
            <div className="text-gray-400 text-sm">
              <span className="mr-1">+$560</span>
              <span>This Week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3 bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
            <div>
              <div className="uppercase text-xs font-medium text-gray-500 tracking-wider mb-1">TOTAL AMOUNT SPENT</div>
              <div className="flex flex-wrap items-center">
                <h3 className="text-2xl sm:text-3xl font-bold mr-2">$650,102.64</h3>
                <span className="text-green-500 text-sm whitespace-nowrap">(+43%) than last year</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center">
                <CircleDotIcon className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Transactions</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={chartTimeframe} onValueChange={setChartTimeframe}>
                  <SelectTrigger className="w-[140px] bg-white border">
                    <SelectValue placeholder="This Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="This Week">This Week</SelectItem>
                    <SelectItem value="This Month">This Month</SelectItem>
                    <SelectItem value="This Quarter">This Quarter</SelectItem>
                    <SelectItem value="This Year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-blue-600 hover:bg-blue-700">Export</Button>
              </div>
            </div>
          </div>

          <div className="mt-8 mb-4">
            {/* Increased chart height from 240 to 350 */}
            <ResponsiveBarChart data={chartData} height={350} />
          </div>

          <div className="mt-6">
            <div className="uppercase text-xs font-medium text-gray-500 tracking-wider mb-1">
              AVERAGE TRANSACTIONS PER BOOKINGS
            </div>
            <div className="flex items-center">
              <h3 className="text-2xl font-bold mr-2">$150</h3>
              <span className="text-green-500 text-sm">(+43%) than last year</span>
            </div>
          </div>
        </div>

        {/* Property Stats */}
        <div className="lg:col-span-1 grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Number Of Property(s)</p>
                <h3 className="text-3xl font-bold">137</h3>
              </div>
              <Button variant="ghost" size="icon">
                <CopyIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Property(s)</p>
                <h3 className="text-3xl font-bold">100</h3>
              </div>
              <Button variant="ghost" size="icon">
                <CopyIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending Property(s)</p>
                <h3 className="text-3xl font-bold">37</h3>
              </div>
              <Button variant="ghost" size="icon">
                <CopyIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

