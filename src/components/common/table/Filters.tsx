import React from "react";
import ItemsPage from "./ItemsPage";
import DateFilter from "./DateFilter";
import SearchFilter from "./SearchFilter";
// import CustomDropdown from "./CustomDropdown";
import { FilterOption } from "@/hooks/types";

interface FiltersProps {
  endDate: string;
  startDate: string;
  searchTerm: string;
  searchKey: string;
  filterOptions: FilterOption[];
  paginate: { itemsPerPage: number };
  setEndDate: (value: string) => void;
  setStartDate: (value: string) => void;
  setSearchTerm: (value: string) => void;
  setSearchKey: (value: string) => void;
  fetchFilteredData: (params?: Record<string, any>) => void;
}

const Filters: React.FC<FiltersProps> = ({
  endDate,
  paginate,
  searchTerm,
  searchKey,
  startDate,
  setEndDate,
  setStartDate,
  setSearchTerm,
  setSearchKey,
  filterOptions,
  fetchFilteredData,
}) => {
  return (
    <div className="flex gap-5 bg-white p-5 rounded-2xl justify-between items-end mb-4">
      {/* Search Filter */}
      <SearchFilter
        searchTerm={searchTerm}
        searchKey={searchKey}
        setSearchTerm={setSearchTerm}
        setSearchKey={setSearchKey}
        filterOptions={filterOptions}
        fetchFilteredData={fetchFilteredData}
      />

      {/* <CustomDropdown
        options={[]}
        label="Status"
        selectedValue={""}
        placeholder={"Select"}
        onChange={() => {}}
        // hideDropdown={true}
      /> */}

      {/* Pagination Filter */}
      <ItemsPage fetchFilteredData={fetchFilteredData} paginate={paginate} />

      {/* Date Range Filter */}
      <DateFilter
        endDate={endDate}
        startDate={startDate}
        setEndDate={setEndDate}
        setStartDate={setStartDate}
        fetchFilteredData={fetchFilteredData}
      />
    </div>
  );
};

export default Filters;
