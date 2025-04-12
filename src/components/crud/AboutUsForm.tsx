"use client";

import { toast } from "react-toastify";
import { FormEvent, ChangeEvent, useState, useEffect } from "react";
import { GrAdd, GrTrash } from "react-icons/gr";
import { endpoints } from "@/data/endpoints";
import { Fetch, Post, Put } from "@/hooks/apiUtils";
import ImageUpload from "../common/ImageUpload";

interface AboutUsFormProps {
  onClose?: any;
  formType: any;
  data?: AboutUsState;
  setFilteredData?: any;
}

interface AboutUsState {
  _id?: string;
  name?: string;
  sections: {
    title: string;
    subTitle: string;
    paragraphs: string[];
    imageUrl: string;
    order: number;
    imageAlign: "left" | "right" | "centre";
  }[];
}

const aboutUsPlaceholder = {
  name: "Enter the page title (e.g., About Us)",
  sections: [
    {
      title: "Enter section title",
      subTitle: "Enter section subtitle",
      paragraphs: ["Enter paragraph text"],
      imageUrl: "Enter image URL",
      order: 1,
      imageAlign: "left",
    },
  ],
};

const AboutUsForm: React.FC<AboutUsFormProps> = (props) => {
  const data = props.data;
  const [, setSubmitting] = useState(false);
  // const [form, setForm] = useState<AboutUsState>({
  //   _id: data?._id ?? "", // default empty string if undefined
  //   name: data?.name ?? "", // default empty string if undefined
  //   sections: data?.sections ?? [
  //     {
  //       title: "",
  //       subTitle: "",
  //       paragraphs: [""],
  //       imageUrl: "",
  //       order: 1,
  //       imageAlign: "left",
  //     },
  //   ], // default empty sections if undefined
  // });

  // useEffect(() => {
  //   if (props.data) {
  //     setForm({
  //       _id: props.data._id ?? "",
  //       name: props.data.name ?? "",
  //       sections: props.data.sections?.map((section) => ({
  //         title: section.title ?? "",
  //         subTitle: section.subTitle ?? "",
  //         paragraphs: section.paragraphs ?? [""],
  //         imageUrl: section.imageUrl ?? "",
  //         order: section.order ?? 1,
  //         imageAlign: section.imageAlign ?? "left",
  //       })) ?? [
  //         {
  //           title: "",
  //           subTitle: "",
  //           paragraphs: [""],
  //           imageUrl: "",
  //           order: 1,
  //           imageAlign: "left",
  //         },
  //       ],
  //     });
  //   }
  // }, [props.data]);

  const [form, setForm] = useState<AboutUsState>({
    _id: data?._id ?? "",
    name: data?.name ?? "",
    sections: data?.sections?.map((section) => ({
      title: section.title ?? "",
      subTitle: section.subTitle ?? "",
      paragraphs: section.paragraphs ?? [""],
      imageUrl: section.imageUrl ?? "",
      order: section.order ?? 1,
      imageAlign: section.imageAlign ?? "left",
    })) ?? [
      {
        title: "",
        subTitle: "",
        paragraphs: [""],
        imageUrl: "",
        order: 1,
        imageAlign: "left",
      },
    ],
  });

  useEffect(() => {
    if (props.data) {
      setForm({
        _id: props.data._id ?? "",
        name: props.data.name ?? "",
        sections: props.data.sections?.map((section) => ({
          title: section.title ?? "",
          subTitle: section.subTitle ?? "",
          paragraphs: section.paragraphs ?? [""],
          imageUrl: section.imageUrl ?? "",
          order: section.order ?? 1,
          imageAlign: section.imageAlign ?? "left",
        })) ?? [
          {
            title: "",
            subTitle: "",
            paragraphs: [""],
            imageUrl: "",
            order: 1,
            imageAlign: "left",
          },
        ],
      });
    }
  }, [props.data]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: "",
          subTitle: "",
          paragraphs: [""],
          imageUrl: "",
          order: prev.sections?.length + 1,
          imageAlign: "left",
        },
      ],
    }));
  };

  const deleteSection = (index: number) => {
    const updatedSections = form.sections.filter((_, idx) => idx !== index);
    setForm((prev) => ({ ...prev, sections: updatedSections }));
  };

  const updateSection = (
    index: number,
    key: keyof AboutUsState["sections"][number],
    value: string | string[]
  ) => {
    const updatedSections = [...(form.sections || [])]; // Ensure it's an array
    updatedSections[index] = { ...updatedSections[index], [key]: value };
    setForm((prev) => ({ ...prev, sections: updatedSections }));
  };

  const createFormData = (form: AboutUsState) => {
    const formData = new FormData();

    // Append the main form fields
    if (form._id) formData.append("_id", form._id); // Include if updating
    formData.append("name", form.name || ""); // Fallback to empty string

    // Append sections
    form.sections.forEach((section, index) => {
      formData.append(`sections[${index}][title]`, section.title || "");
      formData.append(`sections[${index}][subTitle]`, section.subTitle || "");
      formData.append(
        `sections[${index}][paragraphs]`,
        JSON.stringify(section.paragraphs || [""])
      );
      formData.append(`sections[${index}][imageUrl]`, section.imageUrl || "");
      formData.append(`sections[${index}][order]`, section.order.toString());
      formData.append(
        `sections[${index}][imageAlign]`,
        section.imageAlign || "left"
      );
    });
    console.log(formData);
    return formData;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const url = form?._id
        ? `${endpoints["AboutUs"].update}/${form?._id}`
        : endpoints["AboutUs"].create;

      setSubmitting(true);
      const formData = createFormData(form);
      const response: any = form?._id
        ? await Put(url, formData)
        : await Post(url, formData);

      if (response.success) {
        const fetchUrl = `${endpoints["AboutUs"].fetchAll}`;
        const resp: any = await Fetch(fetchUrl, {}, 5000, true, false);
        if (resp?.success) props?.setFilteredData(resp?.data?.result);
      } else return toast.error("Something went wrong!");
    } catch (error) {
      console.log("Error: ", error);
      //   return toast.error("Something went wrong!");d
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4  rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="flex flex-col col-span-3">
          <label htmlFor="name" className="mb-2  text-gray-700">
            Page Title (e.g., About Us)
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder={aboutUsPlaceholder.name}
            value={form.name || ""}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-lg outline-none"
          />
        </div>

        <div className="flex flex-col col-span-3">
          <label className="mb-2  text-gray-700">Sections</label>
          {form.sections.map((section, index) => (
            <div key={index} className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col mb-2">
                  <label htmlFor={`title-${index}`} className="">
                    Section Title
                  </label>
                  <input
                    type="text"
                    id={`title-${index}`}
                    name={`title-${index}`}
                    value={section.title || ""}
                    onChange={(e) =>
                      updateSection(index, "title", e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded-lg outline-none"
                  />
                </div>

                <div className="flex flex-col mb-2">
                  <label htmlFor={`subTitle-${index}`} className="">
                    Section Subtitle
                  </label>
                  <input
                    type="text"
                    id={`subTitle-${index}`}
                    name={`subTitle-${index}`}
                    value={section.subTitle || ""}
                    onChange={(e) =>
                      updateSection(index, "subTitle", e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col mb-2">
                <label htmlFor={`paragraphs-${index}`} className="">
                  Paragraphs
                </label>
                <textarea
                  id={`paragraphs-${index}`}
                  name={`paragraphs-${index}`}
                  value={(section.paragraphs || [""]).join("\n")} // Fallback to empty string
                  onChange={(e) =>
                    updateSection(
                      index,
                      "paragraphs",
                      e.target.value.split("\n")
                    )
                  }
                  rows={3}
                  className="p-2 border border-gray-300 rounded-lg outline-none"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-2">
                <div className="flex flex-col md:w-1/2">
                  <label htmlFor={`imageUrl-${index}`} className="">
                    Order
                  </label>
                  <input
                    type="text"
                    id={`order-${index}`}
                    name={`order-${index}`}
                    value={section.order || ""}
                    onChange={(e) =>
                      updateSection(index, "order", e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded-lg outline-none"
                  />
                </div>

                <div className="flex flex-col md:w-1/2">
                  <label htmlFor={`imageAlign-${index}`} className="">
                    Image Alignment
                  </label>
                  <select
                    id={`imageAlign-${index}`}
                    name={`imageAlign-${index}`}
                    value={section.imageAlign || "left"}
                    onChange={(e) =>
                      updateSection(index, "imageAlign", e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded-lg outline-none"
                  >
                    <option value="" selected>
                      Select Align
                    </option>
                    <option value="left" selected>
                      Left
                    </option>
                    <option value="right">Right</option>
                    <option value="centre">Centre</option>
                  </select>
                </div>
              </div>
              <ImageUpload
                data={section.imageUrl}
                setState={(imageUrl: any) => {
                  console.log(imageUrl);
                  setForm((prev) => ({
                    ...prev,
                    sections: prev.sections.map((sec, idx) =>
                      idx === index ? { ...sec, imageUrl } : sec
                    ),
                  }));
                }}
                fieldname={`imageUrl`}
              />
              <button
                type="button"
                onClick={() => deleteSection(index)}
                className="mt-3 text-red-500 flex justify-center items-center"
              >
                <GrTrash width={16} height={16} className="mr-1" /> Remove
                Section
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSection}
            className="mt-3 py-2 w-fit flex justify-center items-center  bg-primary text-white rounded-md text-sm px-3"
          >
            <GrAdd width={16} height={16} className="mr-2" />
            Add Section
          </button>
        </div>
      </div>

      <div className="flex justify-start mt-3 items-center space-x-2">
        <button
          type="submit"
          className="mt-2 py-1 bg-primary text-white rounded-md text-lg px-3"
          onClick={() => createFormData(form)}
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

export default AboutUsForm;
