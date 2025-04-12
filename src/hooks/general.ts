import { userPermissions } from "@/data/permission";
import { assign } from "./polyfills";

export const formatTimestamp = (timestamp: any) => {
  const date = new Date(timestamp);

  // Convert UTC to IST (GMT+5:30)
  const options: any = {
    timeZone: "Asia/Kolkata", // IST timezone
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat("en-IN", options).format(date);

  // Split the formatted date into date and time components
  const [datePart, timePart] = formattedDate.split(", ");

  return {
    date: datePart,
    time: timePart,
  };
};

// export const formatTimestamp = (timestamp: any) => {
//   const date = new Date(timestamp);

//   // Extract date components
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
//   const day = String(date.getDate()).padStart(2, "0");

//   // Extract time components
//   let hours = date.getUTCHours();
//   const minutes = String(date.getUTCMinutes()).padStart(2, "0");

//   // Convert to 12-hour format and determine AM/PM
//   const ampm = hours >= 12 ? "PM" : "AM";
//   hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'

//   return {
//     date: `${year}-${month}-${day}`,
//     time: `${hours}:${minutes} ${ampm}`,
//   };
// };

export const getAvailableTimeSlots = (timeSlots: any) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  // Function to convert 12-hour format to 24-hour format and minutes
  const convertTo24Hour = (time: string) => {
    const [hourMinute, period] = time.split(" ");
    const [hourStr, minuteStr] = hourMinute.split(":");
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    if (period?.toLowerCase() === "pm" && hour !== 12) {
      hour += 12;
    } else if (period?.toLowerCase() === "am" && hour === 12) {
      hour = 0;
    }
    return { hour, minute };
  };

  // Filter time slots that are after the current time
  return timeSlots.filter((time: any) => {
    const { hour, minute } = convertTo24Hour(time.startTime);
    return (
      hour > currentHour || (hour === currentHour && minute > currentMinutes)
    );
  });
};

export const getAvailableSortedTimeSlots = (timeSlots: any) => {
  // Function to convert 12-hour format to 24-hour format
  const convertTo24Hour = (time: string) => {
    const [hourMinute, period] = time.split(" ");
    const [hourStr, minuteStr] = hourMinute.split(":");
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    if (period?.toLowerCase() === "pm" && hour !== 12) {
      hour += 12;
    } else if (period?.toLowerCase() === "am" && hour === 12) {
      hour = 0;
    }
    return { hour, minute };
  };

  // Sort the time slots in increasing order based on start time
  return timeSlots.sort((a: any, b: any) => {
    const { hour: hourA, minute: minuteA } = convertTo24Hour(a.startTime);
    const { hour: hourB, minute: minuteB } = convertTo24Hour(b.startTime);

    // Compare hours first, then minutes if hours are equal
    if (hourA === hourB) {
      return minuteA - minuteB;
    }
    return hourA - hourB;
  });
};

export const getFilteredslots = (data: any) => {
  const slots: any = [];
  data.map((item: any) => {
    if (!item.isBooked)
      slots.push({ startTime: item?.startTime, id: item?._id });
  });
  return slots;
};

export function formatDate(inputDate: any) {
  const date = new Date(inputDate);

  // Get the year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const day = String(date.getDate()).padStart(2, "0"); // Pad single digit days with a leading zero

  // Return in YYYY-MM-DD format
  return `${year}-${month}-${day}`;
}

export function formatTime(inputTime: any) {
  const options = {
    year: "numeric",
    weekday: "long",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return inputTime.toLocaleString("en-US", options);
}

export const makeFormattedData = (formData: any) => {
  const {
    bio,
    email,
    mobile,
    gender,
    license,
    lastName,
    panNumber,
    firstName,
    languages,
    experience,
    adharNumber,
    dateOfBirth,
    specialization,
  } = formData;
  const data = {
    bio,
    email,
    gender,
    mobile,
    license,
    lastName,
    firstName,
    panNumber,
    experience,
    adharNumber,
    dateOfBirth,
    languages: [languages],
    specialization: [specialization],
    addressDetails: {
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      country: formData.country,
      landmark: formData.landmark,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
    },
    bankDetails: {
      ifscCode: formData?.ifscCode,
      bankName: formData?.bankName,
      branchName: formData?.branchName,
      accountType: formData?.accountType,
      accountNumber: formData?.accountNumber,
      accountHolder: formData?.accountHolder,
    },
    profileImage: formData?.profileImage,
    highschoolImg: formData?.highschoolImg,
    graduationImg: formData?.graduationImg,
    intermediateImg: formData?.intermediateImg,
    postGraduationImg: formData?.postGraduationImg,
    highSchool: {
      completionYear: formData?.highSchoolcompletionYear,
      institutionName: formData?.highSchoolinstitutionName,
    },
    intermediate: {
      completionYear: formData?.intermediatecompletionYear,
      institutionName: formData?.intermediateinstitutionName,
    },
    graduation: {
      courseName: formData?.graduation,
      subject: formData?.graduatesubject,
      completionYear: formData?.graduationcompletionYear,
      institutionName: formData?.graduationinstitutionName,
    },
    postGraduation: {
      subject: formData?.postsubject,
      courseName: formData?.postgraduation,
      completionYear: formData?.postgraduationcompletionYear,
      institutionName: formData?.postgraduationinstitutionName,
    },
  };
  return data;
};

export function getFilteredDates(selectedDays: any) {
  const dayIndex: {
    Sun: number;
    Mon: number;
    Tue: number;
    Wed: number;
    Thu: number;
    Fri: number;
    Sat: number;
  } = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  // Get today's date
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0); // Reset time part

  // Get the date six months from today
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 6);
  endDate.setHours(0, 0, 0, 0); // Reset time part

  // Convert selected day names to day indexes
  const selectedIndexes = selectedDays.map(
    (day: keyof typeof dayIndex) => dayIndex[day]
  );

  // Function to check if a date should be included based on the selected day indexes
  const isDaySelected = (date: any) => selectedIndexes.includes(date.getDay());

  // Generate all dates from start to end
  const currentDate = startDate;
  const validDates = [];

  while (currentDate <= endDate) {
    if (isDaySelected(currentDate)) validDates.push(formatDate(currentDate)); // reate a new Date object to avoid mutation
    currentDate.setDate(currentDate.getDate() + 1); // Increment date by one day
  }
  return validDates;
}

