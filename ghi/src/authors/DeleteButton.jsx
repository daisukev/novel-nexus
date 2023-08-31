const DeleteButton = ({ openDeleteModal, chapter }) => {
  return (
    <>
      <button
        type="button"
        style={{
          fontSize: "1.2rem",
          border: "none",
          background: "inherit",
          color: "#AF4040",
          cursor: "pointer",
        }}
        onClick={() => {
          openDeleteModal(chapter);
        }}
      >
        <i className="ri-file-reduce-fill" />
      </button>
    </>
  );
};

export default DeleteButton;
