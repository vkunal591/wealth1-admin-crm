"use client";

import SingleImageUploader from "@/components/input/ImageUploader";
import SingleVideoUploader from "@/components/input/VideoUploader";
import { useState } from "react";

interface SubContent {
  _id: number;
  title: string;
  description: string;
  image?: File | null;
  isEditing: boolean;
}

interface ContentBlock {
  title: string;
  subTitle: string;
  description: string;
  media?: File | null;
  contents: SubContent[];
}

const ContentBlockComponent = ({
  slug,
  title,
  onSave,
  section,
  onCancel,
  initialData,
  hideContent = false,
  uploadType = "image",
}: {
  slug: string;
  onSave?: any;
  title: string;
  onCancel?: any;
  section: string;
  initialData: any;
  hideContent?: boolean;
  uploadType: "image" | "video";
}) => {
  const [content, setContent] = useState<any>({
    _id: initialData?._id ?? "",
    slug: initialData?.slug ?? slug,
    title: initialData?.title ?? "",
    videoUrl: initialData?.videoUrl ?? "",
    subTitle: initialData?.subTitle ?? "",
    contents: initialData?.contents ?? [],
    coverImage: initialData?.coverImage ?? "",
    description: initialData?.description ?? "",
  });

  const [newSubContent, setNewSubContent] = useState<SubContent>({
    _id: 0,
    title: "",
    image: null,
    description: "",
    isEditing: false,
  });

  // Handle Main Content Change
  const handleChange = (field: keyof ContentBlock, value: any) => {
    setContent((prev: any) => ({ ...prev, [field]: value }));
  };

  // Add or Update Subcontent
  const handleAddOrUpdateSubContent = () => {
    if (newSubContent._id >= 0) {
      console.log(newSubContent);
      setContent((prev: any) => ({
        ...prev,
        contents: [
          ...prev.contents,
          { ...newSubContent, id: Date.now(), isEditing: false },
        ],
      }));
      console.log(newSubContent, "0");
    } else {
      setContent((prev: any) => ({
        ...prev,
        contents: prev.contents.map((sub: any) =>
          sub._id === newSubContent?._id ? newSubContent : sub
        ),
      }));
      console.log(newSubContent, "1");
    }
    setNewSubContent({
      title: "",
      image: null,
      description: "",
      isEditing: false,
      _id: newSubContent?._id + 1,
    });
  };

  // Edit Subcontent
  const handleEditSubContent = (sub: SubContent) => {
    setNewSubContent({ ...sub, isEditing: true });
  };

  // Remove Subcontent
  const handleRemoveSubContent = (id: number) => {
    setContent((prev: any) => ({
      ...prev,
      contents: prev.contents.filter((sub: any) => sub?._id !== id),
    }));
  };

  const singleUpload = {
    field: {
      name: "coverImage", // Field name
      label: "Upload Image", // Label for the upload field
      value: content?.coverImage ?? "", // Optional initial value for the field (e.g., an image URL or path)
    },
    setFormData: setContent,
  };

  const videoUpload = {
    field: {
      name: "videoUrl", // Field name
      label: "Upload Video", // Label for the upload field
      value: content?.videoUrl ?? "", // Optional initial value for the field (e.g., an image URL or path)
    },
    setFormData: setContent,
  };

  const singleSubContentUpload = {
    field: {
      name: `image`, // Field name
      label: "Upload Image", // Label for the upload field
      value: newSubContent?.image ?? "", // Optional initial value for the field (e.g., an image URL or path)
    },
    setFormData: setNewSubContent,
  };

  const handleSubmit = async () => {
    const formData = {
      ...content,
      contents: content?.contents.map((content: any) => {
        return Object.fromEntries(
          Object.entries({
            title: content.title,
            link: content.link || null,
            icon: content.icon || null,
            video: content.video || null,
            image: content.image || null,
            description: content.description,
          }).filter(([, value]) => value !== null && value !== undefined)
        );
      }),
    };

    if (!formData?._id) {
      delete formData._id;
    }

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (value instanceof File) {
        data.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item instanceof File) {
            data.append(`${key}[${index}]`, item);
          } else if (typeof item === "object" && item !== null) {
            Object.keys(item).forEach((objKey) => {
              if (objKey === "image") {
                data.append(`${objKey}${index}`, item[objKey]);
              } else {
                data.append(
                  `${key}[${index}][${objKey}]`,
                  String(item[objKey])
                );
              }
            });
          } else data.append(`${key}[${index}]`, String(item));
        });
      } else if (typeof value === "object" && value !== null)
        Object.keys(value).forEach((objKey) => {
          data.append(`${key}[${objKey}]`, String(value[objKey]));
        });
      else data.append(key, String(value));
    });

    await onSave(data, content?._id ?? null);
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl text-primary font-semibold">
          {title ?? "Banner"}
        </h2>
        <button
          onClick={onCancel}
          className="w-fit px-6 bg-red-500 text-white py-2 text-lg rounded-md hover:bg-red-600 transition"
        >
          Cancel
        </button>
      </div>
      <div className="grid grid-cols-2 gap-5 mb-5">
        <input
          type="text"
          placeholder="Title"
          value={content.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="subTitle"
          value={content.subTitle}
          onChange={(e) => handleChange("subTitle", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <textarea
          rows={5}
          placeholder="Description"
          value={content.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <SingleImageUploader {...singleUpload} />
        <SingleVideoUploader {...videoUpload} />
      </div>

      {/* Subcontent List */}
      {!hideContent && content.contents.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold my-4">Contents</h3>
          {content.contents.map((sub: any) => (
            <div
              key={sub?._id || sub?._id}
              className="p-4 border rounded-md mb-3 flex justify-between items-center bg-gray-100"
            >
              <div>
                <h4 className="font-semibold">{sub.title}</h4>
                <p className="text-gray-600">{sub.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditSubContent(sub)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemoveSubContent(sub?._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subcontent Form */}
      {!hideContent && (
        <div className="mt-6 p-4 bg-gray-100 rounded-xl">
          <h2 className="text-xl text-primary font-semibold mb-4">
            {section ?? "Sub Content"} (Optional)
          </h2>
          <input
            type="text"
            placeholder="Title"
            value={newSubContent.title}
            onChange={(e) =>
              setNewSubContent({ ...newSubContent, title: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 gap-5 mt-5">
            <textarea
              placeholder="Description"
              value={newSubContent.description}
              onChange={(e) =>
                setNewSubContent({
                  ...newSubContent,
                  description: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            ></textarea>
            {uploadType === "image" ? (
              <SingleImageUploader {...singleSubContentUpload} />
            ) : (
              <SingleVideoUploader {...videoUpload} />
            )}
          </div>
          <button
            onClick={handleAddOrUpdateSubContent}
            className="w-full bg-blue-500 text-white mt-5 py-2 rounded-md hover:bg-blue-600 transition"
          >
            {newSubContent?._id === 0 ? "+ Add More" : "Save Changes"}
          </button>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full px-6 bg-green-500 text-white mt-5 py-2 text-lg rounded-md hover:bg-green-600 transition"
      >
        Save
      </button>
    </div>
  );
};

export default ContentBlockComponent;
