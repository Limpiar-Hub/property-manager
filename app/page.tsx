'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin Login/Register Card */}
        <div
          onClick={() => router.push('/admin/log-in')}
          className="cursor-pointer bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300"
        >
          <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m8-10a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Login/Register as Admin
          </h2>
          <p className="text-gray-600 text-center">
            Manage the platform and oversee all activities as an admin.
          </p>
        </div>

        {/* Property Manager Login Card */}
        <div
          onClick={() => router.push('/property-manager/login')}
          className="cursor-pointer bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300"
        >
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h11M9 21V3m0 0L3 10m6-7l6 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Login as Property Manager
          </h2>
          <p className="text-gray-600 text-center">
            Access tools to manage your properties and tenants efficiently.
          </p>
        </div>


          {/* Cleaning Business Login */}
          <div
          onClick={() => router.push('/cleaning-business/login')}
          className="cursor-pointer bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300"
        >
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h11M9 21V3m0 0L3 10m6-7l6 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Login as Cleaning Business
          </h2>
          <p className="text-gray-600 text-center">
            Access tools to manage your cleaning business and clients.
          </p>
        </div>



      </div>
    </div>
  );
}