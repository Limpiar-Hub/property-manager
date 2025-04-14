"use client"

import { useAppDispatch } from "@/hooks/useReduxHooks"
import {  setStep } from "@/redux/features/booking/bookingSlice"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
// import { useState } from "react"

export default function NotesStep() {
  const dispatch = useAppDispatch()
  // const { notes } = useAppSelector((state) => state.booking)
  // const [noteText, setNoteText] = useState(notes || "")

  const handleBack = () => {
    dispatch(setStep(4))
  }

  const handleNext = () => {
    // dispatch(setNotes(noteText))
    dispatch(setStep(6)) // Go to preview
  }

  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-semibold mb-6">Cleaning Guidelines</h3>

      <Textarea
        // value={noteText}
        // onChange={(e) => setNoteText(e.target.value)}
        placeholder="Write"
        className="min-h-[150px] text-base"
      />

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleNext} className="bg-blue-500 hover:bg-blue-600">
          Next
        </Button>
      </div>
    </div>
  )
}

