// types.ts
export interface Deal {
  id: string;
  client: string;
  dealValue: string;
  dealStatus: string;
  closingDate: string;
  salesperson: string;
}

export interface CRMStats {
  revenueDataMonth: string;
  activeUsers: string;
  totalDeals: string;
  conversionRatio: string;
  revenueData: {
    month: string;
    thisYear: number;
    lastYear: number;
  }[];
  profitReport: {
    profit: string;
    revenue: string;
    expenses: string;
  };
}

export interface CRMCustomStats {
  revenueDataMonth: {
    currentMonthAmount: number;
    lastMonthAmount: number;
    totalAmount: number;
    dailyBreakdown: number[]; // Daily revenue data for the current month
  };
  revenueDataYear: {
    currentYearAmount: number;
    lastYearAmount: number;
    totalAmount: number;
    monthlyBreakdown: number[]; // Monthly revenue data for the current year
  };
  userDataMonth: {
    currentMonthUsers: number;
    lastMonthUsers: number;
    totalUsers: number;
    dailyBreakdown: number[]; // Daily user data for the current month
  };
  userDataYear: {
    currentYearUsers: number;
    lastYearUsers: number;
    totalUsers: number;
    monthlyBreakdown: number[]; // Monthly user data for the current year
  };
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FormField {
  customClasses?: any;
  name: string;
  label: string;
  type:
    | "text"
    | "label"
    | "br"
    | "button"
    | "email"
    | "password"
    | "richTextEditor"
    | "file"
    | "date"
    | "multipleFiles"
    | "select"
    | "checkbox"
    | "radio"
    | "number"
    | "textarea"
    | "choose"
    | "stringNumeric"
    | "productForm";
  value?: any;
  defaultValue?: any;
  rows?: number;
  min?: number;
  max?: number;
  minDate?: any;
  maxDate?: any;
  options?: any;
  accept?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  maxLength?: number;
  multiple?: boolean;
  isVideo?: boolean;
  required?: boolean;
  widthFull?: boolean;
  isMultiple?: boolean;
  placeholder?: string;
  confirmPlaceholder?: string;
  validation?: (value: any) => string | null;
  isDisabled?: boolean;
}
