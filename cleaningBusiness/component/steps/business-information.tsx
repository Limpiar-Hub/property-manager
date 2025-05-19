"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateFormData, nextStep } from "../../lib/features/form/formSlice"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
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
            placeholder="John Doe"
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
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Select value={formState.city} onValueChange={(value) => handleSelectChange("city", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Manhattan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manhattan">Manhattan</SelectItem>
              <SelectItem value="brooklyn">Brooklyn</SelectItem>
              <SelectItem value="queens">Queens</SelectItem>
              <SelectItem value="bronx">Bronx</SelectItem>
              <SelectItem value="staten_island">Staten Island</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select value={formState.state} onValueChange={(value) => handleSelectChange("state", value)}>
            <SelectTrigger>
              <SelectValue placeholder="New York" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ny">New York</SelectItem>
              <SelectItem value="nj">New Jersey</SelectItem>
              <SelectItem value="ct">Connecticut</SelectItem>
              <SelectItem value="pa">Pennsylvania</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipcode">Zipcode</Label>
          <Input
            id="zipcode"
            name="zipcode"
            value={formState.zipcode}
            onChange={handleChange}
            placeholder="07008"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            value={formState.website}
            onChange={handleChange}
            placeholder="www.limpiar.com"
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
              <RadioGroupItem value="team_member" id="team_member" />
              <Label htmlFor="team_member">Team Member</Label>
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
        If you already have an account{" "}
        <Link href="/cleaning-business/login" className="text-indigo-600 hover:underline">
          Log in
        </Link>
      </div>
    </div>
  )
}
