import { FaFilter } from "react-icons/fa";
import { debounce } from "@/hooks/general";
import GenerateExcelButton from "../GenerateExcel";

interface HeaderProps {
  type: string;
  suffix?: string;
  filteredData: any[];
  handleReset: () => void;
  handleAdd: () => void;
  operationsAllowed: {
    create?: boolean;
    [key: string]: boolean | undefined;
  };
}

const Header: React.FC<HeaderProps> = ({
  type,
  suffix,
  handleAdd,
  handleReset,
  filteredData,
  operationsAllowed,
}) => {
  return (
    <div className="flex bg-white p-5 rounded-2xl justify-between items-center">
      {/* Title */}
      <h2 className="text-3xl text-black font-semibold w-fit">
        All {type} <span className="font-normal text-xl">{suffix}</span>
      </h2>

      {/* Actions */}
      <div className="space-x-2 flex">
        {/* Export to Excel */}
        <GenerateExcelButton data={filteredData} />

        {/* Clear Filters Button */}
        <button
          type="button"
          onClick={debounce(handleReset, 1000)}
          className="bg-white text-black border flex gap-2 justify-center items-center border-gray-200 outline-none px-4 text-lg py-2 hover:border-primary rounded-xl hover:bg-primary hover:text-white"
        >
          Clear filters <FaFilter />
        </button>

        {/* Add Button */}
        {operationsAllowed?.create && type !=="Order" && type !=="Contact" && (
          <button
            type="button"
            onClick={handleAdd}
            className="bg-primary text-white px-4 py-1 rounded-xl"
          >
            Add {type}
            <sup>+</sup>
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
