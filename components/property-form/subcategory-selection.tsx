"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { setSubCategory } from "@/redux/features/addProperty/propertySlice";
import { propertyCategories } from "@/lib/data/propertyCategories";
import { cn } from "@/lib/utils";

export default function SubcategorySelection() {
  const dispatch = useAppDispatch();
  const { category, subCategory } = useAppSelector((state) => state.property);

  const selectedCategory = propertyCategories.find((c) => c.id === category);

  if (!selectedCategory) return null;

  const handleSubcategorySelect = (subcategoryId: string) => {
    dispatch(setSubCategory(subcategoryId));
    // Remove the line that changes the step
    // dispatch(setStep(2))
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-10">
        What kind of {selectedCategory.name.toLowerCase()} building do you have?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {selectedCategory.subCategories.map((subCat) => {
          const isSelected = subCat.id === subCategory;

          return (
            <div
              key={subCat.id}
              onClick={() => handleSubcategorySelect(subCat.id)}
              className={cn(
                "border rounded-lg p-6 cursor-pointer transition-all",
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "hover:border-blue-500 hover:shadow-md"
              )}
            >
              <h3
                className={cn(
                  "font-semibold text-lg mb-2",
                  isSelected && "text-blue-700"
                )}
              >
                {subCat.name}
              </h3>
              <p className="text-gray-600 text-sm">{subCat.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
