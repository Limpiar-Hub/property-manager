import { Check } from "lucide-react"
import { Button } from "./ui/button"
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks"
import { resetProperty } from "@/redux/features/addProperty/propertySlice"
import { useRouter } from "next/navigation"
import { closeModalFunc } from "@/redux/features/addProperty/propertySlice"
import { AlertTriangle } from "lucide-react";

export default function SuccessAddNewProperty() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { isLoading, error } = useAppSelector((state) => state.property)

    const handleGoToProperty = () => {
        setTimeout(() => {
            dispatch(closeModalFunc());
            dispatch(resetProperty());
        }, 1000);
        router.push("/my-property");
      }

    return (
        <div className="flex flex-col items-center relative top-[20%] align-middle justify-center py-8 px-4 text-center">
            <div className="w-full flex flex-col justify-center items-center">
                {isLoading ?  
                    <div className="absolute inset-0 flex items-center bg-white justify-center mb-6 z-10">
                        <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    </div>
                     : 
                    <div>
                        {error ? 
                            <div className="flex justify-center flex-col items-center gap-2 text-red-600 bg-red-100 p-3 rounded-xl shadow-sm mb-6">
                            <AlertTriangle className="w-5 h-5" />
                            <span>{error}</span>
                          </div> :
                          
                          <div className="flex w-full justify-center flex-col items-center bg-green-100 p-3 rounded-full shadow-sm mb-10">
                              <Check className="h-8 w-8 text-green-500" />
                          </div>
                        }
                    </div>
                }
            </div>

            
            <Button onClick={handleGoToProperty} className="w-full max-w-md bg-blue-500 hover:bg-blue-600 disabled:text-gray-500 disabled:cursor-not-allowed" disabled={isLoading === true} >
            {error ? "Back to My Property" : "View Added Property" }
            </Button>
        </div>
    )
}