import { useState } from "react";
import Image from "next/image";

interface ImageUploadProps {
  data?: string; // Existing image URL
  setState: (image: string | File) => void;
  fieldname: string;
}

const ImageUploadCustom: React.FC<ImageUploadProps> = ({ data, setState }) => {
  const [preview, setPreview] = useState<string | null>(data || null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setState(file); // Store file to upload later
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setState(""); // Clear the image field
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {preview ? (
        <div className="relative">
          <Image 
            src={preview} 
            alt="Uploaded preview" 
            width={128} 
            height={128} 
            className="w-32 h-32 object-cover rounded-lg shadow-md" 
          />
          <button
            type="button"
            className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded-full"
            onClick={handleRemove}
          >
            ✕
          </button>
        </div>
      ) : (
        <label className="w-full cursor-pointer border border-gray-300 rounded-lg p-2 text-center">
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <span className="text-gray-600">Upload Image</span>
        </label>
      )}
    </div>
  );
};

export default ImageUploadCustom;
