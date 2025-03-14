const steps = [
  {
    number: 1,
    title: "Category",
    description: "Basic info like property category and sub-category.",
  },
  {
    number: 2,
    title: "Title",
    description: "Give your property a name.",
  },
  {
    number: 3,
    title: "Units",
    description: "Add all kinds of units of your property.",
  },
  {
    number: 4,
    title: "Location",
    description: "Add location of your property.",
  },
  {
    number: 5,
    title: "Image",
    description: "Add photos of your property.",
  },
];

export function PropertySteps() {
  return (
    <div className="max-w-4xl mx-auto">
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
            <h3 className="font-bold text-lg md:text-xl mb-1 md:mb-2">Title</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Give your property a name.
            </p>
            <div className="h-px bg-gray-200 mt-4 md:mt-6"></div>
          </div>
        </div>

        <div className="flex gap-4 md:gap-6">
          <div className="font-bold text-xl md:text-2xl">3.</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg md:text-xl mb-1 md:mb-2">Units</h3>
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
            <h3 className="font-bold text-lg md:text-xl mb-1 md:mb-2">Image</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Add photos of your property.
            </p>
            <div className="h-px bg-gray-200 mt-4 md:mt-6"></div>
          </div>
        </div>
      </div>
    </div>
    // <div className="space-y-8">
    //   <h2 className="text-2xl lg:text-3xl font-bold text-center">Add your property in few simple steps</h2>

    //   <div className="space-y-8">
    //     {steps.map((step) => (
    //       <div key={step.number} className="flex gap-6">
    //         <div className="flex-none">
    //           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
    //             {step.number}
    //           </div>
    //         </div>
    //         <div className="space-y-1">
    //           <h3 className="text-lg font-semibold">{step.title}</h3>
    //           <p className="text-gray-600">{step.description}</p>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
  );
}
