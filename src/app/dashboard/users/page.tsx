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
  { key: "_id", label: "User ID" },
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email ID", sortable: true },
  { key: "isActive", label: "Active Status", sortable: true,isActive:true },
  { key: "birthDate", label: "Birth Date", sortable: true, isDate: true },
  { key: "createdAt", label: "Date", sortable: true, isDate: true },
  { key: "updatedAt", label: "Updated At", sortable: true, isDate: true },
];
const filterOptions = [
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Status", value: "status" },
];

const Users: React.FC = () => {
  const { data, loading, error } = useFetch(endpoints["User"].fetchAll);
  const updatedData = data?.data?.result;
  const paginationData = data?.data?.pagination;

  const { user } = useAuth();
  const operationsAllowed = getAccessPoints(user, "Manage Users");

  if (loading && !updatedData && !error) return <Loader />;

  return (
    <AuthGuard>
      <Wrapper>
        <TableComponent
          type="User"
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

export default Users;
