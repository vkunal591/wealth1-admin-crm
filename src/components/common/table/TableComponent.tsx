import dayjs from "dayjs";
import Actions from "./Actions";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

interface Column {
  key: string;
  label: string;
  isDate?: boolean;
  sortable?: boolean;
  isCurrency?: string;
  isBadge?: boolean;
  isActive?: boolean;
}

interface OperationsAllowed {
  manage?: boolean;
  read?: boolean;
  update?: boolean;
  delete?: boolean;
}

interface TableProps {
  sort: any;
  type: string;
  columns: Column[];
  filteredData: any;
  setSortConfig: any;
  fetchFilteredData: any;
  setManage: any;
  setData: (data: any) => void;
  setFilteredData: (data: any) => void;
  operationsAllowed: OperationsAllowed;
  setPaginate: (pagination: any) => void;
  setIsModalVisible: (isVisible: boolean) => void;
}

const Table: React.FC<TableProps> = ({
  sort,
  type,
  columns,
  setManage,
  setData,
  setPaginate,
  filteredData,
  setSortConfig,
  setFilteredData,
  setIsModalVisible,
  operationsAllowed,
  fetchFilteredData,
}) => {
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" | null = "asc";
    if (sort.key === key && sort.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    fetchFilteredData({ key, dir: direction });
  };

  const formatRowValue = (
    row: Record<string, any>,
    col: {
      key: string;
      isDate?: boolean;
      isPercent?: string;
      isCurrency?: string;
      isActive?:boolean
    }
  ) => {
    const value = row[col.key];

    if (col.key === "_id") return value?.slice(-8);
    if (col.isDate && value) return dayjs(value).format("YYYY-MM-DD");
    if (col.isCurrency && value) return `${col.isCurrency} ${value}`;
    if (col.isPercent) return `${value} ${col.isPercent}`;
    if (col.isActive) return  `${value?"Active":"isActive"}`
      
    

    if (typeof value === "number") return value;
    if (typeof value === "boolean") return value.toString();

    if (value)
      return value.toString().length > 50
        ? value.toString().slice(0, 50) + " ..."
        : value.toString();
    else return "-";
  };

  return (
    <div className="overflow-x-scroll no-scrollbar">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="whitespace-nowrap">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ maxWidth: `calc(100% / ${columns.length + 1})` }}
                className="p-4 text-gray-700 font-bold border border-gray-200 text-left cursor-pointer"
                onClick={() => col.sortable && handleSort(col.key)}
              >
                {col.label}
                {col.sortable && (
                  <>
                    {sort.key === col.key && sort.direction === "asc" ? (
                      <FaSortUp className="inline ml-2" />
                    ) : sort.key === col.key && sort.direction === "desc" ? (
                      <FaSortDown className="inline ml-2" />
                    ) : (
                      <FaSort className="inline ml-2" />
                    )}
                  </>
                )}
              </th>
            ))}
            {operationsAllowed?.read && (
              <th className="p-4 border text-left text-black border-gray-200 font-bold">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredData?.length > 0 ? (
            filteredData.map((row: any, index: number) => (
              <tr
                key={index}
                className="border text-black border-gray-200 cursor-pointer text-left"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`text-sm border whitespace-nowrap border-gray-200 px-4 py-3 ${col?.isActive || col.isBadge? "text-center":""}`}
                  >
                    {col.isBadge && (
                      <span
                        className={`${
                          col.isBadge &&
                          "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-green-500/10 ring-inset"
                        }}`}
                      >
                        {formatRowValue(row, col)}
                      </span>
                    )}
                    {col.isActive && (
                      <span
                        className={` ${
                          col.isActive && row[col.key]
                            ? "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-green-500/10 ring-inset"
                            : "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-red-600 ring-1 ring-red-500/10 ring-inset"
                        }}`}
                      >
                        {formatRowValue(row, col)}
                      </span>
                    )}
                    {(!col.isBadge && !col.isActive) && formatRowValue(row, col)}
                  </td>
                ))}
                {operationsAllowed?.read && (
                  <td className="text-nowrap border border-gray-200 px-4 py-3">
                    <Actions
                      row={row}
                      type={type}
                      setData={setData}
                      setManage={setManage}
                      setPaginate={setPaginate}
                      setFilteredData={setFilteredData}
                      setIsModalVisible={setIsModalVisible}
                      operationsAllowed={operationsAllowed}
                    />
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (operationsAllowed?.read ? 1 : 0)}
                className="text-center p-4 text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
