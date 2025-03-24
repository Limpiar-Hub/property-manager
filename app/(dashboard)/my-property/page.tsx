"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { resetProperty } from "@/redux/features/addProperty/propertySlice";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);

  const handleAddProperty = () => {
    dispatch(resetProperty()); 
    router.push("/my-property/add");
  };
  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="rounded-lg overflow-hidden bg-gradient-to-r from-blue-800 to-blue-600 mb-12">
        <div className="flex flex-col md:flex-row justify-between p-6 md:p-8">
          <div className="space-y-3 md:space-y-4 md:max-w-lg">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
            Welcome, {user?.fullName || "Guest"}!
            </h1>
            <p className="text-blue-100 text-base md:text-lg">
              Let&apos;s go ahead and add your first property to get you
              started.
            </p>
            <button
              onClick={handleAddProperty}
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors mt-2"
            >
              Add property
            </button>
          </div>
          <div className="hidden md:block relative w-64 h-48">
            <Image
              src="/duplex.png"
              alt="Apartment building"
              width={300}
              height={400}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
          Add your property in few simple steps
        </h2>

        <div className="space-y-6 md:space-y-8">
          <div className="flex gap-4 md:gap-6">
            <div className="font-bold text-xl md:text-2xl">1.</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg md:text-xl mb-1 md:mb-2">
                Category
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Basic info like property category and sub-category.
              </p>
              <div className="h-px bg-gray-200 mt-4 md:mt-6"></div>
            </div>
          </div>

          <div className="flex gap-4 md:gap-6">
            <div className="font-bold text-xl md:text-2xl">2.</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg md:text-xl mb-1 md:mb-2">
                Title
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Give your property a name.
              </p>
              <div className="h-px bg-gray-200 mt-4 md:mt-6"></div>
            </div>
          </div>

          <div className="flex gap-4 md:gap-6">
            <div className="font-bold text-xl md:text-2xl">3.</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg md:text-xl mb-1 md:mb-2">
                Units
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Add all kinds of units of your property.
              </p>
              <div className="h-px bg-gray-200 mt-4 md:mt-6"></div>
            </div>
          </div>

          <div className="flex gap-4 md:gap-6">
            <div className="font-bold text-xl md:text-2xl">4.</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg md:text-xl mb-1 md:mb-2">
                Location
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Add location of your property.
              </p>
              <div className="h-px bg-gray-200 mt-4 md:mt-6"></div>
            </div>
          </div>

          <div className="flex gap-4 md:gap-6">
            <div className="font-bold text-xl md:text-2xl">5.</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg md:text-xl mb-1 md:mb-2">
                Image
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Add photos of your property.
              </p>
              <div className="h-px bg-gray-200 mt-4 md:mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
