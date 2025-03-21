import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
    return (
        <div className="flex items-center relative left-[40%] space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
            <span className="text-white font-medium">Signin in....</span>
        </div>
    );
}