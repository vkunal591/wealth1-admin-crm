import Image from "next/image";
import { useState } from "react";
import { IoFileTray } from "react-icons/io5";

const FileUploadPreview = ({
  handleChange,
}: {
  handleChange: any;
  forms: string;
}) => {
  const [fileType, setFileType] = useState("");
  const [filePreview, setFilePreview] = useState(""); // Store preview URL

  return (
    <div className="col-span-12">
      <div className="py-2 bg-white px-2">
        <div className="mx-auto rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="w-full p-3">
              <div className="relative border-dotted h-48 rounded-lg border-dashed border-2 border-blue-700 bg-gray-100 flex justify-center items-center">
                <div className="absolute">
                  <div className="flex flex-col items-center">
                    <div className="flex flex-col justify-center items-center h-full text-gray-500">
                      <span>
                        <IoFileTray size={50} className="text-primary" />
                      </span>
                      <span className="text-primary">
                        Click to upload a file
                      </span>
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  className="h-full w-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (!e.target.files || e.target.files.length === 0) return;
                    const file = e.target.files[0];
                    if (!file) return;

                    handleChange("fileLink", file); // Store file
                    const fileExt = file.type.split("/")[1]; // Extract type
                    setFileType(fileExt);
                    setFilePreview(
                      `${process.env.NEXT_PUBLIC_BASE_URL}${file}`
                    ); // Generate preview
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📌 File Preview (Auto Shows After Selection) */}
      {filePreview && (
        <div className="col-span-12 text-center items-center my-4">
          {fileType?.includes("image") && (
            <Image
              width={500}
              height={500}
              src={filePreview}
              alt="Preview"
              className="max-w-full max-h-[400px] object-contain rounded-lg shadow-md"
            />
          )}
          {fileType === "mp4" && (
            <video controls className="max-w-full max-h-[400px] rounded-lg">
              <source src={filePreview} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {fileType === "pdf" && (
            <embed
              src={filePreview}
              type="application/pdf"
              className="w-full h-[400px] rounded-lg"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadPreview;
