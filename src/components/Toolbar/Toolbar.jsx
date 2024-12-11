
import React from "react";
import Button from "../Button/Button";

const Toolbar = ({ onCommand }) => {
  const handleCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    onCommand?.(command, value);
  };

  return (
    <div className="mb-4 bg-white rounded shadow p-2 flex space-x-2">
      <Button onClick={() => handleCommand("bold")}>Bold</Button>
      <Button onClick={() => handleCommand("italic")}>Italic</Button>
      <Button onClick={() => handleCommand("underline")}>Underline</Button>
      <Button onClick={() => handleCommand("insertOrderedList")}>Ordered List</Button>
      <Button onClick={() => handleCommand("insertUnorderedList")}>Unordered List</Button>
      <Button onClick={() => handleCommand("justifyLeft")}>Left Align</Button>
      <Button onClick={() => handleCommand("justifyCenter")}>Center Align</Button>
      <Button onClick={() => handleCommand("justifyRight")}>Right Align</Button>
      <Button onClick={() => handleCommand("foreColor", "#ff0000")}>
        Red Text
      </Button>
      <Button onClick={() => handleCommand("fontSize", "5")}>Large Font</Button>
    </div>
  );
};

export default Toolbar;
