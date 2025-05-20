"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { fetchCleaners, type Cleaner } from "../lib/services/cleanerService"
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { ClipboardX } from "lucide-react"

interface CleanerGridProps {
  activeTab: "verified" | "pending"
  searchQuery: string
}

export default function CleanerGrid({ activeTab, searchQuery }: CleanerGridProps) {
  const [cleaners, setCleaners] = useState<Cleaner[]>([])
  const [filteredCleaners, setFilteredCleaners] = useState<Cleaner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { token, user } = useAppSelector((state) => state.auth)


  useEffect(() => {
    const getCleaners = async () => {
      if (!token || !user?._id) {
        setError("Authentication required")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const businessId = user._id
        const businessData = await fetchCleaners(businessId, token)

        if (businessData && businessData.cleaners) {
          setCleaners(businessData.cleaners)
        } else {
          setCleaners([])
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch cleaners")
        setCleaners([])
      } finally {
        setIsLoading(false)
      }
    }

    getCleaners()
  }, [token, user])

  // Filter cleaners based on active tab and search query
  useEffect(() => {
    if (cleaners.length === 0) {
      setFilteredCleaners([])
      return
    }

    let filtered = [...cleaners]

    // Filter based on tab
    if (activeTab === "verified") {
      filtered = filtered.filter(
        (cleaner) => cleaner.availability === true && cleaner.identityVerified === true && cleaner.tasks.length === 0,
      )
    } else if (activeTab === "pending") {
      filtered = filtered.filter((cleaner) => cleaner.identityVerified === false)
    }

    // Filter based on search query
    if (searchQuery) {
      filtered = filtered.filter(
        (cleaner) =>
          cleaner.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cleaner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cleaner.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredCleaners(filtered)
  }, [cleaners, activeTab, searchQuery])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  if (filteredCleaners.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ClipboardX className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">No cleaners found</h3>
        <p className="text-gray-500 max-w-md">
          {activeTab === "verified"
            ? "There are no verified cleaners available at the moment."
            : "There are no pending cleaners at the moment."}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredCleaners.map((cleaner) => (
        <Link key={cleaner._id} href={`/cleaners/${cleaner._id}`} className="block">
          <div className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl font-medium text-gray-600">{cleaner.fullName.charAt(0).toUpperCase()}</span>
              </div>
              <h3 className="font-medium text-center">{cleaner.fullName}</h3>
              <p className="text-gray-500 text-sm text-center">{cleaner.role}</p>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium truncate max-w-[150px]">{cleaner.email}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium">{cleaner.phoneNumber}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-500">Status:</span>
                  <span className={`font-medium ${cleaner.identityVerified ? "text-green-600" : "text-amber-600"}`}>
                    {cleaner.identityVerified ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
