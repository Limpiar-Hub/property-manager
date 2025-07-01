"use client"

import type React from "react"


import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { setTitle } from "@/redux/features/addProperty/propertySlice";
import { Input } from "@/components/ui/input"

export default function TitleInput() {
  const dispatch = useAppDispatch()
  const { title } = useAppSelector((state) => state.property)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(e.target.value))
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-[10rem]">
      <h2 className="text-3xl   font-medium text-center mb-10">Give a name to your property</h2>

      <div className="relative">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Property title"
          className="text-xl p-4 h-24 font-medium"
          maxLength={40}
        />
        <div className="absolute right-2 bottom-2 text-sm text-gray-500">{title.length}/40</div>
      </div>
    </div>
  )
}

