
import Image from "next/image"
import Link from "next/link"

export default function WelcomeCard() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Welcome Banner */}
      <div className="rounded-lg overflow-hidden bg-gradient-to-r from-blue-900 to-blue-600 mb-12">
        <div className="flex flex-col md:flex-row justify-between p-8">
          <div className="space-y-4 md:max-w-lg">
            <h1 className="text-4xl font-bold text-white">Welcome, William!</h1>
            <p className="text-blue-100 text-lg">Let&apos;s go ahead and add your first property to get you started.</p>
            <Link
              href="/add-property"
              className="inline-block bg-blue-400 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded-md transition-colors mt-4"
            >
              Add property
            </Link>
          </div>
          <div className="hidden md:block relative w-64 h-48 mt-4 md:mt-0">
            <Image
              src="/building.png"
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
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Add your property in few simple steps</h2>

        <div className="space-y-8">
          {/* Step 1 */}
          <div className="flex gap-6">
            <div className="font-bold text-2xl">1.</div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2">Category</h3>
              <p className="text-gray-600">Basic info like property category and sub-category.</p>
              <div className="h-px bg-gray-200 mt-6"></div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-6">
            <div className="font-bold text-2xl">2.</div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2">Title</h3>
              <p className="text-gray-600">Give your property a name.</p>
              <div className="h-px bg-gray-200 mt-6"></div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-6">
            <div className="font-bold text-2xl">3.</div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2">Units</h3>
              <p className="text-gray-600">Add all kinds of units of your property.</p>
              <div className="h-px bg-gray-200 mt-6"></div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-6">
            <div className="font-bold text-2xl">4.</div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2">Location</h3>
              <p className="text-gray-600">Add location of your property.</p>
              <div className="h-px bg-gray-200 mt-6"></div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-6">
            <div className="font-bold text-2xl">5.</div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2">Image</h3>
              <p className="text-gray-600">Add photos of your property.</p>
              <div className="h-px bg-gray-200 mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

