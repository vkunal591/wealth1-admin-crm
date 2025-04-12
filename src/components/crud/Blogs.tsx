"use client";

import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { endpoints } from "@/data/endpoints";
import ImageUpload from "../common/ImageUpload";
import { Fetch, Post, Put } from "@/hooks/apiUtils";
import { FormEvent, ChangeEvent, useState, useEffect } from "react";

const RichTextEditor = dynamic(() => import("../common/RichTextEditor"), {
  ssr: false,
});

interface BlogFormProps {
  onClose?: any;
  formType: any;
  data?: BlogState;
  setFilteredData?: any;
}

interface BlogState {
  _id: string;
  title: string;
  isActive: boolean;
  image?: string;
  // categoryId?: string;
  content: string;
  tag: string;
  author: string;
  date: string;
  slug: string;
  // blogImageUrl: File | string;
}

const blogPlaceholder = {
  title: "Enter blog post title here", // Placeholder for the blog title
  isActive: true, // Placeholder for blog post active status (default to true)
  content: "Enter the full content or description of the blog post", // Placeholder for the full blog post content
  author: "Enter author",
  slug: "Enter a slug",
  date: "Enter a date",
  image: "Enter image URL or upload an image for the blog post", //
};

const BlogForm: React.FC<BlogFormProps> = (props) => {
  const data = props.data;
  // const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(
    data?._id
      ? {
          _id: data?._id ?? "",
          title: data?.title ?? "",
          isActive: data?.isActive ?? true,
          // categoryId: data?.categoryId ?? "",
          content: data?.content ?? "",
          author: data?.author ?? "",
          date: data?.date ?? "",
          slug: data?.slug ?? "",
          imageUrl: data?.image ? `${data?.image}` : "",
        }
      : {
          title: data?.title ?? "",
          isActive: data?.isActive ?? true,
          // categoryId: data?.categoryId ?? "",
          content: data?.content ?? "",
          author: data?.author ?? "",
          date: data?.date ?? "",
          slug: data?.slug ?? "",
          image: data?.image ? `${data?.image}` : "",
        }
  );

  useEffect(() => {
    // const fetchCategories = async () => {
    //   const resp: any = await Fetch("admin/blog-category/all");
    //   if (resp.success) return setCategories(resp?.data?.result);
    // };
    // fetchCategories();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value as string); // Append other data
    });

    try {
      const currentEndpoint = endpoints[props.formType];
      const url = form?._id ? currentEndpoint.update : currentEndpoint.create;

      const resp: any = form?._id
        ? await Put(`${url}${form?._id}`, formData, 5000)
        : await Post(url, formData, 5000);

      if (resp.success) {
        const response: any = await Fetch(currentEndpoint.fetchAll);
        if (response?.success) props.setFilteredData(response?.data?.result);
        else window.location.reload(); // TODO: this should be done in future
      } else return toast.error("Failed to update blog");
    } catch (error: any) {
      console.log("Failed to update blog", error);
    } finally {
      props.onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="flex flex-col col-span-2">
          <label htmlFor="title" className="mb-2 font-semibold text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            placeholder={blogPlaceholder?.title}
            onChange={handleChange}
            className="p-2 border border-gray-300 !autofill:bg-transparent rounded-lg outline-none"
          />
        </div>
        {/* <div className="flex flex-col">
          <label
            htmlFor="category"
            className="mb-2 font-semibold text-gray-700"
          >
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-lg outline-none"
          >
            <option value="">Select Blog Category</option>
            {categories &&
              categories.map((cat: { _id: string; name: string }) => {
                return (
                  <option key={cat?._id} value={cat?._id}>
                    {cat?.name}
                  </option>
                );
              })}
          </select>
        </div> */}
        <div className="flex flex-col col-span-2">
          <label htmlFor="slug" className="mb-2 font-semibold text-gray-700">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            placeholder={blogPlaceholder?.slug}
            onChange={handleChange}
            value={form.slug}
            className="p-2 border border-gray-300 !autofill:bg-transparent rounded-lg outline-none"
          />
        </div>
        <div className="flex flex-col col-span-2">
          <label htmlFor="date" className="mb-2 font-semibold text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            placeholder={blogPlaceholder?.date}
            onChange={handleChange}
            value={form.date}
            className="p-2 border border-gray-300 !autofill:bg-transparent rounded-lg outline-none"
          />
        </div>
        <div className="flex flex-col col-span-2">
          <label htmlFor="author" className="mb-2 font-semibold text-gray-700">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            placeholder={blogPlaceholder?.author}
            onChange={handleChange}
            value={form.author}
            className="p-2 border border-gray-300 !autofill:bg-transparent rounded-lg outline-none"
          />
        </div>
        <div className="flex flex-col col-span-4">
          <label htmlFor="content" className="mb-2 font-semibold text-gray-700">
            Description
            <div className="flex flex-col col-span-3">
              <RichTextEditor setData={setForm} data={form.content} />
            </div>
          </label>
        </div>
        <div className="flex flex-col col-span-4">
          <label
            htmlFor="isActive"
            className="mb-2 font-semibold text-gray-700"
          >
            Please upload a file to your server
          </label>
          <ImageUpload
            setState={setForm}
            fieldname="image"
            data={form.imageUrl}
          />
        </div>
        {/* <div className="flex flex-col col-span-2">
          <label
            htmlFor="isActive"
            className="mb-2 font-semibold text-gray-700"
          >
            Do you want to activate this blog post?
          </label>
          <ToggleButton setState={setForm} data={form.isActive} />
        </div> */}
      </div>
      <div className="flex justify-start mt-3 items-center space-x-2">
        <button
          type="submit"
          className="md:col-span-2 mt-2 py-1 bg-primary hover:bg-primary/70 transition-all duration-200 ease-linear text-white rounded-md text-lg w-fit px-3"
        >
          {form._id ? "Update" : "Save"}
          <sup>+</sup>
        </button>
        <button
          type="button"
          onClick={props.onClose}
          className="md:col-span-2 mt-2 py-1 bg-red-600 transition-all duration-200 ease-linear text-white rounded-md text-lg w-fit px-3"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BlogForm;
