"use client";

const ConfirmationModal = ({
  id,
  handleDelete,
  handleDeleteModal,
}: {
  id: any;
  handleDelete: any;
  handleDeleteModal: any;
}) => {
  return (
    <div className="flex flex-col py-10 px-5 justify-center items-center gap-5">
      <h4 className="text-4xl font-semibold">Do you really want to Delete?</h4>
      <div className="flex justify-center mt-5 items-center gap-5">
        <button
          onClick={() => handleDelete(id)}
          className="px-6 py-3 text-white text-xl bg-gray-500 transition"
        >
          Delete
        </button>
        <button
          onClick={handleDeleteModal}
          className="px-6 py-3 text-white text-xl bg-red-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
