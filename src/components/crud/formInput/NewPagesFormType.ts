import { FormField } from "@/hooks/types";

export const NewPagesFormType: FormField[] = [
  {
    name: "title",
    type: "text",
    required: true,
    label: "Title",
    placeholder: "Enter title",
  },
  {
    name: "subTitle",
    type: "text",
    label: "Sub Title",
    placeholder: "Enter Sub Title",
  },
  {
    name: "slug",
    type: "text",
    required: true,
    label: "Slug",
    placeholder: "Enter slug",
  },
  {
    name: "description",
    type: "textarea",
    label: "Description",
    placeholder: "Enter description",
    widthFull:true,
  },

];
