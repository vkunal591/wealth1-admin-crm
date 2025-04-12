import { FormField } from "@/hooks/types";

export const ProductsFormType: FormField[] = [
  {
    name: "name",
    type: "text",
    required: true,
    label: "Product Name",
    placeholder: "Enter product name",
  },
  {
    name: "slug",
    type: "text",
    required: true,
    label: "Slug",
    placeholder: "Enter slug",
  },
  {
    name: "price",
    type: "number",
    label: "Price",
    placeholder: "Enter price",
  },
  {
    name: "description",
    type: "textarea",
    label: "Description",
    placeholder: "Enter product description",
    widthFull: true,
  },
  {
    name: "image",
    type: "file",
    label: "Image",
    widthFull: true,
  },
];
