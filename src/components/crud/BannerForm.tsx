

"use client";

import { toast } from "react-toastify";
import { FormEvent, ChangeEvent, useState } from "react";
import { endpoints } from "@/data/endpoints";
import { Fetch, Post, Put } from "@/hooks/apiUtils";
import ImageUpload from "../common/ImageUpload";
import ToggleButton from "../common/ToggleButton";

interface BannersFormProps {
  onClose?: any;
  formType: any;
  data?: BannersState;
  setFilteredData?: any;
}

interface BannersState {
  _id?: string;
  title: string;
  subTitle: string;
  description: string;
  image: string;
  isActive: boolean;
}

const BannersForm: React.FC<BannersFormProps> = (props) => {
  const data = props.data;
  const [form, setForm] = useState(
    data?._id
      ? {
          _id: data?._id ?? "",
          title: data?.title ?? "",
          subTitle: data?.subTitle ?? "",
          description: data?.description ?? [""],
          image: data?.image ?? "",
          isActive: data?.isActive ?? "",
        }
      : {
          title: data?.title ?? "",
          subTitle: data?.subTitle ?? "",
          description: data?.description ?? [""],
          image: data?.image ?? "",
          isActive: data?.isActive ?? false,
        }
  );

  console.log(form?.image)
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    try {
      const currentEndpoint = endpoints[props.formType];
      const url = form._id ? currentEndpoint.update : currentEndpoint.create;

      const resp: any = form._id
        ? await Put(`${url}${form._id}`, formData, 5000)
        : await Post(url, formData, 5000);

      if (resp.success) {
        const response: any = await Fetch(currentEndpoint.fetchAll);
        if (response?.success) props.setFilteredData(response?.data?.result);
        else window.location.reload(); // TODO: improve reload logic
      } else {
        toast.error("Failed to update banners");
      }
    } catch (error: any) {
      console.log("Failed to update banners", error);
    } finally {
      props.onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="flex flex-col col-span-3">
          <div className=" p-3 mb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col mb-2">
                <label htmlFor={`title`} className="">
                  Title
                </label>
                <input
                  type="text"
                  id={`title`}
                  name={`title`}
                  value={form?.title || ""}
                  onChange={(e) => handleChange(e)}
                  className="p-2 border border-gray-300 rounded-lg outline-none"
                />
              </div>

              <div className="flex flex-col mb-2">
                <label htmlFor={`subTitle`} className="">
                  Sub Title
                </label>
                <input
                  type="text"
                  id={`subTitle`}
                  name={`subTitle`}
                  value={form?.subTitle || ""}
                  onChange={(e) => handleChange(e)}
                  className="p-2 border border-gray-300 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col mb-2">
              <label htmlFor={`description`} className="">
                Description
              </label>
              <textarea
                id={`description`}
                name={`description`}
                value={form?.description || [""]} // Fallback to empty string
                onChange={(e) => handleChange(e)}
                rows={3}
                className="p-2 border border-gray-300 rounded-lg outline-none"
              />
            </div>
          </div>

          {/* Removed dynamic section adding button */}
        </div>
      </div>
      <ImageUpload
        data={form.image}
        setState={setForm}
        fieldname={"image"}
      />
      <div className="flex flex-col col-span-2 mt-2">
        <label htmlFor="isActive" className="mb-2 font-semibold text-gray-700">
          Do you want to activate this banner post?
        </label>
        <ToggleButton setState={setForm} data={form.isActive} />
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

export default BannersForm;
