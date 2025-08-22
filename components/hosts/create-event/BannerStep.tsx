"use client";

import { Button } from "@/components/ui/button";
import { EventFormData } from "@/hooks/useEventCreation";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";

interface BannerStepProps {
  formData: EventFormData;
  onUpdate: (updates: Partial<EventFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onSaveDraft?: () => Promise<void>;
  isSaving?: boolean;
  isUploading?: boolean;
  isEdit?: boolean;
  onUploadImage?: (file: File) => Promise<string>;
  onResetUpload?: () => void;
}

export function BannerStep({ 
  formData, 
  onUpdate, 
  onNext, 
  onBack, 
  onSaveDraft, 
  isSaving = false, 
  isUploading = false, 
  isEdit = false,
  onUploadImage,
  onResetUpload 
}: BannerStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name, file.size);
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file");
        return;
      }
      
      onUpdate({ bannerImage: file });
      
      // If onUploadImage is provided, upload immediately for both create and edit modes
      if (onUploadImage) {
        try {
          console.log("Starting immediate upload");
          const imageUrl = await onUploadImage(file);
          console.log("Upload completed, updating form data");
          onUpdate({ bannerImage: null, bannerImageURL: imageUrl });
        } catch (error) {
          console.error("Failed to upload image:", error);
          // Reset the banner image on error
          onUpdate({ bannerImage: null });
        }
      }
    }
    
    // Clear the input value to allow selecting the same file again
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-4" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Banner</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Upload Image Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Image</h2>
          
          {/* Show existing image or upload area */}
          {(formData.bannerImage || formData.bannerImageURL) ? (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="relative w-full h-64 border-2 border-gray-300 rounded-lg overflow-hidden">
                {formData.bannerImage ? (
                  <Image
                    src={URL.createObjectURL(formData.bannerImage)}
                    alt="Event banner preview"
                    fill
                    className="object-cover"
                  />
                ) : formData.bannerImageURL ? (
                  <Image
                    src={formData.bannerImageURL}
                    alt="Event banner"
                    fill
                    className="object-cover"
                  />
                ) : null}
                
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p>Uploading...</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Change Image Button */}
              <div className="text-center">
                <div className="flex gap-2 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleChooseFile}
                    disabled={isUploading}
                  >
                    Change Image
                  </Button>
                  {isUploading && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        // Reset upload state and clear banner image
                        onUpdate({ bannerImage: null });
                        if (onResetUpload) {
                          onResetUpload();
                        }
                      }}
                      size="sm"
                    >
                      Cancel Upload
                    </Button>
                  )}
                </div>
                {formData.bannerImage && (
                  <p className="text-sm text-gray-500 mt-2">
                    New file: {formData.bannerImage.name}
                  </p>
                )}
                {isUploading && (
                  <p className="text-sm text-blue-600 mt-2">
                    Uploading image... This may take a few moments.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleChooseFile}
                    disabled={isUploading}
                    className="mb-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      "Choose File"
                    )}
                  </Button>
                  <p className="text-sm text-gray-500">No file chosen</p>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>Feature image must be at least 1170 pixels wide by 504 pixels high.</p>
                  <p>Valid file formats: JPG, GIF, PNG.</p>
                </div>
              </div>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-6"
          >
            Go back to Edit Rave
          </Button>
          
          <div className="flex gap-3">
            {onSaveDraft && (
              <Button
                type="button"
                variant="outline"
                onClick={onSaveDraft}
                disabled={isSaving || isUploading}
                className="px-6"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Draft"
                )}
              </Button>
            )}
            
            <Button
              type="submit"
              disabled={isUploading}
              className="bg-[#D72638] hover:bg-[#B91E2F] text-white px-8"
            >
              Save & Continue
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}