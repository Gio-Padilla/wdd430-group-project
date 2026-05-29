'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { UploadCloud } from 'lucide-react';

interface CloudinaryUploadButtonProps {
    onUpload: (result: any) => void;
}

export default function CloudinaryUploadButton({ onUpload }: CloudinaryUploadButtonProps) {
    return (
        <CldUploadWidget 
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "upload_preset_eletrico"}
            options={{
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dyqyb9ri8"
            }}
            onSuccess={(result) => {
                onUpload(result);
            }}
        >
            {({ open }) => {
                return (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            open();
                        }}
                        className="inline-flex flex-col items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:text-primary hover:border-primary hover:bg-primary/5 transition-colors w-full h-32"
                    >
                        <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                        <span>Click to upload image</span>
                        <span className="text-xs text-gray-400 font-normal">Supports JPG, PNG</span>
                    </button>
                );
            }}
        </CldUploadWidget>
    );
}
