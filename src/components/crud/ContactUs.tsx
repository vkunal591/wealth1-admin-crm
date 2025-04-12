"use client";

import { toast } from "react-toastify";
import { endpoints } from "@/data/endpoints";
import { Fetch, Put } from "@/hooks/apiUtils";
import { FormEvent, ChangeEvent, useState } from "react";

interface ContactUsFormProps {
  onClose?: any;
  formType: any;
  data?: ContactUsState;
  setFilteredData?: any;
}

interface ContactUsState {
  _id: string;
  query: string;
  status: string;
  mobile: string;
  lastName: string;
  firstName: string;
  email: string;
}

const ContactUsForm: React.FC<ContactUsFormProps> = (props) => {
  const data = props.data;
  const [form, setForm] = useState({
    _id: data?._id ?? "",
    query: data?.query ?? "",
    mobile: data?.mobile ?? "",
    lastName: data?.lastName ?? "",
    firstName: data?.firstName ?? "",
    status: data?.status ?? "pending",
    email: data?.email ?? "",
  });

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
      const url = currentEndpoint.update;

      const resp: any = await Put(`${url}${form?._id}`, form, 5000);

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
      <div className="flex flex-col gap-5">
        <div className="flex flex-col">
          <label
            htmlFor="firstName"
            className="mb-2 font-semibold text-gray-700"
          >
            Sender Name
          </label>
          {form?.firstName} {form?.lastName}
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 font-semibold text-gray-700">
            sender Email
          </label>
          {form?.email}
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 font-semibold text-gray-700">
            Sender Mobile
          </label>
          {form?.mobile}
        </div>
        <div className="flex flex-col col-span-3">
          <label htmlFor="query" className="mb-2 font-semibold text-gray-700">
            Query
          </label>
          {form?.query}
        </div>
      </div>

      <div className="flex mt-2 flex-col">
        <label htmlFor="status" className="mb-2 font-semibold text-gray-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          required
          value={form.status}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-lg outline-none"
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
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

export default ContactUsForm;
