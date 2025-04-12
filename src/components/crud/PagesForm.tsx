"use client";

import { toast } from "react-toastify";
import { FormEvent, useState } from "react";
import { endpoints } from "@/data/endpoints";
import { Fetch, Post, Put } from "@/hooks/apiUtils";
import VideoUpload from "../common/VideoUpload";
import { appendFormData } from "@/data/cusotom";

interface PagesFormProps {
  onClose?: any;
  formType: any;
  data?: HomeFormData;
  setFilteredData?: any;
}

interface SubContent {
  title: string;
  description: string;
}

interface Section {
  title: string;
  subtitle?: string; // Make subtitle optional
  description: string;
  image?: string;
  subContents?: SubContent[];
}

interface HomeFormData {
  _id?: string;
  title: string;
  subTitle: string;
  description: string;
  videoUrl?: string;
  section1: Section;
  section2: Section;
  section3: Section;
  section4: Section;
}

const PagesForm: React.FC<PagesFormProps> = (props) => {
  const data = props.data;
  const [form, setForm] = useState<any>(
    data?._id
      ? {
          _id: data?._id ?? "",
          title: data?.title ?? "",
          subTitle: data?.subTitle ?? "",
          description: data?.description ?? "",
          videoUrl: data?.videoUrl ?? "",
          section1: data?.section1 ?? {
            title: "",
            subtitle: "",
            description: "",
            image1: "",
            subContents: [],
          },
          section2: data?.section2 ?? {
            title: "",
            subtitle: "",
            description: "",
            image2: "",
            subContents: [],
          },
          section3: data?.section3 ?? {
            title: "",
            subtitle: "",
            description: "",
            image3: "",
            subContents: [],
          },
          section4: data?.section4 ?? {
            title: "",
            subtitle: "",
            description: "",
          },
        }
      : {
          title: "",
          subTitle: "",
          description: "",
          videoUrl: "",
          section1: {
            title: "",
            subtitle: "",
            description: "",
            image1: "",
            subContents: [],
          },
          section2: {
            title: "",
            subtitle: "",
            description: "",
            image2: "",
            subContents: [],
          },
          section3: {
            title: "",
            subtitle: "",
            description: "",
            image3: "",
            subContents: [],
          },
          section4: { title: "", subtitle: "", description: "" },
        }
  );

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  //   section?: keyof Pick<
  //     HomeFormData,
  //     "section1" | "section2" | "section3" | "section4"
  //   >,
  //   field?: keyof Section
  // ) => {
  //   const { name, value } = e.target;

  //   if (section && field) {
  //     if (!["section1", "section2", "section3", "section4"].includes(section)) {
  //       console.warn(`Invalid section: ${section}`);
  //       return;
  //     }

  //     setForm((prev: any) => ({
  //       ...prev,
  //       [section]: { ...prev[section], [field]: value },
  //     }));
  //   } else {
  //     setForm((prev: any) => ({ ...prev, [name]: value }));
  //   }
  // };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: keyof Pick<
      HomeFormData,
      "section1" | "section2" | "section3" | "section4"
    >,
    field?: keyof Section
  ) => {
    const { name, value, files } = e.target as HTMLInputElement; // Ensure access to `files`
    console.log(files);
    if (section && field) {
      if (!["section1", "section2", "section3", "section4"].includes(section)) {
        console.warn(`Invalid section: ${section}`);
        return;
      }

      // Determine new value (for file uploads)
      const newValue = files && files[0] ? files[0] : value;
      setForm((prev: any) => ({
        ...prev,
        [section]: { ...prev[section], [field]: newValue }, // Correctly updates section fields
      }));
    } else {
      setForm((prev: any) => ({
        ...prev,
        [name]: value, // Updates top-level fields
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = form;
    console.log(data);
    const formData = new FormData();

    appendFormData(formData, data);
    if (
      data.videoUrl &&
      typeof data.videoUrl !== "string" &&
      data.videoUrl instanceof File
    ) {
      formData.append("videoUrl", data.videoUrl);
    }

    try {
      const currentEndpoint = endpoints[props.formType];
      const url = form._id ? currentEndpoint.update : currentEndpoint.create;
      console.log(JSON.stringify(formData));
      const resp: any = data._id
        ? await Put(`${url}${data._id}`, formData, 5000)
        : await Post(url, formData, 5000);

      if (resp.success) {
        const response: any = await Fetch(currentEndpoint.fetchAll);
        if (response?.success) props.setFilteredData(response?.data?.result);
        else window.location.reload(); // TODO: improve reload logic
      } else {
        toast.error("Failed to update course");
      }
    } catch (error: any) {
      console.log("Failed to update course", error);
    } finally {
      props.onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="flex flex-col col-span-3">
          {/* Main Fields */}
          <div className="flex flex-col mb-4">
            <label className="text-xl">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg outline-none"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="text-xl">Subtitle</label>
            <input
              type="text"
              name="subTitle"
              value={form.subTitle}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg outline-none"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label className="text-xl">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg outline-none"
            />
          </div>

          <div className="flex flex-col mb-4">
            <label
              htmlFor="sampleVideo"
              className="mb-2 font-semibold text-gray-700"
            >
              Video
            </label>
            <div className="">
              <VideoUpload
                data={form.videoUrl}
                setState={setForm}
                fieldname={"videoUrl"}
              />
            </div>
          </div>

          {/* Sections */}
          {["section1", "section2", "section3", "section4"].map(
            (section, index) => (
              <div key={section} className="mb-6 p-4 border rounded-lg">
                <h2 className="text-2xl font-semibold mb-2">{section}</h2>
                <div className="flex flex-col mb-2">
                  <label className="text-lg">Title</label>
                  <input
                    type="text"
                    value={
                      (form[section as keyof HomeFormData] as Section)?.title ||
                      ""
                    }
                    onChange={(e) =>
                      handleChange(
                        e,
                        section as
                          | "section1"
                          | "section2"
                          | "section3"
                          | "section4",
                        "title"
                      )
                    }
                    className="p-3 border border-gray-300 rounded-lg outline-none"
                  />
                </div>
                <div className="flex flex-col mb-2">
                  <label className="text-lg">Subtitle</label>
                  <input
                    type="text"
                    value={
                      (form[section as keyof HomeFormData] as Section)
                        ?.subtitle || ""
                    }
                    onChange={(e) =>
                      handleChange(
                        e,
                        section as
                          | "section1"
                          | "section2"
                          | "section3"
                          | "section4",
                        "subtitle"
                      )
                    }
                    className="p-3 border border-gray-300 rounded-lg outline-none"
                  />
                </div>
                <div className="flex flex-col mb-2">
                  <label className="text-lg">Description</label>
                  <textarea
                    value={
                      (form[section as keyof HomeFormData] as Section)
                        ?.description || ""
                    }
                    onChange={(e) =>
                      handleChange(
                        e,
                        section as
                          | "section1"
                          | "section2"
                          | "section3"
                          | "section4",
                        "description"
                      )
                    }
                    className="p-3 border border-gray-300 rounded-lg outline-none"
                  />
                </div>
                {section !== "section4" && (
                  <div className="flex flex-col mb-2">
                    <label className="text-lg">Image</label>
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0]; // Get the first selected file

                          setForm((prev: any) => ({
                            ...prev,
                            [`image${index + 1}`]: file, // Correct dynamic key syntax
                          }));
                        }
                      }}
                      name={`image${index + 1}`}
                    />
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      <div className="flex justify-start mt-3 items-center space-x-2">
        <button
          type="submit"
          className="mt-2 py-1 bg-primary text-white rounded-md text-lg px-3"
        >
          {form._id ? "Update" : "Save"}
        </button>
        <button
          type="button"
          onClick={props.onClose}
          className="mt-2 py-1 bg-red-600 text-white rounded-md text-lg px-3"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PagesForm;
