import React, { useState, useEffect } from "react";
import EditableArea from "../components/EditableArea/EditableArea";
import ExpandableInput from "../components/Input/InputComponent";

const BlogEditor = () => {
  const [editableContent, setEditableContent] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [image, setImage] = useState(null);

  // Load author ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setAuthorId(storedUserId);
    }
  }, []);

  // Handles file input changes
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !summary || !editableContent || !image) {
      alert("All fields are required, including an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("body", editableContent);
    formData.append("authorId", authorId);
    formData.append("image", image);

    console.log("Form Data:", {
      title,
      summary,
      body: editableContent,
      authorId,
      image: image.name,
    });

    // Add your API call or further submission logic here
  };

  return (
    <div className="p-6 bg-gray-50">
      {/* Page Heading and Description */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create Your Blog Post</h1>
        <p className="text-gray-600 mt-2">
          Share your thoughts, stories, or insights with the world. Fill in the details below and submit your blog for publication.
        </p>
      </header>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <ExpandableInput 
          placeholder="Enter the blog title" 
          value={title}
          onValueChange={setTitle} 
        />

        {/* Summary Input */}
        <ExpandableInput 
          multiline
          placeholder="Write a concise summary" 
          maxLength={200}
          rows={3}
          value={summary}
          onValueChange={setSummary} 
        />

        {/* Editable Content Area */}
        <EditableArea onContentChange={setEditableContent} />

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Upload Featured Image
          </label>
          <input 
            type="file" 
            id="image" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-6 py-3 rounded shadow hover:bg-blue-600 transition duration-200"
        >
          Publish Blog
        </button>

        {/* Miscellaneous Content */}
        <div className="mt-8 border-t pt-4">
          <p className="text-gray-600 text-sm">
            Need help crafting your blog post? Check out our <a href="#" className="text-blue-500 hover:underline">blogging tips</a> or contact our support team.
          </p>
          <p className="text-gray-600 text-sm mt-2">
            All blogs are reviewed before publication to ensure quality and compliance with our community guidelines.
          </p>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
