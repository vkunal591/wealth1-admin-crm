export const cleanRowData = (data: any): any => {
  if (typeof data !== "object" || data === null) return data;

  // Remove unwanted fields at the current level
  const { createdAt, updatedAt, deletedAt, ...cleanedData } = data;
  console.log(createdAt, updatedAt, deletedAt);
  // Recursively clean all nested objects (like section1, section2, etc.)
  for (const key in cleanedData) {
    if (typeof cleanedData[key] === "object" && cleanedData[key] !== null) {
      cleanedData[key] = cleanRowData(cleanedData[key]); // Recursion for deep cleaning
    }
  }

  return cleanedData;
};

export const appendFormData = (
  formData: FormData,
  data: any,
  parentKey = ""
) => {
  if (data instanceof File) {
    formData.append(parentKey, data); // Append file directly
  } else if (typeof data === "object" && data !== null) {
    Object.entries(data).forEach(([key, value]) => {
      const newKey = parentKey ? `${parentKey}[${key}]` : key; // Handle nested keys
      appendFormData(formData, value, newKey);
    });
  } else {
    formData.append(parentKey, data as string);
  }
};
