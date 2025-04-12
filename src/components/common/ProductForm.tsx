import { useState } from "react";

interface Item {
  id: number;
  productCode: string;
  description: string;
  uom: string;
  quantity: number;
  listPrice: number;
  value: number;
  discount: number;
  gst: number;
  gstAmount: number;
  totalAmount: number;
  stockInHand: number;
}

const ProductForm = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [nextId, setNextId] = useState(1);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: nextId,
        productCode: "",
        description: "",
        uom: "",
        quantity: 0,
        listPrice: 0,
        value: 0,
        discount: 0,
        gst: 0,
        gstAmount: 0,
        totalAmount: 0,
        stockInHand: 0,
      },
    ]);
    setNextId(nextId + 1);
  };

  const deleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleChange = (
    id: number,
    field: keyof Item,
    value: string | number
  ) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div className="">
      <button
        onClick={addItem}
        className="mb-6 px-6 py-2 flex justify-end ml-auto bg-primary text-white rounded-md"
      >
        + Add Item
      </button>
      <div className="overflow-x-auto no-scrollbar">
        <table className="table-auto w-full border-collapse whitespace-nowrap border border-gray-300">
          <thead>
            <tr className="bg-primary text-white text-left">
              {[
                "Product Code",
                "Description",
                "UOM",
                "Quantity",
                "List Price",
                "Value",
                "Discount",
                "GST",
                "GST Amount",
                "Total Amount",
                "Stock In Hand",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-14 py-2 border border-gray-300 text-lg font-medium"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="odd:bg-white even:bg-gray-50">
                <td className="p-2 border border-gray-300">
                  <input
                    type="text"
                    value={item.productCode}
                    onChange={(e) =>
                      handleChange(item.id, "productCode", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      handleChange(item.id, "description", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="text"
                    value={item.uom}
                    onChange={(e) =>
                      handleChange(item.id, "uom", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleChange(item.id, "quantity", Number(e.target.value))
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    value={item.listPrice}
                    onChange={(e) =>
                      handleChange(item.id, "listPrice", Number(e.target.value))
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    value={item.value}
                    onChange={(e) =>
                      handleChange(item.id, "value", Number(e.target.value))
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    value={item.discount}
                    onChange={(e) =>
                      handleChange(item.id, "discount", Number(e.target.value))
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    value={item.gst}
                    onChange={(e) =>
                      handleChange(item.id, "gst", Number(e.target.value))
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    value={item.gstAmount}
                    onChange={(e) =>
                      handleChange(item.id, "gstAmount", Number(e.target.value))
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    value={item.totalAmount}
                    onChange={(e) =>
                      handleChange(
                        item.id,
                        "totalAmount",
                        Number(e.target.value)
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="number"
                    value={item.stockInHand}
                    onChange={(e) =>
                      handleChange(
                        item.id,
                        "stockInHand",
                        Number(e.target.value)
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </td>
                <td className="p-2 border border-gray-300 text-center">
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductForm;
