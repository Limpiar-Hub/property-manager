import { Check } from "lucide-react"
import { Loader } from "lucide-react"
import { Button } from "./ui/button"
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks"
import { useRouter } from "next/navigation"
import { closeModalFunc } from "@/redux/features/addProperty/propertySlice"
import { AlertCircle } from "lucide-react";

export default function SuccessAddNewProperty() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { isLoading } = useAppSelector((state) => state.property)

    const handleGoToProperty = () => {
        dispatch(closeModalFunc());
        router.push("/my-property")
      }

      const func = () => {
        if (isLoading) {
            return <Loader className="w-6 h-6 text-blue-500 animate-spin" />
        } else if (!isLoading) {
            return <Check className="h-8 w-8 text-green-500" />
        } else if (isLoading === "error") {
            return <AlertCircle className="w-6 h-6" />
        }
      }

    return (
        <div className="flex flex-col items-center relative top-[20%] align-middle justify-center py-8 px-4 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
            {isLoading ? <Loader className="w-6 h-6 text-blue-500 animate-spin" /> : <Check className="h-8 w-8 text-green-500" />}

            </div>
            <h2 className="text-2xl font-bold mb-1">Add New Property</h2>
            {isLoading ? <h3 className="text-xl font-bold mb-4">Adding New Property.....</h3> : <h3 className="text-xl font-bold mb-4">You have Successfully Added a New Property.</h3> }

            
            <Button onClick={handleGoToProperty} className="w-full max-w-md bg-blue-500 hover:bg-blue-600 disabled:text-gray-500 disabled:cursor-not-allowed" disabled={isLoading === true} >
            View Added Property
            </Button>
        </div>
    )
}