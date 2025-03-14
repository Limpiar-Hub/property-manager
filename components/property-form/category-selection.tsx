"use client"

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks"  
import { setCategory } from "@/redux/features/addProperty/propertySlice"
import { propertyCategories } from "@/lib/data/propertyCategories"
import { Building, Factory, GraduationCap, LayoutGrid, ShoppingBag, Ticket, Truck, Utensils, Wheat } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap = {
  Building: Building,
  LayoutGrid: LayoutGrid,
  ShoppingBag: ShoppingBag,
  GraduationCap: GraduationCap,
  Factory: Factory,
  Ticket: Ticket,
  Utensils: Utensils,
  Truck: Truck,
  Wheat: Wheat,
}

export default function CategorySelection() {
  const dispatch = useAppDispatch()
  const { category } = useAppSelector((state) => state.property)

  const handleCategorySelect = (categoryId: string) => {
    dispatch(setCategory(categoryId))
    // Remove the line that changes the step
    // dispatch(setStep(1.5))
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-10">Select your property category</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {propertyCategories.map((cat) => {
          const IconComponent = iconMap[cat.icon as keyof typeof iconMap]
          const isSelected = cat.id === category

          return (
            <div
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={cn(
                "border rounded-lg p-6 flex items-start gap-4 cursor-pointer transition-all",
                isSelected ? "border-blue-500 bg-blue-50 shadow-md" : "hover:border-blue-500 hover:shadow-md",
              )}
            >
              <div className={cn("text-gray-700", isSelected && "text-blue-500")}>
                {IconComponent && <IconComponent size={24} />}
              </div>
              <div>
                <h3 className={cn("font-semibold text-lg", isSelected && "text-blue-700")}>{cat.name}</h3>
                <p className="text-gray-600 text-sm">{cat.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

