"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateFormData, nextStep } from "../../lib/features/form/formSlice"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"

export default function BusinessInformation() {
  const dispatch = useDispatch()
  const formData = useSelector((state: any) => state.form.data)

  const [formState, setFormState] = useState({
    businessName: formData.businessName || "",
    address: formData.address || "",
    city: formData.city || "",
    state: formData.state || "",
    zipcode: formData.zipcode || "",
    website: formData.website || "",
    referralSource: formData.referralSource || "",
  })

  const [mapUrl, setMapUrl] = useState("")
  const autocompleteInputRef = useRef<HTMLInputElement>(null)

  // Initialize Google Maps Autocomplete
  useEffect(() => {
    if (!window.google) return

    const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInputRef.current!, {
      types: ["address"],
      componentRestrictions: { country: "us" }, // Restrict to US addresses
      fields: ["address_components", "formatted_address"],
    })

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (!place.address_components) return

      let address = ""
      let city = ""
      let state = ""
      let zipcode = ""

      place.address_components.forEach((component: any) => {
        const types = component.types
        if (types.includes("street_number")) {
          address = component.long_name
        }
        if (types.includes("route")) {
          address += ` ${component.long_name}`
        }
        if (types.includes("locality")) {
          city = component.long_name
        }
        if (types.includes("administrative_area_level_1")) {
          state = component.short_name
        }
        if (types.includes("postal_code")) {
          zipcode = component.long_name
        }
      })

      setFormState((prev) => ({
        ...prev,
        address: place.formatted_address || address,
        city,
        state,
        zipcode,
      }))

      const fullAddress = encodeURIComponent(`${address}, ${city}, ${state}, ${zipcode}`)
      const baseUrl = "https://www.google.com/maps/embed/v1/place"
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
      setMapUrl(`${baseUrl}?q=${fullAddress}&key=${apiKey}`)
    })

    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormState((prev) => ({ ...prev, referralSource: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(updateFormData(formState))
    dispatch(nextStep())
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-center">Sign up</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            name="businessName"
            value={formState.businessName}
            onChange={handleChange}
            placeholder="e.g., Acme Corp"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={formState.address}
            onChange={handleChange}
            placeholder="e.g., 123 Main St, New York, NY 10001"
            required
            ref={autocompleteInputRef}
          />
        </div>

        {mapUrl && (
          <div className="space-y-2">
            <Label>Map Preview</Label>
            <iframe
              src={mapUrl}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Map Preview"
              className="no-referrer-when-downgrade"
            ></iframe>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formState.city}
            onChange={handleChange}
            placeholder="e.g., New York"
            readOnly
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            value={formState.state}
            onChange={handleChange}
            placeholder="e.g., NY"
            readOnly
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipcode">Zipcode</Label>
          <Input
            id="zipcode"
            name="zipcode"
            value={formState.zipcode}
            onChange={handleChange}
            placeholder="e.g., 10001"
            readOnly
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            value={formState.website}
            onChange={handleChange}
            placeholder="e.g., www.example.com"
          />
        </div>

        <div className="space-y-2">
          <Label>Referral Source</Label>
          <p className="text-sm text-gray-500">Choose one of the options:</p>
          <RadioGroup
            value={formState.referralSource}
            onValueChange={handleRadioChange}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="facebook" id="facebook" />
              <Label htmlFor="facebook">Facebook</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="organic" id="organic" />
              <Label htmlFor="organic">Organic</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="teammember" id="teammember" />
              <Label htmlFor="teammember">Team Member</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="referral_partner" id="referral_partner" />
              <Label htmlFor="referral_partner">Referral Partner</Label>
            </div>
          </RadioGroup>
        </div>

        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
          Next
        </Button>
      </form>

      <div className="text-center text-sm">
        If you already have an account,{" "}
        <Link href="/partner/login" className="text-indigo-600 hover:underline">
          Log in
        </Link>
      </div>

      <script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        async
        defer
      ></script>
    </div>
  )
}