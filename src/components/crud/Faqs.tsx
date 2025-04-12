"use client";

import { toast } from "react-toastify";
import { endpoints } from "@/data/endpoints";
import ToggleButton from "../common/ToggleButton";
import { Fetch, Post, Put } from "@/hooks/apiUtils";
import { FormEvent, ChangeEvent, useState } from "react";

interface FaqsFormProps {
  onClose?: any;
  formType: any;
  data?: FaqState;
  setFilteredData?: any;
}

interface FaqState {
  _id: string;
  url: string;
  answer: string;
  question: string;
  isActive: boolean;
}

const faqPlaceholderArray = {
  
    url: "Enter URL for the FAQ page (e.g., 'https://www.example.com/faq')", // Example URL for the FAQ page
  
  
    question: "Enter the FAQ question here (e.g., 'What is TypeScript?')", // Example question
  
  
    answer:
      "Enter the FAQ answer here (e.g., 'TypeScript is a superset of JavaScript that adds static types.')", // Example answer
  
    isActive: true, // Default value, indicating whether the FAQ is active or not
  
};

const FaqsForm: React.FC<FaqsFormProps> = (props) => {
  const data = props.data;
  const [form, setForm] = useState(
    data?._id
      ? {
          _id: data?._id ?? "",
          url: data?.url ?? "",
          answer: data?.answer ?? "",
          question: data?.question ?? "",
          isActive: data?.isActive ?? true,
        }
      : {
          url: data?.url ?? "",
          answer: data?.answer ?? "",
          question: data?.question ?? "",
          isActive: data?.isActive ?? true,
        }
  );

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
    try {
      const currentEndpoint = endpoints[props.formType];
      const url = form?._id ? currentEndpoint.update : currentEndpoint.create;

      const resp: any = form?._id
        ? await Put(`${url}${form?._id}`, form, 5000)
        : await Post(url, form, 5000);

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="flex flex-col col-span-3">
          <label htmlFor="url" className="mb-2 font-semibold text-gray-700">
            Page URL:
          </label>
          <input
            type="text"
            id="url"
            name="url"
            value={form.url}
            onChange={handleChange}
            placeholder={faqPlaceholderArray?.url}
            className="p-2 border border-gray-300 !autofill:bg-transparent rounded-lg outline-none"
          />
        </div>
        <div className="flex flex-col col-span-3">
          <label
            htmlFor="question"
            className="mb-2 font-semibold text-gray-700"
          >
            Question:
          </label>
          <input
            type="text"
            id="question"
            name="question"
            value={form.question}
            onChange={handleChange}
            placeholder={faqPlaceholderArray?.question}
            className="p-2 border border-gray-300 !autofill:bg-transparent rounded-lg outline-none"
          />
        </div>{" "}
        <div className="flex flex-col col-span-3">
          <label htmlFor="answer" className="mb-2 font-semibold text-gray-700">
            Answer:
          </label>
          <input
            type="text"
            id="answer"
            name="answer"
            value={form.answer}
            onChange={handleChange}
            placeholder={faqPlaceholderArray?.answer}
            className="p-2 border border-gray-300 !autofill:bg-transparent rounded-lg outline-none"
          />
        </div>
        <div className="flex flex-col col-span-3">
          <label
            htmlFor="isActive"
            className="mb-2 font-semibold text-gray-700"
          >
            Do you want to activate this Faq?
          </label>
          <ToggleButton setState={setForm} data={form.isActive} />
        </div>
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

export default FaqsForm;
