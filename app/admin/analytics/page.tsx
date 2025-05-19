"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/admin-component/sidebar";
import { Search, Plus, Filter } from "lucide-react";
import { Button } from "@/admin-component/ui/button";

import { AddPropertyModal } from "@/admin-component/property/add-property-modal";
import { toast } from "@/admin-component/ui/use-toast";
import {
  fetchProperties,
  fetchPropertyById,
  verifyPropertyCreation,
  deleteProperty,
  updateProperty,
} from "@/services/api";
import { PropertyDetailsModal } from "@/admin-component/property/property-details-modal";

export default function Analytics() {
  return (
    <div className="flex   min-h-screen bg-white">
      <Sidebar />
      <div className=" text-lg bg-green-600 ml-60 justify-center align-center flex-1 p-8">
        <h2> welcome to Analytics Page</h2>
      </div>
    </div>
  );
}
