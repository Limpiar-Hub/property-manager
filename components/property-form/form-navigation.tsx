"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { setStep, openModalFunc, setIsLoaing, setError } from "@/redux/features/addProperty/propertySlice";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {jwtDecode} from "jwt-decode";
import { useImageContext } from "../imageFileProvider";

export default function FormNavigation() {
  const dispatch = useAppDispatch();
  const { imageFiles } = useImageContext(); 
  const router = useRouter();
  const { step, category, subCategory, title, location, images } = useAppSelector((state) => state.property);
  const { token } = useAppSelector((state) => state.auth);

  const handleBack = () => {
    if (step === 1) {
      router.push("/property-manager/my-property");
    } else if (step === 1.5) {
      dispatch(setStep(1));
    } else if (step === 2) {
      dispatch(setStep(1.5));
    } else {
      dispatch(setStep(step - 1));
    }
  };

  const handleNext = () => {
    if (step === 1) {
      dispatch(setStep(1.5)); // Go from category to subcategory
    } else if (step === 1.5) {
      dispatch(setStep(2)); // Go from subcategory to title
    } else {
      dispatch(setStep(step + 1)); // Handle other steps
    }
  };

  let User: { userId: string } | null = null;
  if (token) {
    const decoded = jwtDecode<{ userId: string }>(token); // Typed as decoded token
    User = decoded;
  }

  const handleSubmit = async () => {
    dispatch(openModalFunc());
    dispatch(setIsLoaing(true));
  
    const formData = new FormData();
  
    console.log("Preparing images:");
    imageFiles.forEach((image: File, idx: number) => {
      if (image) {
        formData.append("pictures", image);
        console.log(`Image ${idx + 1}:`, image.name);
      }
    });
  
    formData.append("name", title);
    formData.append("type", category ?? "");
    formData.append("subType", subCategory ?? "");
    formData.append("size", "150 sqft");
    formData.append("propertyManagerId", User?.userId || "");
    formData.append("address", location.address);
  
    console.log("Form Data entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  
    try {
      const response = await fetch("https://limpiar-backend.onrender.com/api/properties", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: formData,
      });
  
      const data = await response.json();
      console.log("Response:", data);
  
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong, please try again later.");
      }
  
      dispatch(setIsLoaing(false));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      dispatch(setError(errorMessage));
      console.error("Submit Error:", errorMessage);
    } finally {
      dispatch(setIsLoaing(false));
    }
  };
  

  // Determine if the Next button should be enabled
  const isNextDisabled = () => {
    if (step === 1 && !category) return true;
    if (step === 1.5 && !subCategory) return true;
    if (step === 2 && !title.trim()) return true;
    if (step === 3 && !location.address) return true;
    if (step === 4 && imageFiles.length < 4) return true;

    return false;
  };

  const check = () => {
    switch (step) {
      case 4:
        return (
          <>
            <button
              onClick={handleNext}
              className="px-4 py-2 border border-gray-300 rounded-md mr-2 text-gray-700 hover:bg-gray-50"
            >
              Preview
            </button>
            <button
              onClick={handleSubmit}
              disabled={isNextDisabled()}
              className={cn(
                "px-4 py-2 rounded-md transition-colors",
                isNextDisabled()
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              )}
            >
              Publish
            </button>
          </>
        );

      case 5:
        return (
          <>
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 rounded-md mr-2 text-gray-700 hover:bg-gray-50"
            >
              Exit Preview
            </button>
          </>
        );

      default:
        return (
          <>
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
                  : "bg-blue-500 text-white hover:bg-blue-600"
              )}
            >
              Next
            </button>
          </>
        );
    }
  };

  return (
    <div className="flex justify-between items-center w-full mb-8">
      <button
        onClick={handleBack}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={18} className="mr-1" />
        Back
      </button>
      <div>{check()}</div>
    </div>
  );
}