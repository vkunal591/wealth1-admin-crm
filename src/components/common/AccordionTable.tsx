import dayjs from "dayjs";
import React, { useState } from "react";
import { Fetch } from "@/hooks/apiUtils";
import { FaFilter } from "react-icons/fa";
import { bigShoulders } from "@/font/font";
import { endpoints } from "@/data/endpoints";
import GenerateExcelButton from "./GenerateExcel";
import { formatTimestamp } from "../../hooks/general";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface Transaction {
  id: string;
  username: string;
  date: string;
  time: string;
  amount: number;
  paymentMethod: string;
  status: string;
  details: {
    merchant: string;
    cardType: string;
    cardLast4: string;
    transactionId: string;
    description: string;
  };
}

interface Pagination {
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
}

interface AccordionTableProps {
  transactions: Transaction[];
  pagination_data: any;
  operationsAllowed?: any;
}

const AccordionTable: React.FC<AccordionTableProps> = ({
  transactions,
  pagination_data,
}) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [paginate, setPaginate] = useState<Pagination>({
    totalPages: pagination_data?.totalPages ?? 1,
    totalItems: pagination_data?.totalItems ?? 0,
    currentPage: pagination_data?.currentPage ?? 1,
    itemsPerPage: pagination_data?.itemsPerPage ?? 10,
  });
  const [activeStatus, setActiveStatus] = useState<
    "captured" | "pending" | "failed" | "initiated" | "cancelled"
  >();
  const sort = {
    key: "",
    direction: null,
  };
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(transactions ?? []);

  const toggleAccordion = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleActiveStatus = (activeStatus: any) => {
    setActiveStatus(activeStatus);
    if (activeStatus === "captured") return handleReset();
    fetchFilteredData({ status: activeStatus });
  };
  const handleReset = async () => {
    setEndDate("");
    setStartDate("");
    setSearchTerm("");
    setActiveStatus("initiated");
    await fetchFilteredData({
      limit: 10,
      page: 1,
      end: "",
      start: "",
      sortkey: "",
      sortdir: "",
      status: "captured",
    });
  };

  const debounce = (func: any, delay: number) => {
    let timeoutId: NodeJS.Timeout | null = null;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const fetchFilteredData = async (filterParams?: any) => {
    const data = {
      end: filterParams?.end ?? endDate,
      sortkey: filterParams?.key ?? sort.key,
      start: filterParams?.start ?? startDate,
      sortdir: filterParams?.dir ?? sort.direction,
      status: filterParams?.status ?? activeStatus,
      current: filterParams?.page ?? paginate?.currentPage,
      limit: filterParams?.limit ?? paginate?.itemsPerPage,
    };

    if (data.current * data.limit === paginate?.totalItems) {
      setPaginate({
        ...paginate,
        currentPage: data.current,
        itemsPerPage: data.limit,
      });
      return;
    }
    // if (
    //   (data.current === 1 && 2 * paginate?.totalItems < data.limit) ||
    //   (data.current - 1 !== 0 &&
    //     (data?.current - 1) * data?.limit > paginate?.totalItems)
    // ) {
    //   setPaginate({
    //     ...paginate,
    //     currentPage: data?.current,
    //     itemsPerPage: paginate?.itemsPerPage,
    //   });
    //   return toast.info(`Only ${paginate?.totalItems} Documents available!`);
    // }

    setPaginate({
      ...paginate,
      currentPage: data.current,
      itemsPerPage: data.limit,
    });
    const params: any = { page: data.current, limit: data.limit };

    if (searchTerm && searchTerm.length > 3)
      Object.assign(params, { search: searchTerm });
    if (data?.status)
      Object.assign(params, {
        status: data?.status ? data.status : activeStatus,
      });

    if (startDate || data?.start)
      Object.assign(params, {
        start: dayjs(data?.start ?? startDate).format("YYYY-MM-DD"),
      });
    if (endDate || data?.end)
      Object.assign(params, {
        end: dayjs(data?.end ?? endDate).format("YYYY-MM-DD"),
      });

    if (sort.key || data?.sortkey)
      Object.assign(params, {
        sortkey: data?.sortkey ?? sort.key,
        sortdir: data?.sortdir ?? sort.direction,
      });

    const fetchEndpoint = endpoints["Transaction"]?.fetchAll;
    if (fetchEndpoint) {
      const response: any = await Fetch(`${fetchEndpoint}`, params);
      if (response?.success) {
        setFilteredData(response?.data?.result || []);
        setPaginate(response?.data?.pagination);
      }
    }
  };

  function flattenObject(obj: any, prefix = "") {
    const flattened: any = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}_${key}` : key;

        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          // Recursive call for nested objects
          Object.assign(flattened, flattenObject(value, newKey));
        } else {
          flattened[newKey] = value;
        }
      }
    }
    return flattened;
  }

  function flattenArrayOfObjects(array: any) {
    return array.map((item: any) => flattenObject(item));
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-5">
        <h2
          className={`text-3xl font-extrabold text-black w-fit ${bigShoulders.className}`}
        >
          Transaction Details
        </h2>
        <div className="flex gap-2">
          {filteredData && filteredData.length > 0 && (
            <GenerateExcelButton data={flattenArrayOfObjects(filteredData)} />
          )}
          <div className="space-x-2 flex">
            <button
              type="button"
              onClick={debounce(handleReset, 1000)}
              className="bg-white text-black border flex gap-2 justify-center items-center border-primary/40 outline-none px-4 text-lg py-2 hover:border-primary rounded-xl hover:bg-primary hover:text-white"
            >
              Clear filters <FaFilter />
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-5 justify-between items-end mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            placeholder="Search here..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 text-lg py-2 placeholder:text-black rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-black border-primary/40 w-full"
          />
          <button
            type="button"
            className="border px-4 text-lg py-2 rounded-xl text-black border-primary/40 hover:bg-primary hover:text-white"
            onClick={debounce(() => fetchFilteredData(), 500)}
          >
            Search
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-black font-medium">Status:</label>
          <select
            value={activeStatus}
            onChange={(e) => handleActiveStatus(e.target.value as any)}
            className="border px-4 text-lg py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-black border-primary/40"
          >
            <option value="captured">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
            <option value="cancelled">Cancelled</option>
            <option value="PAYMENT_INITIATED">Payment Initiated</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-black font-medium">Page:</label>
          <select
            value={paginate?.itemsPerPage}
            onChange={(e: any) => fetchFilteredData({ limit: e.target.value })}
            className="border px-4 text-lg py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-black border-primary/40"
          >
            {[5, 10, 20, 50, 100].map((items) => (
              <option key={items} value={items}>
                {items}
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2">
          <div className="flex flex-col gap-1">
            <label className="text-black font-medium">Start Time:</label>
            <input
              type="date"
              value={startDate as any}
              onChange={(e) => {
                setStartDate(e.target.value as any);
                if (endDate) fetchFilteredData({ start: e.target.value });
              }}
              max={endDate as any}
              className="border px-4 text-lg py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-black border-primary/40"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-black font-medium">End Time:</label>
            <input
              type="date"
              value={endDate as any}
              onChange={(e) => {
                setEndDate(e.target.value as any);
                if (startDate) fetchFilteredData({ end: e.target.value });
              }}
              min={startDate as any}
              className="border px-4 text-lg py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-black border-primary/40"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-t-xl overflow-hidden bg-white">
          <thead>
            <tr>
              <th className="border-b border-primary py-3 text-white bg-primary pl-4 text-left w-[15%]">
                Txn ID
              </th>
              <th className="border-b border-primary py-3 text-white bg-primary pl-4 text-left w-[15%]">
                User
              </th>
              <th className="border-b border-primary py-3 text-white bg-primary pl-4 text-left w-[15%]">
                email
              </th>
              <th className="border-b border-primary py-3 text-white bg-primary pl-4 text-left w-[17%]">
                Date / Time
              </th>
              <th className="border-b border-primary py-3 text-white bg-primary pl-4 text-left w-[10%]">
                Amount
              </th>
              <th className="border-b border-primary py-3 text-white bg-primary pl-4 text-left w-[15%]">
                Payment Method
              </th>
              <th className="border-b border-primary py-3 text-white bg-primary pl-4 text-left w-[15%]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((transaction: any) => {
              const { date, time } = formatTimestamp(transaction?.updatedAt);
              return (
                <React.Fragment key={transaction?.transactionId}>
                  <tr
                    className="hover:bg-primary/10 cursor-pointer"
                    onClick={() => toggleAccordion(transaction?.transactionId)}
                  >
                    <td className="py-3 text-xs pl-4">
                      {transaction?._id.slice(-8)}
                    </td>
                    <td className="py-3 text-xs pl-4 capitalize">
                      {transaction?.userId?.name}
                    </td>
                    <td className="py-3 text-xs pl-4 capitalize">
                      {transaction?.userId?.email}
                    </td>
                    <td className="py-3 text-xs pl-4">
                      {date}, {time}
                    </td>
                    <td className="py-3 text-xs pl-4">
                      {transaction?.status === "captured" && "+"}
                      {transaction?.amount &&
                        "₹ " + transaction?.amount?.toLocaleString()}
                    </td>
                    <td className="py-3 text-xs pl-4 capitalize">
                      {transaction?.paymentMethod ?? "-"}
                    </td>
                    <td className="flex justify-between items-center">
                      <p
                        className={`uppercase text-center mt-2 text-xs py-1 rounded-[6px] text-white ${
                          transaction?.status === "captured"
                            ? "bg-green-400 px-2"
                            : transaction?.status === "initiated"
                            ? "bg-yellow-300 px-2"
                            : "bg-orange-500 px-2"
                        }`}
                      >
                        {transaction?.status}
                      </p>
                      <button className="text-primary flex items-center pr-6 gap-1">
                        {expandedRow === transaction?.transactionId ? (
                          <FaChevronUp title="show less" />
                        ) : (
                          <FaChevronDown title="show more" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {expandedRow === transaction.transactionId && (
                    <tr>
                      <td colSpan={7} className="py-4 px-8 border-y">
                        <div className="grid grid-cols-3 gap-5">
                          <div>
                            <p className="text-primary font-bold">
                              Subscription Plan
                            </p>
                            <div>
                              <p className="text-xs pt-1 capitalize">
                                Duration: {transaction?.duration ?? "-"}
                              </p>
                              <p className="text-xs pt-1 capitalize">
                                Name: {transaction?.subscription?.name ?? "-"}
                              </p>
                              <p className="text-xs pt-1 capitalize">
                                Max Property{" "}
                                {transaction?.subscription?.maxProperties ??
                                  "-"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-primary font-bold">
                              User Details
                            </p>
                            <div>
                              <p className="text-xs pt-1 capitalize">
                                Name: {transaction?.userId?.name ?? "-"}
                              </p>
                              <p className="text-xs pt-1 capitalize">
                                Email: {transaction?.userId?.email ?? "-"}
                              </p>
                              <p className="text-xs pt-1 capitalize">
                                Mobile: {transaction?.userId?.mobile ?? "-"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-primary font-bold">
                              Payment Details Type:
                            </p>
                            <div>
                              <p className="text-xs pt-1 capitalize">
                                Transaction ID:{" "}
                                {transaction?.transactionId ?? "-"}
                              </p>
                              <p className="text-xs pt-1 capitalize">
                                Amount:{" "}
                                {transaction?.amount &&
                                  "₹ " + transaction?.amount?.toLocaleString()}
                              </p>{" "}
                              <p className="text-xs pt-1 capitalize">
                                Method:{" "}
                                {transaction?.transactionDetails?.method ?? "-"}
                              </p>
                              <p className="text-xs pt-1 capitalize">
                                Wallet:{" "}
                                {transaction?.transactionDetails?.wallet ?? "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={debounce(
            () => fetchFilteredData({ page: paginate?.currentPage - 1 }),
            100
          )}
          disabled={paginate?.currentPage === 1}
          className="border border-black text-black rounded-md px-4 py-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-xs">
          Showing {(paginate?.currentPage - 1) * paginate?.itemsPerPage + 1} to{" "}
          {paginate?.totalItems < paginate?.itemsPerPage * paginate?.currentPage
            ? paginate?.totalItems
            : paginate?.itemsPerPage * paginate?.currentPage}{" "}
          of {paginate?.totalItems} entries
        </span>
        <button
          onClick={debounce(
            () => fetchFilteredData({ page: paginate?.currentPage + 1 }),
            100
          )}
          disabled={paginate?.currentPage === paginate?.totalPages}
          className="border border-black hover:bg-primary hover:text-white text-black rounded-md px-4 py-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AccordionTable;
