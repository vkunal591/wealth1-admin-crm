"use client";

import useFetch from "@/hooks/useFetch";
import { endpoints } from "@/data/endpoints";
import AuthGuard from "@/components/AuthGuard";
import Loader from "@/components/common/Loader";
import { useAuth } from "@/context/AuthContext";
import Wrapper from "@/components/common/Wrapper";
import { getAccessPoints } from "@/hooks/general";
import TableComponent from "@/components/common/Table";

const columns = [
  { key: "_id", label: "Employee ID" },
  { key: "title", label: "Title", sortable: true },
  { key: "subTitle", label: "Sub Title", sortable: true },
  { key: "description", label: "Description", sortable: true },
  { key: "isActive", label: "Active Status", sortable: true, isActive: true },
  { key: "createdAt", label: "Date", sortable: true, isDate: true },
  { key: "updatedAt", label: "Last Updated", sortable: true, isDate: true },
];

const filterOptions = [
  { label: "Title", value: "title" },
  { label: "Sub Title", value: "subTitle" },
  { label: "Status", value: "isActive" },
];

const Banners: React.FC = () => {
  const { data, loading, error } = useFetch(endpoints["Banners"].fetchAll);
  const updatedData = data?.data.result;
  const paginationData = data?.data?.pagination;

  const { user } = useAuth();
  const operationsAllowed = getAccessPoints(user, "Manage Banners");

  if (loading && !updatedData && !error) return <Loader />;

  return (
    <AuthGuard>
      <Wrapper>
        <TableComponent
          type="Banners"
          columns={columns}
          data={updatedData}
          filterOptions={filterOptions}
          pagination_data={paginationData}
          operationsAllowed={operationsAllowed}
        />
      </Wrapper>
    </AuthGuard>
  );
};

export default Banners;
