"use client"
import { createContext, useContext, useState, ReactNode } from "react";

interface ImageContextType {
  imageFiles: File[];
  addFiles: (files: File[]) => void;
  removeFile: (fileName: string) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider = ({ children }: { children: ReactNode }) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
 
  const addFiles = (files: File[]) => {
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (fileName: string) => {
    setImageFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  return (
    <ImageContext.Provider value={{ imageFiles, addFiles, removeFile, }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImageContext must be used within an ImageProvider");
  }
  return context;
};
