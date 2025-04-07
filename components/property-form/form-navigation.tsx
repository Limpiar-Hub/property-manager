"use client"

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks"  
import { setStep } from "@/redux/features/addProperty/propertySlice"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { openModalFunc, closeModalFunc } from "@/redux/features/addProperty/propertySlice"
import { setIsLoaing, setError, resetProperty } from "@/redux/features/addProperty/propertySlice"
import { cn } from "@/lib/utils"
import { jwtDecode } from "jwt-decode";
import { useImageContext } from "../imageFileProvider"
import { useState } from "react"
import { boolean } from "zod"

export default function FormNavigation() {
  const dispatch = useAppDispatch()
  const { openModal } = useAppSelector((state) => state.property)
  const { imageFiles, removeFile } = useImageContext();

  
  const router = useRouter()
  const { step, category, subCategory, title, location, images } = useAppSelector((state) => state.property)
  const { token, user, loading } = useAppSelector((state) => state.auth);
  
  // const unit = useAppSelector((state) => state.property)

  const handleBack = () => {
    if (step === 1) {
      router.push("/my-property")
    } else if (step === 1.5) {
      dispatch(setStep(1))
    } else if (step === 2) {
      dispatch(setStep(1.5))
    } else {
      dispatch(setStep(step - 1))
    }
  }

  const handleNext = () => {
    if (step === 1) {
      dispatch(setStep(1.5)) // Go from category to subcategory
    } else if (step === 1.5) {
      dispatch(setStep(2)) // Go from subcategory to title
    } else {
      dispatch(setStep(step + 1)) // Handle other steps
    }
  }


  let User: any
  if (token) {
        const decoded = jwtDecode(token);
        User = decoded;
  }

  const handleSubmit = async () => {
    dispatch(openModalFunc());
    dispatch(setIsLoaing(true));

    const sampleFile = new File(["sample content"], "image.jpg", { type: "image/jpeg" });
    const formData = new FormData();
    imageFiles.forEach((image: any) => {
      if (image) {
        formData.append(`pictures`, image);
      }
    });
    formData.append("pictures", sampleFile);
    formData.append("name", title); 
    formData.append("type", category ?? '');
    formData.append("subType", subCategory ?? '');
    formData.append("size", "150 fts");
    formData.append("propertyManagerId", User.userId);
    formData.append("address", location.address);

      try {
        const response = await fetch("https://limpiar-backend.onrender.com/api/properties", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Set the Bearer token
          },
          body: formData,
        })
  
        const data = await response.json();

        if(data.status === "success") {
          dispatch(setIsLoaing(false))
        }

        if (!response.ok) {
          throw new Error(data.message || "Something went wrong, please try again later.")
        }

      } catch (err: any) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setIsLoaing(false));
      }
    }

  // Determine if the Next button should be enabled
  const isNextDisabled = () => {
    if (step === 1 && !category) return true
    if (step === 1.5 && !subCategory) return true
    if (step === 2 && !title.trim()) return true
    // if (step === 3 && (!unit.units.floors && !unit.units.breakRooms && !unit.units.cafeteria && !unit.units.gym && !unit.units.lobbies && !unit.units.meetingRooms && !unit.units.officesRooms && !unit.units.restrooms && !unit.units.units)) return true
    if (step === 3 && !location.address) return true
    if (step === 4 && images.length < 4) return true

    return false
  }

  const check = () => {
        switch (step) {
          case 4:
            return <>
            <button onClick={handleNext} className="px-4 py-2 border border-gray-300 rounded-md mr-2 text-gray-700 hover:bg-gray-50">
              Preview
            </button>
            <button
              onClick={handleSubmit}
              disabled={isNextDisabled()}
              className={cn(
                "px-4 py-2 rounded-md transition-colors",
                isNextDisabled()
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600",
              )}
            >
              Publish
            </button>
          </>

          case 5:
            return <>
              <button onClick={handleBack} className="px-4 py-2 border border-gray-300 rounded-md mr-2 text-gray-700 hover:bg-gray-50">
                Exit Preview
              </button>
          </>
          default:
            return <>
              <button className="px-4 py-2 border border-gray-300 rounded-md mr-2 text-gray-700 hover:bg-gray-50">
                Save & Exit
              </button>
              <button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className={cn(
                "px-4 py-2 rounded-md transition-colors",
                isNextDisabled()
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600",
              )}
              >
                Next
              </button>
          </>
      }
    
  }

  return (
    <div className="flex justify-between items-center w-full mb-8">
      <button onClick={handleBack} className="flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft size={18} className="mr-1" />
        Back
      </button>
      <div>
        {check()}
      </div>
    </div>
  )
}

