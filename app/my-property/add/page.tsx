"use client"

import { useAppSelector } from "@/hooks/useReduxHooks"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import FormNavigation from "@/components/property-form/form-navigation"
import ProgressSteps from "@/components/property-form/progress-steps"
import CategorySelection from "@/components/property-form/category-selection"
import SubcategorySelection from "@/components/property-form/subcategory-selection"
import TitleInput from "@/components/property-form/title-input"
// import UnitsForm from "@/components/property-form/units-form"
import LocationForm from "@/components/property-form/location-form"
import ImageUpload from "@/components/property-form/image-upload"
import Preview from "@/components/property-form/preview"
import dynamic from "next/dynamic";



const UnitsForm = dynamic(() => import("@/components/property-form/units-form"), {
  ssr: false,
});

export default function AddPropertyPage() {
  const { step } = useAppSelector((state) => state.property)

  // Determine which form component to render based on the current step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <CategorySelection />
      case 1.5:
        return <SubcategorySelection />
      case 2:
        return <TitleInput />
      case 3:
        return <UnitsForm />
      case 4:
        return <LocationForm />
      case 5:
        return <ImageUpload />
      case 6:
        return <Preview />
      default:
        return <CategorySelection />
    }
  }

  return (

    <main className="pt- px-4 pb-20">
         <FormNavigation />
    <div className="bg-[#F8F8F8] rounded-lg pt-10 pb-[10rem] shadow-sm">
   
      {/* <ProgressSteps /> */}

      {step !== 6 && <ProgressSteps />}
      {renderStepContent()}

      {/* {renderStepContent()} */}
    </div>
  </main>

  )
}

