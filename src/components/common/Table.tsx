"use client";

import dayjs from "dayjs";
import Modal from "./Modal";
import Header from "./table/Header";
import Filters from "./table/Filters";
import FormRenderer from "./FormRender";
import NoDataFound from "./NoDataFound";
import { Fetch } from "@/hooks/apiUtils";
import Table from "./table/TableComponent";
import Pagination from "./table/Pagination";
import { endpoints } from "@/data/endpoints";
import React, { useState, useEffect } from "react";

interface TableColumn {
  key: string;
  label: string;
  isDate?: boolean;
  sortable?: boolean;
  filterable?: boolean;
}

interface TableProps {
  data: any;
  type?: any;
  suffix?: string;
  filterOptions?: any;
  columns: TableColumn[];
  operationsAllowed: any;
  pagination_data?: Pagination;
}

interface Pagination {
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
}

const TableComponent = <T extends { [key: string]: any }>({
  data,
  type,
  suffix,
  columns,
  filterOptions,
  pagination_data,
  operationsAllowed,
}: TableProps) => {
  const [manage, setManage] = useState(false);
  const [paginate, setPaginate] = useState<Pagination>({
    totalPages: pagination_data?.totalPages ?? 1,
    totalItems: pagination_data?.totalItems ?? 0,
    currentPage: pagination_data?.currentPage ?? 1,
    itemsPerPage: pagination_data?.itemsPerPage ?? 10,
  });
  const [activeStatus, setActiveStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sort, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "",
    direction: null,
  });
  const [formData, setData] = useState<any>({});
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formConfig, setFormConfig] = useState<any>("");
  const [organisationId, setOrganisationId] = useState<any>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<Array<T>>(data ?? []);

  const handleCloseModal = () => {
    setFormConfig("");
    setManage(false)
    setIsModalVisible(false);
  };

  const handleReset = async () => {
    setEndDate("");
    setStartDate("");
    setSearchTerm("");
    setSearchKey("");
    setOrganisationId("");
    setActiveStatus("all");
    await fetchFilteredData({
      limit: 10,
      page: 1,
      end: "",
      start: "",
      sortkey: "",
      sortdir: "",
      status: "all",
    });
  };

  const fetchFilteredData = async (filterParams?: any) => {
    const data = {
      searchTerm: filterParams?.searchTerm ?? searchTerm,
      end: filterParams?.end ?? endDate,
      sortkey: filterParams?.key ?? sort.key,
      start: filterParams?.start ?? startDate,
      sortdir: filterParams?.dir ?? sort.direction,
      status: filterParams?.status ?? activeStatus,
      current: filterParams?.page ?? paginate.currentPage,
      limit: filterParams?.limit ?? paginate.itemsPerPage,
      orgId: filterParams?.organisationId ?? "",
    };

    setPaginate({
      ...paginate,
      currentPage: data.current,
      itemsPerPage: data.limit,
    });
    const params: any = { page: data.current, limit: data.limit };

    if (searchTerm && searchTerm.length > 3)
      Object.assign(params, { search: searchTerm, searchkey: searchKey });
    if (activeStatus !== "all" && data?.status !== "all")
      Object.assign(params, {
        status: data?.status ? data.status : activeStatus,
      });

    if (organisationId || data?.orgId)
      Object.assign(params, { orgId: data?.orgId ?? organisationId });
    if (startDate || data?.start)
      Object.assign(params, {
        startDate: dayjs(data?.start ?? startDate).format("YYYY-MM-DD"),
      });
    if (endDate || data?.end)
      Object.assign(params, {
        endDate: dayjs(data?.end ?? endDate).format("YYYY-MM-DD"),
      });

    if (sort.key || data?.sortkey)
      Object.assign(params, {
        sortkey: data?.sortkey ?? sort.key,
        sortdir: data?.sortdir ?? sort.direction,
      });

    const fetchEndpoint = endpoints[type]?.fetchAll;
    if (fetchEndpoint) {
      const response: any = await Fetch(
        `${fetchEndpoint}`,
        params,
        5000,
        true,
        false
      );
      if (response?.success) {
        setFilteredData(response?.data?.result || []);
        setPaginate(response?.data?.pagination);
      }
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      document.body.style.overflow = "hidden"; // prevent overflow
    } else document.body.style.overflow = "scroll";
  }, [isModalVisible]);

  const handleAdd = () => {
    setData({ name });
    setIsModalVisible(true);
  };

  if (filteredData.length === 0 && !isModalVisible)
    return (
      <NoDataFound
        type={type}
        handleAdd={handleAdd}
        handleReset={handleReset}
        operationsAllowed={operationsAllowed}
      />
    );

  return (
    <>
      {/* Modals */}
      <Modal
        formtype={
          formConfig
            ? ""
            : formData._id
            ? (type !== "Order" ? "Edit " : "View ") + type + (manage? " Content":"")
            : "Add " + type +  (manage? " Content":"")
        }
        isVisible={isModalVisible}
        onClose={handleCloseModal}
      >
        {type && formData && (
          <FormRenderer
            data={formData}
            manage={manage}
            setPaginate={setPaginate}
            onClose={handleCloseModal}
            setFilteredData={setFilteredData}
            formType={formConfig ? formConfig : type}
          />
        )}
      </Modal>

      {/* Header */}
      <Header
        type={type}
        suffix={suffix}
        handleAdd={handleAdd}
        handleReset={handleReset}
        filteredData={filteredData}
        operationsAllowed={operationsAllowed}
      />

      <div className="py-5">
        {/* Search and Filters */}
        <Filters
          endDate={endDate}
          paginate={paginate}
          startDate={startDate}
          searchTerm={searchTerm}
          searchKey={searchKey}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
          filterOptions={filterOptions}
          setSearchTerm={setSearchTerm}
          setSearchKey={setSearchKey}
          fetchFilteredData={fetchFilteredData}
        />

        {/* Table */}
        <Table
          sort={sort}
          type={type}
          columns={columns}
          setData={setData}
          setManage={setManage}
          setPaginate={setPaginate}
          filteredData={filteredData}
          setSortConfig={setSortConfig}
          setFilteredData={setFilteredData}
          setIsModalVisible={setIsModalVisible}
          operationsAllowed={operationsAllowed}
          fetchFilteredData={fetchFilteredData}
        />

        {/* Pagination */}
        <Pagination paginate={paginate} fetchFilteredData={fetchFilteredData} />
      </div>
    </>
  );
};

export default TableComponent;
