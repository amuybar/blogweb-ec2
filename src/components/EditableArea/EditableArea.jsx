import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  faBold,
  faItalic,
  faUnderline,
  faListOl,
  faListUl,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faFont,
  faUndo,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
import ToolbarButton from "./ToolBarBtn";

const EditableArea = ({ onContentChange }) => {
  const [activeCommands, setActiveCommands] = useState([]);
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.5);
  const editorRef = useRef(null);
  const historyRef = useRef({
    undoStack: [],
    redoStack: []
  });

  // Font size options
  const fontSizeOptions = [
    { value: 12, label: '12px' },
    { value: 14, label: '14px' },
    { value: 16, label: '16px' },
    { value: 18, label: '18px' },
    { value: 20, label: '20px' },
    { value: 24, label: '24px' },
  ];

  // Line height options
  const lineHeightOptions = [
    { value: 1, label: 'Single' },
    { value: 1.5, label: '1.5' },
    { value: 2, label: 'Double' },
  ];

  const colorPalette = useMemo(() => [
    { color: '#FF0000', name: 'Red' },
    { color: '#00008B', name: 'Dark Blue' },
    { color: '#D4AF37', name: 'Gold' },
    { color: '#008000', name: 'Green' },
    { color: '#800080', name: 'Purple' }
  ], []);

  // Undo functionality
  const handleUndo = useCallback(() => {
    if (historyRef.current.undoStack.length > 1) {
      const current = historyRef.current.undoStack.pop();
      historyRef.current.redoStack.push(current);
      
      const previous = historyRef.current.undoStack[historyRef.current.undoStack.length - 1];
      if (editorRef.current && previous) {
        editorRef.current.innerHTML = previous;
      }
    }
  }, []);

  // Redo functionality
  const handleRedo = useCallback(() => {
    if (historyRef.current.redoStack.length > 0) {
      const next = historyRef.current.redoStack.pop();
      if (editorRef.current && next) {
        editorRef.current.innerHTML = next;
        historyRef.current.undoStack.push(next);
      }
    }
  }, []);

  // Memoized command handler
  const handleCommand = useCallback((command, value = null) => {
    try {
      document.execCommand(command, false, value);
      
      // Capture history
      if (editorRef.current) {
        historyRef.current.undoStack.push(editorRef.current.innerHTML);
        historyRef.current.redoStack = []; // Clear redo stack
      }

      // Active state management
      setActiveCommands(prev => {
        const isNowActive = document.queryCommandState(command);
        return isNowActive 
          ? [...new Set([...prev, command])] 
          : prev.filter(cmd => cmd !== command);
      });
    } catch (error) {
      console.error(`Error executing command ${command}:`, error);
    }
  }, []);

  // Input handler
  const handleInput = useCallback(() => {
    if (!editorRef.current) return;

    const content = editorRef.current.innerHTML.trim();
    setIsPlaceholderVisible(content === "" || content === "<br>");

    // Notify parent about content change
    onContentChange(content);
  }, [onContentChange])

  // Font size change handler
  const handleFontSizeChange = useCallback((newSize) => {
    setFontSize(newSize);
    if (editorRef.current) {
      editorRef.current.style.fontSize = `${newSize}px`;
    }
  }, []);

  // Line height change handler
  const handleLineHeightChange = useCallback((newLineHeight) => {
    setLineHeight(newLineHeight);
    if (editorRef.current) {
      editorRef.current.style.lineHeight = newLineHeight;
    }
  }, []);

  return (
    <div className="container mx-auto px-2 py-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Enhanced Toolbar */}
        <div className="bg-gray-100 p-3 border-b flex flex-wrap gap-2 items-center">
        {/* Text Formatting Buttons */}
          <div className="flex gap-1">
            <ToolbarButton 
              onClick={() => handleCommand("bold")}
              isActive={activeCommands.includes("bold")}
              icon={faBold}
              tooltipText="Bold (Ctrl+B)"
            />
            <ToolbarButton 
              onClick={() => handleCommand("italic")}
              isActive={activeCommands.includes("italic")}
              icon={faItalic}
              tooltipText="Italic"
            />
            <ToolbarButton 
              onClick={() => handleCommand("underline")}
              isActive={activeCommands.includes("underline")}
              icon={faUnderline}
              tooltipText="Underline"
            />
          </div>

          {/* List Buttons */}
          <div className="flex gap-1">
            <ToolbarButton 
              onClick={() => handleCommand("insertOrderedList")}
              isActive={activeCommands.includes("insertOrderedList")}
              icon={faListOl}
              tooltipText="Ordered List"
            />
            <ToolbarButton 
              onClick={() => handleCommand("insertUnorderedList")}
              isActive={activeCommands.includes("insertUnorderedList")}
              icon={faListUl}
              tooltipText="Unordered List"
            />
          </div>

          {/* Alignment Buttons */}
          <div className="flex gap-1">
            <ToolbarButton 
              onClick={() => handleCommand("justifyLeft")}
              isActive={activeCommands.includes("justifyLeft")}
              icon={faAlignLeft}
              tooltipText="Align Left"
            />
            <ToolbarButton 
              onClick={() => handleCommand("justifyCenter")}
              isActive={activeCommands.includes("justifyCenter")}
              icon={faAlignCenter}
              tooltipText="Align Center"
            />
            <ToolbarButton 
              onClick={() => handleCommand("justifyRight")}
              isActive={activeCommands.includes("justifyRight")}
              icon={faAlignRight}
              tooltipText="Align Right"
            />
          </div>

          {/* Color Buttons with Dropdown-like Behavior */}
          <div className="flex gap-1">
            {colorPalette.map((colorItem) => (
              <ToolbarButton 
                key={colorItem.color}
                onClick={() => handleCommand("foreColor", colorItem.color)}
                isActive={activeCommands.includes("foreColor")}
                icon={faFont}
                className={`text-[${colorItem.color}]`}
                tooltipText={`Text Color: ${colorItem.name}`}
              />
            ))}
          </div>
          {/* Undo/Redo Buttons */}
          <div className="flex gap-1">
            <ToolbarButton 
              onClick={handleUndo}
              icon={faUndo}
              tooltipText="Undo"
            />
            <ToolbarButton 
              onClick={handleRedo}
              icon={faRedo}
              tooltipText="Redo"
            />
          </div>

          {/* Font Size Dropdown */}
          <div>
            <select 
              value={fontSize}
              onChange={(e) => handleFontSizeChange(Number(e.target.value))}
              className="px-2 py-1 border rounded"
            >
              {fontSizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Line Height Dropdown */}
          <div>
            <select 
              value={lineHeight}
              onChange={(e) => handleLineHeightChange(Number(e.target.value))}
              className="px-2 py-1 border rounded"
            >
              {lineHeightOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Existing Toolbar Buttons (Text Formatting, Lists, etc.) */}
          {/* ... (previous toolbar buttons remain the same) */}
        </div>

        {/* Editable Content Area */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="
            min-h-[300px] p-4 
            text-lg leading-relaxed 
            focus:outline-none 
            focus:ring-2 focus:ring-blue-300
            transition-all duration-300
          "
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
          }}
          aria-multiline="true"
          role="textbox"
        >
          {isPlaceholderVisible && (
            <span 
              className="
                absolute text-gray-400 
                select-none pointer-events-none
                opacity-50 italic
              "
            >
              Start typing your content here...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditableArea;