"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateFormData, nextStep, prevStep } from "../..//lib/features/form/formSlice"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

export default function ContactInformation() {
  const dispatch = useDispatch()
  const formData = useSelector((state: any) => state.form.data)
  const [showPassword, setShowPassword] = useState(false)

  const [formState, setFormState] = useState({
    fullName: formData.fullName || "",
    email: formData.email || "",
    phoneNumber: formData.phoneNumber || "",
    countryCode: formData.countryCode || "us",
    password: formData.password || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(updateFormData(formState))
    dispatch(nextStep())
  }

  const handleBack = () => {
    dispatch(updateFormData(formState))
    dispatch(prevStep())
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <button type="button" onClick={handleBack} className="flex items-center text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
      </div>

      <h1 className="text-3xl font-semibold text-center">Sign up</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formState.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formState.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <div className="flex">
            <div className="w-20 mr-2">
              <Select value={formState.countryCode} onValueChange={(value) => handleSelectChange("countryCode", value)}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <span className="text-sm">🇺🇸</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">🇺🇸 +1</SelectItem>
                  <SelectItem value="ca">🇨🇦 +1</SelectItem>
                  <SelectItem value="mx">🇲🇽 +52</SelectItem>
                  <SelectItem value="uk">🇬🇧 +44</SelectItem>
                  <SelectItem value="ng">🇳🇬 +234</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formState.phoneNumber}
              onChange={handleChange}
              placeholder="+1 000 000 000"
              className="flex-1"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
          Next
        </Button>
      </form>

      <div className="text-center text-sm">
        If you already have an account{" "}
        <Link href="/login" className="text-indigo-600 hover:underline">
          Log in
        </Link>
      </div>
    </div>
  )
}
