import { FormField } from "@/hooks/types";

export const NewsFormType: FormField[] = [
  {
    name: "title",
    type: "text",
    required: true,
    label: "Title",
    placeholder: "Enter title",
  },
  {
    name: "tag",
    type: "text",
    label: "Tag",
    placeholder: "Enter tag",
  },
  {
    name: "slug",
    type: "text",
    required: true,
    label: "Slug",
    placeholder: "Enter slug",
  },
  {
    name: "content",
    type: "textarea",
    label: "Content",
    placeholder: "Enter content",
    widthFull:true,
  },
  {
    name: "author",
    type: "text",
    required: true,
    label: "Author",
    placeholder: "Enter author name",
  },
  {
    name: "date",
    type: "date",
    required: true,
    label: "Date",
  },
  {
    name: "image",
    type: "file",
    label: "Image",
    widthFull:true
  },
];