function addMinutesToTime(timeStr: string, minutes: number) {
  const timeParts = timeStr.match(/(\d+):(\d+)\s(AM|PM)/);
  if (!timeParts) throw new Error("Invalid time format");

  let hours = parseInt(timeParts[1]);
  const minutesPart = parseInt(timeParts[2]);
  const ampm = timeParts[3];
  if (ampm === "PM" && hours !== 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  const date = new Date();
  date.setHours(hours, minutesPart, 0, 0); // Set hours and minutes

  date.setMinutes(date.getMinutes() + minutes);
  let updatedHours = date.getHours();
  const updatedMinutes = date.getMinutes();

  const newAmpm = updatedHours >= 12 ? "PM" : "AM";
  updatedHours = updatedHours % 12;
  updatedHours = updatedHours ? updatedHours : 12; // Hour '0' should be '12'

  const formattedMinutes =
    updatedMinutes < 10 ? `0${updatedMinutes}` : updatedMinutes;
  return `${updatedHours}:${formattedMinutes} ${newAmpm}`;
}

export function getTimeSlots(slots: any) {
  const timeSlots: any = [];
  slots.map((slot: any) =>
    timeSlots.push({
      startTime: slot,
      endTime: addMinutesToTime(slot, 30),
      isBooked: false,
      bookedBy: null,
    })
  );
  return timeSlots;
}

export const format12Hour = (time: any) => {
  const date = new Date(time);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export const getDatesBetween = (
  startDate: string,
  endDate: string
): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    throw new Error("Start date cannot be after the end date");
  }
  const datesArray: string[] = [];
  const currentDate = new Date(start);
  while (currentDate <= end) {
    datesArray.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return datesArray;
};

export const debounce = (func: any, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const getAccessPoints = (user: any, label: string) => {
  // const userPermissions = user?.permissions ?? [];
  let accessPoints: any = userPermissions.filter(
    (e: any) => e.module === label
  );
  if (accessPoints && accessPoints.length > 0)
    accessPoints = accessPoints[0]?.access;
  else accessPoints = {};

  return accessPoints;
};

export const populateFormFields = (fields: any, product: any) => {
  return fields.map((field: any) => {
    if (product.hasOwnProperty(field.name))
      return { ...field, value: product[field.name] };
    return field;
  });
};

export const populateFormData = (fields: any, product: any) => {
  const object = {};
  fields.map((field: any) => {
    if (product.hasOwnProperty(field.name)) {
      assign(object, { [field.name]: product[field.name] });
    }
  });
  return object;
};

export const updateFormData = (
  formData: FormData,
  nestedFieldKey: string,
  nestedFields: string[],
  fieldsToRemove: string[]
) => {
  const updatedFormData = new FormData();
  const nestedData: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    if (nestedFields.includes(key)) nestedData[key] = value;
    else if (!fieldsToRemove.includes(key)) updatedFormData.append(key, value);
  }
  updatedFormData.append(nestedFieldKey, JSON.stringify(nestedData));
  return updatedFormData;
};

// export const updateObjectData = (
//   formData: FormData,
//   nestedFieldKey: string,
//   nestedFields: string[],
//   fieldsToRemove: string[]
// ) => {
//   const updatedFormData = new Object();
//   // const nestedData: Record<string, any> = {};
//   // for (const [key, value] of formData.entries()) {
//   //   if (nestedFields.includes(key)) nestedData[key] = value;
//   //   else if (!fieldsToRemove.includes(key)) updatedFormData.append(key, value);
//   // }
//   // updatedFormData.append(nestedFieldKey, JSON.stringify(nestedData));
//   return updatedFormData;
// };
export const getSelectFormattedData = (data: any) => {
  const response = data.map((option: any) => ({
    label: option?._id,
    value: option?.name,
    email: option?.email,
  }));
  return response;
};

export function nestFields(
  obj: Record<string, any>,
  key: string,
  fieldsToNest: string[]
): Record<string, any> {
  const nestedObject: Record<string, any> = {};
  const updatedObject: Record<string, any> = { ...obj };

  fieldsToNest.forEach((field) => {
    if (field in updatedObject) {
      nestedObject[field] = updatedObject[field];
      delete updatedObject[field];
    }
  });
  updatedObject[key] = nestedObject;
  return updatedObject;
}

type NestedObject = {
  [key: string]: any;
};

export function removeSuffixInNestedObject(
  obj: NestedObject,
  nestedKey: string,
  suffix: string
): NestedObject {
  const nestedObj = obj[nestedKey];

  if (!nestedObj || typeof nestedObj !== "object") {
    return obj; // Return the original object if nestedKey is invalid
  }

  const updatedNestedObj = Object.entries(nestedObj).reduce(
    (acc: NestedObject, [key, value]) => {
      const newKey = key.replace(new RegExp(`${suffix}$`), ""); // Remove the suffix
      acc[newKey] = value;
      return acc;
    },
    {}
  );

  return {
    ...obj,
    [nestedKey]: updatedNestedObj, // Update the nested object
  };
}
