
import React from "react";
import Toolbar from "./components/Toolbar/Toolbar";
import EditableArea from "./components/EditableArea/EditableArea";

function App() {
  const handleCommand = (command, value) => {
    console.log(`Executed command: ${command}`, value);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">WYSIWYG Editor</h1>
      <Toolbar onCommand={handleCommand} />
      <EditableArea />
    </div>
  );
}

export default App;
