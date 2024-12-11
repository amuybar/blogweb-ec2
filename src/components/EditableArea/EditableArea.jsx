
import React from "react";

const EditableArea = () => {
  return (
    <div
      contentEditable
      className="bg-white min-h-[200px] w-full max-w-2xl border rounded p-2 shadow"
    >
      Start editing here...
    </div>
  );
};

export default EditableArea;
