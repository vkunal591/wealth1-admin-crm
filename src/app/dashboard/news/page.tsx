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
  { key: "content", label: "Content", sortable: false },
  { key: "tag", label: "Tag", sortable: true },
  { key: "author", label: "Author", sortable: true },
  { key: "slug", label: "Slug", sortable: true },
  { key: "date", label: "Date", sortable: true, isDate: true },
  { key: "createdAt", label: "Date", sortable: true, isDate: true },
  { key: "updatedAt", label: "Updated At", sortable: true, isDate: true },
];

const filterOptions = [{ label: "Title", value: "title" }

];

const Users: React.FC = () => {
  const { data, loading, error } = useFetch(endpoints["News"].fetchAll);
  const updatedData = data?.data.result;
  const paginationData = data?.data?.pagination;

  const { user } = useAuth();
  const operationsAllowed = getAccessPoints(user, "Manage News");

  if (loading && !updatedData && !error) return <Loader />;

  return (
    <AuthGuard>
      <Wrapper>
        <TableComponent
          type="News"
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
