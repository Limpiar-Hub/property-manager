"use client"

import { Provider } from "react-redux"
import { store } from "@/redux/store"
import { InboxContent } from "./inbox-content"

export default function InboxPage() {
  return (
    <Provider store={store}>
      <InboxContent />
    </Provider>
  )
}

