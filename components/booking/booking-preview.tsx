// "use client";

// import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
// import { setStep, closeModal } from "@/redux/features/booking/bookingSlice";
// import { ChevronLeft, X, Check } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { useState } from "react";

// export default function BookingPreview() {
//   const dispatch = useAppDispatch();
//   const booking = useAppSelector((state) => state.booking);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const handleBack = () => {
//     dispatch(setStep(4));
//   };

//   const handleSubmit = () => {
//     setIsSubmitted(true);
//   };

//   const handleGoToBookings = () => {
//     dispatch(closeModal());
//     // redirect to the bookings page
//   };

//   if (isSubmitted) {
//     return (
//       <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
//         <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
//           <Check className="h-8 w-8 text-green-500" />
//         </div>
//         <h2 className="text-2xl font-bold mb-1">Cleaning Request</h2>
//         <h3 className="text-xl font-bold mb-4">Received Successfully.</h3>

//         <p className="text-gray-600 mb-8 max-w-md">
//           Thank you for submitting your details. Our team has received your
//           information and will review it shortly. An administrator will reach
//           out to you for any additional documentation required to complete the
//           process. We appreciate your cooperation and look forward to assisting
//           you further.
//         </p>

//         <Button
//           onClick={handleGoToBookings}
//           className="w-full max-w-md bg-blue-500 hover:bg-blue-600"
//         >
//           Go to Bookings
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col">
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="text-xl font-semibold">Booking Preview</h3>
//         <button
//           onClick={() => dispatch(closeModal())}
//           className="text-gray-400 hover:text-gray-600"
//         >
//           <X size={24} />
//         </button>
//       </div>

//       <div className="space-y-6">
//         {/* Service */}
//         <div>
//           <p className="text-sm text-gray-500 mb-2">Service</p>
//           <div className="flex items-center">
//             <div className="h-16 w-16 rounded-md overflow-hidden mr-3">
//               <Image
//                 // src={"/placeholder.svg"}
//                 src={booking.serviceType?.image || "/placeholder.svg"}
//                 alt={booking.serviceType?.name || "Service"}
//                 width={64}
//                 height={64}
//                 className="h-full w-full object-cover"
//               />
//             </div>
//             <div>
//               <p className="font-medium">{booking.serviceType?.name}</p>
//               <p className="text-sm">${booking.serviceType?.price}</p>
//             </div>
//           </div>
//         </div>

//         {/* Property */}
//         <div>
//           <p className="text-sm text-gray-500 mb-2">Property</p>
//           <div className="flex items-center">
//             <div className="h-16 w-16 rounded-md overflow-hidden mr-3">
//               <Image
//                 src={booking.property?.image || "/placeholder.svg"}
//                 alt={booking.property?.name || "Property"}
//                 width={64}
//                 height={64}
//                 className="h-full w-full object-cover"
//               />
//             </div>
//             <p className="font-medium">{booking.property?.name}</p>
//           </div>
//         </div>

//         {/* Date */}
//         {/* <div>
//           <p className="text-sm text-gray-500 mb-2">Date</p>
//           <p className="font-medium">
//             {booking.date.type === "one-time" && booking.date.selectedDate}
//             {booking.date.type === "multiple-day" &&
//               booking.date.dateRange &&
//               `${booking.date.dateRange.start} - ${booking.date.dateRange.end}`}
//             {booking.date.type === "routine" && booking.date.routineDays && booking.date.routineDays.join(", ")}
//           </p>
//         </div> */}

//         <div>
//           <p className="text-sm text-gray-500 mb-2">Date</p>
//           <p className="font-medium">{booking.date.selectedDate}</p>
//         </div>

//         {/* Time */}
//         <div>
//           <p className="text-sm text-gray-500 mb-2">Time</p>
//           <p className="font-medium">{booking.time}</p>
//         </div>

//         {/* Additional Note */}
//         {/* <div>
//           <p className="text-sm text-gray-500 mb-2">Additional note</p>
//           <p>{booking.notes || "No additional notes provided."}</p>
//         </div> */}
//       </div>

