

// export default function Logo() {
//     return (
//       <div className="flex items-center gap-2">
//         <div className="bg-indigo-600 rounded-lg p-2">
//           <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             className="text-white"
//           >
//             <path
//               d="M20 14C21.1046 14 22 13.1046 22 12C22 10.8954 21.1046 10 20 10C18.8954 10 18 10.8954 18 12C18 13.1046 18.8954 14 20 14Z"
//               fill="currentColor"
//             />
//             <path
//               d="M4 14C5.10457 14 6 13.1046 6 12C6 10.8954 5.10457 10 4 10C2.89543 10 2 10.8954 2 12C2 13.1046 2.89543 14 4 14Z"
//               fill="currentColor"
//             />
//             <path
//               d="M12 22C13.1046 22 14 21.1046 14 20C14 18.8954 13.1046 18 12 18C10.8954 18 10 18.8954 10 20C10 21.1046 10.8954 22 12 22Z"
//               fill="currentColor"
//             />
//             <path
//               d="M18 12L13.5 14.5M10.5 14.5L6 12M12 6V10"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//             <path
//               d="M12 6C13.1046 6 14 5.10457 14 4C14 2.89543 13.1046 2 12 2C10.8954 2 10 2.89543 10 4C10 5.10457 10.8954 6 12 6Z"
//               fill="currentColor"
//             />
//           </svg>
//         </div>
//         <span className="text-indigo-600 text-xl font-medium">Limpiar</span>
//       </div>
//     )
//   }
  

import Image from "next/image";
import cleaningBusinessLogo from "@/public/cleaningBusinessLogo.png";

export default function Logo() {
  return (
    <div className="flex items-center">
      <Image
        src={cleaningBusinessLogo}
        alt="Limpiar Logo"
        width={150} // Adjust width as needed
        height={50} // Adjust height as needed
        priority
      />
    </div>
  );
}