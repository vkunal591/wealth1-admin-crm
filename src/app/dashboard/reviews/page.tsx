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
  { key: "userName", label: "User Name" },
  { key: "courseName", label: "Course Name" },
  { key: "stars", label: "Rating", sortable: true },
  { key: "comment", label: "Comment", sortable: true },
  { key: "isActive", label: "Active Status", sortable: true ,isActive:true},
  { key: "createdAt", label: "Date", sortable: true, isDate: true },
];

const filterOptions = [{ label: "comment", value: "comment" }];

const Users: React.FC = () => {
  const { data, loading, error } = useFetch(endpoints["Review"].fetchAll);
  const updatedData = data?.data.result;
  const paginationData = data?.data?.pagination;

  const { user } = useAuth();
  const operationsAllowed = getAccessPoints(user, "Manage Reviews");

  if (loading && !updatedData && !error) return <Loader />;

  return (
    <AuthGuard>
      <Wrapper>
        <TableComponent
          type="Review"
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