//       <div className="flex justify-between mt-8">
//         <Button variant="outline" onClick={handleBack}>
//           <ChevronLeft className="w-4 h-4 mr-2" />
//           Back
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           className="bg-blue-500 hover:bg-blue-600"
//         >
//           Submit Request
//         </Button>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
// import { setStep, closeModal } from "@/redux/features/booking/bookingSlice";
// import { ChevronLeft, X, Check } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { useState } from "react";
// import axios from "axios";

// export default function BookingPreview() {
//   const dispatch = useAppDispatch();
//   const booking = useAppSelector((state) => state.booking);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleBack = () => {
//     dispatch(setStep(4));
//   };

//   const handleSubmit = async () => {
//     setIsLoading(true);

//     try {
//       // Retrieve necessary data from local storage
//       const token = localStorage.getItem("token");
//       console.log("Token:", token);
//       // const propertyManagerId = localStorage.getItem("userId");
//       // const phoneNumber = localStorage.getItem("phoneNumber");

//       // Prepare the request body
//       const requestBody = {
//         propertyId: "67e312b10c40b5b8ee14e24d", // Hardcoded property ID
//         propertyManagerId: "67dd4395a978408fbcd04e00", // Retrieved from local storage
//         serviceType: booking.serviceType?.name, // From Redux state
//         date: booking.date.selectedDate, // Already in the correct format
//         startTime: booking.time, // Already in the correct format
//         phoneNumber: "+2348101200547", // Retrieved from local storage
//       };

//       console.log("Submitting booking data:", requestBody);

//       // Send the POST request to the backend
//       const response = await axios.post(
//         "https://limpiar-backend.onrender.com/api/bookings",
//         requestBody,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Bearer token from local storage
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Booking response:", response.data);

//       // Mark the submission as successful
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error("Error submitting booking:", error);
//       alert("Failed to submit booking. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoToBookings = () => {
//     dispatch(closeModal());
//     // Redirect to the bookings page
//   };

//   if (isSubmitted) {
//     return (
//       <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
//         <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
//           <Check className="h-8 w-8 text-green-500" />
//         </div>
//         <h2 className="text-2xl font-bold mb-1">Cleaning Request</h2>
//         <h3 className="text-xl font-bold mb-4">Received Successfully.</h3>

//         <p className="text-gray-600 mb-8 max-w-md">
//           Thank you for submitting your details. Our team has received your
//           information and will review it shortly. An administrator will reach
//           out to you for any additional documentation required to complete the
//           process. We appreciate your cooperation and look forward to assisting
//           you further.
//         </p>

//         <Button
//           onClick={handleGoToBookings}
//           className="w-full max-w-md bg-blue-500 hover:bg-blue-600"
//         >
//           Go to Bookings
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col">
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="text-xl font-semibold">Booking Preview</h3>
//         <button
//           onClick={() => dispatch(closeModal())}
//           className="text-gray-400 hover:text-gray-600"
//         >
//           <X size={24} />
//         </button>
//       </div>

//       <div className="space-y-6">
//         {/* Service */}
//         <div>
//           <p className="text-sm text-gray-500 mb-2">Service</p>
//           <div className="flex items-center">
//             <div className="h-16 w-16 rounded-md overflow-hidden mr-3">
//               <Image
//                 src={booking.serviceType?.image || "/placeholder.svg"}
//                 alt={booking.serviceType?.name || "Service"}
//                 width={64}
//                 height={64}
//                 className="h-full w-full object-cover"
//               />
//             </div>
//             <div>
//               <p className="font-medium">{booking.serviceType?.name}</p>
//               <p className="text-sm">${booking.serviceType?.price}</p>
//             </div>
//           </div>
//         </div>

//         {/* Property */}
//         <div>
//           <p className="text-sm text-gray-500 mb-2">Property</p>
//           <div className="flex items-center">
//             <div className="h-16 w-16 rounded-md overflow-hidden mr-3">
//               <Image
//                 src={booking.property?.image || "/placeholder.svg"}
//                 alt={booking.property?.name || "Property"}
//                 width={64}
//                 height={64}
//                 className="h-full w-full object-cover"
//               />
//             </div>
//             <p className="font-medium">{booking.property?.name}</p>
//           </div>
//         </div>

