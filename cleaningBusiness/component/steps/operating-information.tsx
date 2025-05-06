"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  updateFormData,
  nextStep,
  prevStep,
  setRegistrationStatus,
  setRegistrationError,
} from "../../lib/features/form/formSlice"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { registerBusiness } from "../../lib/api"

export default function OperatingInformation() {
  const dispatch = useDispatch()
  const formData = useSelector((state: any) => state.form.data)
  const registrationStatus = useSelector((state: any) => state.form.data.registrationStatus)

  const [formState, setFormState] = useState({
    teamMembers: formData.teamMembers || "",
    operatingCity: formData.operatingCity || "",
    services: formData.services || [],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (service: string, checked: boolean) => {
    setFormState((prev) => {
      const services = [...prev.services]
      if (checked) {
        if (!services.includes(service)) {
          services.push(service)
        }
      } else {
        const index = services.indexOf(service)
        if (index !== -1) {
          services.splice(index, 1)
        }
      }
      return { ...prev, services }
    })
  }

  const handleBack = () => {
    dispatch(updateFormData(formState))
    dispatch(prevStep())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Update form data with current state
    dispatch(updateFormData(formState))

    // Prepare data for API
    const allFormData = {
      ...formData,
      ...formState,
    }

    // Map form data to API expected format
    const apiData = {
      businessName: allFormData.businessName,
      address: allFormData.address,
      city: allFormData.city,
      state: allFormData.state,
      zipCode: allFormData.zipcode,
      website: allFormData.website || "",
      referenceSource: allFormData.referralSource,
      email: allFormData.email,
      phoneNumber: getFormattedPhoneNumber(allFormData.countryCode, allFormData.phoneNumber),
      password: allFormData.password,
      howManyTeamMembersDoYouHave: allFormData.teamMembers,
      operatingCity: allFormData.operatingCity,
      servicesYouProvide: mapServiceNamesToAPI(allFormData.services),
    }

    console.log("Submitting registration data:", apiData)

    try {
      setIsSubmitting(true)
      dispatch(setRegistrationStatus("loading"))

      // Call API to register business
      await registerBusiness(apiData)

      // Update status and move to success screen
      dispatch(setRegistrationStatus("success"))
      dispatch(nextStep())
    } catch (error) {
      console.error("Registration failed:", error)
      dispatch(setRegistrationStatus("error"))
      dispatch(setRegistrationError((error as Error).message))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to format phone number based on country code
  const getFormattedPhoneNumber = (countryCode: string, phoneNumber: string) => {
    const countryCodeMap: Record<string, string> = {
      us: "+1",
      ca: "+1",
      mx: "+52",
      uk: "+44",
      ng: "+234",
    }

    // Remove any existing plus sign and country code
    let cleanNumber = phoneNumber.replace(/^\+/, "").trim()

    // If the number already starts with the country code digits, remove them
    const prefix = countryCodeMap[countryCode]?.replace("+", "")
    if (prefix && cleanNumber.startsWith(prefix)) {
      cleanNumber = cleanNumber.substring(prefix.length)
    }

    return `${countryCodeMap[countryCode] || "+1"}${cleanNumber}`
  }

  // Helper function to map service names to API expected format
  const mapServiceNamesToAPI = (services: string[]) => {
    const serviceMap: Record<string, string> = {
      carpet_cleaning: "carpet cleaning",
      hvac_duct_cleaning: "HVAC Duct Cleaning",
      floor_cleaning: "floor cleaning & polishing",
      pressure_washing: "High Pressure Washing",
      laundry: "laundry",
      evening_cleaning: "Post-Evening Cleaning",
      window_cleaning: "Window Cleaning",
    }

    return services.map((service) => serviceMap[service] || service)
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
          <Label htmlFor="teamMembers">How many team members do you have?</Label>
          <Input
            id="teamMembers"
            name="teamMembers"
            type="number"
            value={formState.teamMembers}
            onChange={handleChange}
            placeholder="0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="operatingCity">Operating City</Label>
          <Select value={formState.operatingCity} onValueChange={(value) => handleSelectChange("operatingCity", value)}>
            <SelectTrigger>
              <SelectValue placeholder="New York" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new_york">New York</SelectItem>
              <SelectItem value="los_angeles">Los Angeles</SelectItem>
              <SelectItem value="chicago">Chicago</SelectItem>
              <SelectItem value="houston">Houston</SelectItem>
              <SelectItem value="miami">Miami</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>What Services do you provide</Label>
          <p className="text-sm text-gray-500">Choose any of the options that apply:</p>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="carpet_cleaning"
                checked={formState.services.includes("carpet_cleaning")}
                onCheckedChange={(checked) => handleCheckboxChange("carpet_cleaning", checked as boolean)}
              />
              <Label htmlFor="carpet_cleaning">Carpet Cleaning</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hvac_duct_cleaning"
                checked={formState.services.includes("hvac_duct_cleaning")}
                onCheckedChange={(checked) => handleCheckboxChange("hvac_duct_cleaning", checked as boolean)}
              />
              <Label htmlFor="hvac_duct_cleaning">HVAC Duct Cleaning</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="floor_cleaning"
                checked={formState.services.includes("floor_cleaning")}
                onCheckedChange={(checked) => handleCheckboxChange("floor_cleaning", checked as boolean)}
              />
              <Label htmlFor="floor_cleaning">Floor Cleaning & Polishing</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pressure_washing"
                checked={formState.services.includes("pressure_washing")}
                onCheckedChange={(checked) => handleCheckboxChange("pressure_washing", checked as boolean)}
              />
              <Label htmlFor="pressure_washing">High-Pressure Washing</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="laundry"
                checked={formState.services.includes("laundry")}
                onCheckedChange={(checked) => handleCheckboxChange("laundry", checked as boolean)}
              />
              <Label htmlFor="laundry">Laundry</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="evening_cleaning"
                checked={formState.services.includes("evening_cleaning")}
                onCheckedChange={(checked) => handleCheckboxChange("evening_cleaning", checked as boolean)}
              />
              <Label htmlFor="evening_cleaning">Post-Evening Cleaning</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="window_cleaning"
                checked={formState.services.includes("window_cleaning")}
                onCheckedChange={(checked) => handleCheckboxChange("window_cleaning", checked as boolean)}
              />
              <Label htmlFor="window_cleaning">Window Cleaning</Label>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
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
