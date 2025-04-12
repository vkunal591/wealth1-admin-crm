"use client";

import Image from "next/image";
import { useState } from "react";

type ContentType = {
  _id: string;
  title: string;
  icon?: string;
  link?: string;
  image?: string;
  video?: string;
  subtitle: string;
  description: string;
};

type CourseDataType = {
  _id: string;
  slug: string;
  link: string;
  title: string;
  subTitle: string;
  videoUrl: string;
  coverImage: string;
  description: string;
  contents: ContentType[];
};

type Props = {
  handleEdit: any;
  handleDelete: any;
  data: CourseDataType;
};

const CourseContentList: React.FC<Props> = ({
  data,
  handleEdit,
  handleDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4 pb-0">
      {/* Header (Always Visible) */}
      <div
        className="flex justify-between items-center p-4 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h2 className="text-xl font-bold">{data.title}</h2>
          <h3 className="text-md text-gray-600">{data.subTitle}</h3>
        </div>
        <div className="flex justify-center gap-5 items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(data)}
              className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(data._id)}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Remove
            </button>
          </div>
          <span className="text-lg">{isOpen ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="mt-3 p-4 border rounded-md bg-gray-50">
          <p className="text-gray-600 mb-4">{data.description}</p>
          {data.coverImage ? (
            <Image
              priority
              alt="Cover"
              width={100}
              height={100}
              unoptimized
              src={`/api/image?url=${data.coverImage}`}
              className="w-full h-48 object-cover mb-4 rounded-md"
            />
          ) : (
            data.videoUrl && (
              <video
                autoPlay
                muted
                loop
                className="w-full h-full object-contain rounded-lg"
                src={`/api/image?url=${data.videoUrl}`}
              />
            )
          )}
          <h3 className="text-lg font-semibold my-4">Contents</h3>
          {data.contents.map((content) => (
            <div
              key={content._id}
              className="p-3 border rounded-md mb-3 bg-gray-100"
            >
              <h4 className="font-semibold">{content.title}</h4>
              <p className="text-gray-600">{content.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseContentList;
