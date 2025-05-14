"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface AddCleanerModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export default function AddCleanerModal({ isOpen, onClose, onSubmit }: AddCleanerModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    addressLine: "",
    state: "",
    city: "",
    zip: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Add New Cleaner</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Placeholder text"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Placeholder text"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="flex">
              <div className="flex items-center border rounded-l-md px-3 bg-gray-50">
                <span className="flex items-center">
                  <span className="flag-icon">🇺🇸</span>
                  <span className="ml-2">+1</span>
                </span>
              </div>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="000 000 000"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 border border-l-0 rounded-r-md focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Placeholder text"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="addressLine" className="block text-sm font-medium text-gray-700 mb-1">
              Address Line
            </label>
            <input
              type="text"
              id="addressLine"
              name="addressLine"
              placeholder="Placeholder text"
              value={formData.addressLine}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              placeholder="Placeholder text"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="Placeholder text"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                Zip
              </label>
              <input
                type="text"
                id="zip"
                name="zip"
                placeholder="Placeholder text"
                value={formData.zip}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              Onboard
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
