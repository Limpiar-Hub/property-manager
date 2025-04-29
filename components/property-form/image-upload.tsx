"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { addImage, removeImage } from "@/redux/features/addProperty/propertySlice";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useImageContext } from "../imageFileProvider";

export default function ImageUpload() {
  const { addFiles } = useImageContext();
  const dispatch = useAppDispatch();
  const images = useAppSelector((state) => state.property.images);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (images.length >= 8) return;

      setUploading(true);

      setTimeout(() => {
        const newFiles = acceptedFiles.slice(0, 8 - images.length);
        addFiles(newFiles);

        newFiles.forEach((file, index) => {
          const imageUrl = URL.createObjectURL(file);
          const alreadyExists = images.some((img) => img.url === imageUrl);
          if (!alreadyExists) {
            dispatch(
              addImage({
                url: imageUrl,
                isCover: images.length + index === 0,
              })
            );
          }
        });

        setUploading(false);
      }, 1000);
    },
    [dispatch, images.length, addFiles, images]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 8 - images.length,
  });

  const handleRemoveImage = (url: string) => {
    dispatch(removeImage(url));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2">
        Add Images of Your Property
      </h2>
      <p className="text-center text-gray-500 mb-6">
        Upload at least 4 photos. You can add up to 8.
      </p>

      <div
        className={`grid gap-3 ${
          images.length > 0
            ? "grid-cols-2 md:grid-cols-4"
            : "flex justify-center"
        }`}
      >
        {images.map((image, index) => (
          <div key={image.url} className="relative w-28 h-28 md:w-36 md:h-36">
            <Image
              src={image.url || "/placeholder.svg"}
              alt={`Property image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
            <button
              onClick={() => handleRemoveImage(image.url)}
              className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <X size={16} />
            </button>
            {image.isCover && (
              <div className="absolute bottom-1 left-1 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                Cover
              </div>
            )}
          </div>
        ))}

        {images.length < 8 && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all
              ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }
              ${uploading ? "opacity-50 cursor-not-allowed" : ""}
              ${
                images.length === 0 ? "w-60 h-40" : "w-28 h-28 md:w-36 md:h-36"
              }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              {isDragActive ? "Drop files here" : "Drag & drop your images"}
            </p>
            <p className="text-sm text-blue-500 mt-2">or browse</p>
          </div>
        )}
      </div>
    </div>
  );
}
