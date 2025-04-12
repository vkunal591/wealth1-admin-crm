import Button from "./Button";
import Date from "../input/Date";
import Text from "../input/Text";
import Email from "../input/Email";
import Radio from "../input/Radio";
import Number from "../input/Number";
import Select from "../input/Select";
import React, { useState } from "react";
import Checkbox from "../input/Checkbox";
import Password from "../input/Password";
import TextArea from "../input/TextArea";
import { FormField } from "@/hooks/types";
import ToggleButton from "../input/Toggle";
import RichTextEditor from "./RichTextEditor";
import NumericStringInput from "../input/NumericString";
import SingleImageUploader from "../input/ImageUploader";
import SingleVideoUploader from "../input/VideoUploader";
import MultipleImageUpload from "../input/MultipleImageUploader";
import MultipleVideoUpload from "../input/MultipleVideoUploader";

interface DynamicFormProps {
  onClose: any;
  formData?: any;
  makeApiCall?: any;
  setFormData?: any;
  submitting: boolean;
  fields?: FormField[];
  returnAs?: "object" | "formData";
  formType?: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onClose,
  returnAs,
  formData,
  submitting,
  setFormData,
  makeApiCall,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const handleInputChange = (e: any) => {
    const { name, type, value, checked, options, multiple, files } = e.target;
    if (multiple) {
      const selectedOptions = Array.from(options)
        .filter((option: any) => option.selected)
        .map((option: any) => option.value);
      setFormData((prev: any) => ({ ...prev, [name]: selectedOptions }));
    } else if (type === "file") {
      if (files) {
        const newFiles = Array.from(files);
        setFormData((prev: any) => ({
          ...prev,
          [name]: prev[name] ? [...prev[name], ...newFiles] : newFiles, // Append new files to existing files
        }));
      }
    } else
      setFormData((prev: any) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
  };
  const validateForm = () => {
    let valid = true;
    const newErrors: { [key: string]: string | null } = {};

    if (!fields) return;

    fields.forEach((field) => {
      const value = formData[field.name];

      if (field.required && !value) {
        newErrors[field.name] = `${field.label} is required`;
        valid = false;
      }

      if (field.validation && value) {
        const error = field.validation(value);
        if (error) {
          newErrors[field.name] = error;
          valid = false;
        }
      }
    });
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (returnAs === "formData") {
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
          const value = formData[key];
          if (value instanceof File || Array.isArray(value)) {
            if (Array.isArray(value))
              value.forEach((file) => data.append(key, file));
            else data.append(key, value);
          } else data.append(key, String(value));
        });
        console.log(returnAs)

        // if (formType === "Employee" && !formData["isActive"]) {
        //   data.append("isActive", "false");
        // }

        // if (formType === "User" && !formData["isActive"]) {
        //   data.append("isActive", "true");
        // }
        makeApiCall(data);
      } else makeApiCall(formData);
    }
  };
  console.log(fields);

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-5">
      {fields &&
        fields.length > 0 &&
        fields.map((field: FormField) => (
          <div
            key={field.name}
            className={`flex flex-col ${field?.widthFull && "col-span-3"} ${
              field?.type === "textarea" && "col-span-2"
            } ${field?.type === "password" && "col-span-2"}`}
          >
            {field.type === "br" && (
              <h2 className="text-2xl uppercase tracking-tighter my-3 py-2 bg-primary text-white font-bold text-center">
                {field?.label}
              </h2>
            )}

            {field.type === "select" && (
              <Select
                field={{ ...field, value: formData[field?.name] || "" }}
                handleInputChange={handleInputChange}
              />
            )}

            {field.type === "label" && (
              <div key={field.label}>
                <label
                  className="font-semibold text-gray-700"
                  htmlFor={field?.name}
                >
                  {field?.label}
                </label>
              </div>
            )}

            <div className="flex flex-col">
              {field.type === "label" && (
                <label className="block text-lg font-semibold text-gray-700 underline w-full mt-4">
                  {field.label}
                </label>
              )}
            </div>

            {field.type === "radio" && (
              <Radio field={field} handleInputChange={handleInputChange} />
            )}

            {field.type === "checkbox" && (
              <Checkbox field={field} handleInputChange={handleInputChange} />
            )}

            {field.type === "email" && (
              <Email
                field={{ ...field, value: formData[field?.name] || "" }}
                handleInputChange={handleInputChange}
              />
            )}

            {field.type === "text" && (
              <Text
                field={{ ...field, value: formData[field?.name] || "" }}
                handleInputChange={handleInputChange}
              />
            )}

            {field.type === "textarea" && (
              <TextArea
                field={{ ...field, value: formData[field?.name] || "" }}
                handleInputChange={handleInputChange}
              />
            )}

            {field.type === "choose" && (
              <ToggleButton
                field={{
                  ...field,
                  value: formData[field?.name] || field.value || false,
                }}
                setState={setFormData}
              />
            )}

            {field.type === "number" && (
              <Number
                field={{ ...field, value: formData[field?.name] || "" }}
                handleInputChange={handleInputChange}
              />
            )}
            {field.type === "button" && (
              <Button
                text={field.label}
                type="button"
                classes="bg-red-500 w-1/5 text-white rounded-xl hover:bg-red-700"
              />
            )}

            {field.type === "date" && (
              <Date
                field={{ ...field, value: formData[field?.name] || "" }}
                handleInputChange={handleInputChange}
              />
            )}

            {field.type === "stringNumeric" && (
              <NumericStringInput
                field={{ ...field, value: formData[field?.name] || "" }}
                handleInputChange={handleInputChange}
              />
            )}

            {field?.type === "richTextEditor" && (
              <RichTextEditor
                data={formData[field?.name] || ""}
                setData={setFormData}
              />
            )}
            {field.type === "password" && (
              <Password
                field={{ ...field, value: formData[field?.name] || "" }}
                handleInputChange={handleInputChange}
              />
            )}

            {field.type === "file" && !field.multiple && !field?.isVideo && (
              <SingleImageUploader
                field={{ ...field, value: formData[field?.name] || undefined }}
                setFormData={setFormData}
              />
            )}

            {field.type === "file" && field.multiple && !field?.isVideo && (
              <MultipleImageUpload
                setFormData={setFormData}
                field={{ ...field, value: formData[field?.name] }}
              />
            )}

            {field.type === "file" && !field.multiple && field?.isVideo && (
              <SingleVideoUploader field={field} setFormData={setFormData} />
            )}

            {field.type === "file" && field.multiple && field?.isVideo && (
              <MultipleVideoUpload field={field} setFormData={setFormData} />
            )}

            {errors[field.name] && (
              <span className="text-red-500 text-sm mt-1">
                {errors[field.name]}
              </span>
            )}
          </div>
        ))}

      <div className="col-span-3 flex justify-end space-x-2">
        <Button
          text="Submit"
          type="submit"
          isLoading={submitting}
          classes="bg-primary w-1/5 py-3 text-white text-xl rounded-xl"
        />
        <Button
          text="Cancel"
          type="button"
          onClick={onClose}
          classes="bg-red-500 w-1/5 py-3 text-white rounded-xl text-xl hover:bg-red-700"
        />
      </div>
    </form>
  );
};

export default DynamicForm;