//         {/* Date */}
//         <div>
//           <p className="text-sm text-gray-500 mb-2">Date</p>
//           <p className="font-medium">{booking.date.selectedDate}</p>
//         </div>

//         {/* Time */}
//         <div>
//           <p className="text-sm text-gray-500 mb-2">Time</p>
//           <p className="font-medium">{booking.time}</p>
//         </div>
//       </div>

//       <div className="flex justify-between mt-8">
//         <Button variant="outline" onClick={handleBack}>
//           <ChevronLeft className="w-4 h-4 mr-2" />
//           Back
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           disabled={isLoading}
//           className="bg-blue-500 hover:bg-blue-600"
//         >
//           {isLoading ? "Submitting..." : "Submit Request"}
//         </Button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { setStep, closeModal } from "@/redux/features/booking/bookingSlice";
import { ChevronLeft, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { revalidatePath } from "next/cache"; 

export default function BookingPreview() {
  const dispatch = useAppDispatch();
  const booking = useAppSelector((state) => state.booking);
  const authState = useAppSelector((state) => state.auth); // Get the entire auth state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Parse the user and token from the persisted auth state
  const user = authState.user || null;
  const token = authState.token ;

  const handleBack = () => {
    dispatch(setStep(4));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Ensure required data is available
      if (!user?._id || !user?.phoneNumber || !token) {
        console.error("Missing required user data or token");
        alert("Unable to submit booking. Please ensure you are logged in.");
        setIsLoading(false);
        return;
      }

      // Prepare the request body
      const requestBody = {
        propertyId: "67e5334a1f67bc45b36bb9f0", 
        propertyManagerId: user._id, 
        serviceType: booking.serviceType?.name,
        date: booking.date.selectedDate, 
        startTime: booking.time, 
        phoneNumber: user.phoneNumber, 
      };

      console.log("Submitting booking data:", requestBody);
      console.log("Bearer Token:", token);

      // Send the POST request to the backend
      const response = await axios.post(
        "https://limpiar-backend.onrender.com/api/bookings",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer token from parsed auth state
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Booking response:", response.data);

      // revalidatePath("/booking");

      // Mark the submission as successful
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Failed to submit booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToBookings = () => {
    dispatch(closeModal());
    // Redirect to the bookings page
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <Check className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-1">Cleaning Request</h2>
        <h3 className="text-xl font-bold mb-4">Received Successfully.</h3>

        <p className="text-gray-600 mb-8 max-w-md">
          Thank you for submitting your details. Our team has received your
          information and will review it shortly. An administrator will reach
          out to you for any additional documentation required to complete the
          process. We appreciate your cooperation and look forward to assisting
          you further.
        </p>

        <Button
          onClick={handleGoToBookings}
          className="w-full max-w-md bg-blue-500 hover:bg-blue-600"
        >
          Go to Bookings
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Booking Preview</h3>
        <button
          onClick={() => dispatch(closeModal())}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Service */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Service</p>
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-md overflow-hidden mr-3">
              <Image
                src={booking.serviceType?.image || "/placeholder.svg"}
                alt={booking.serviceType?.name || "Service"}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{booking.serviceType?.name}</p>
              <p className="text-sm">${booking.serviceType?.price}</p>
            </div>
          </div>
        </div>

        {/* Property */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Property</p>
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-md overflow-hidden mr-3">
              <Image
                src={booking.property?.image || "/placeholder.svg"}
                alt={booking.property?.name || "Property"}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="font-medium">{booking.property?.name}</p>
          </div>
        </div>

        {/* Date */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Date</p>
          <p className="font-medium">{booking.date.selectedDate}</p>
        </div>

        {/* Time */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Time</p>
          <p className="font-medium">{booking.time}</p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {isLoading ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </div>
  );
}