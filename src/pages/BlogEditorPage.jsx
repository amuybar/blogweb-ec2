import React, { useState, useEffect } from "react";
import EditableArea from "../components/EditableArea/EditableArea";
import ExpandableInput from "../components/Input/InputComponent";
import { toast } from "react-toastify";

const BlogEditor = () => {
  const [editableContent, setEditableContent] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!summary.trim()) {
      toast.error("Summary is required");
      return;
    }

    if (!editableContent.trim()) {
      toast.error("Blog content is required");
      return;
    }

    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("title", title);
      formData.append("summary", summary);
      formData.append("body", editableContent);
      formData.append("author", authorId);
      formData.append("image", image);

      // Logging for debugging
      console.log("Form Data:", {
        title,
        summary,
        body: editableContent,
        authorId,
        image: image.name,
      });

      // Show loading state
      setIsLoading(true);

      // API Call
      const response = await fetch("http://54.221.51.93/api/blogs", {
        method: "POST",
        body: formData,
        // Remove Content-Type header to let browser set it automatically
        // This is important for FormData with file uploads
      });

      // Check response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create blog");
      }
      await response.json();

      // Success notification
      toast.success("Blog created successfully!");

      // Clear form
      clearForm();
    } catch (error) {
      console.error("Blog submission error:", error);
      toast.error(error.message || "Failed to submit blog");
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };

  // Form clearing function
  const clearForm = () => {
    setTitle("");
    setSummary("");
    setEditableContent("");
    setImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 md:p-8 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.01]">
        {/* Page Heading and Description */}
        <header className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 md:p-8 text-white">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 animate-pulse">
            Create Your Blog Post
          </h1>
          <p className="text-sm md:text-base text-blue-100 opacity-90">
            Share your thoughts, stories, or insights with the world. Craft your
            narrative and inspire others.
          </p>
        </header>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title
            </label>
            <ExpandableInput
              placeholder="Enter the blog title"
              value={title}
              onValueChange={setTitle}
              className="w-full border-2 border-blue-200 focus:border-blue-500 rounded-lg transition-all duration-300 ease-in-out"
            />
          </div>

          {/* Summary Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Summary
            </label>
            <ExpandableInput
              multiline
              placeholder="Write a concise summary"
              maxLength={200}
              rows={3}
              value={summary}
              onValueChange={setSummary}
              className="w-full border-2 border-purple-200 focus:border-purple-500 rounded-lg transition-all duration-300 ease-in-out"
            />
          </div>

          {/* Editable Content Area */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Content
            </label>
            <EditableArea
              onContentChange={setEditableContent}
              className="border-2 border-green-200 focus:border-green-500 rounded-lg transition-all duration-300 ease-in-out"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload Featured Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 
                file:mr-4 file:py-2 file:px-4 
                file:rounded-full file:border-0 
                file:text-sm file:font-semibold 
                file:bg-blue-100 file:text-blue-700 
                hover:file:bg-blue-200 
                transition-all duration-300 
                cursor-pointer"
            />
          </div>

          {/* Submit Button */}
          {/* Check if storedUserId exists and conditionally disable the button */}
          <button
            type="submit"
            disabled={isLoading || !localStorage.getItem("userId")}
            className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white 
    px-6 py-3 rounded-lg shadow-lg 
    hover:from-blue-600 hover:to-purple-700 
    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75
    transition-all duration-300 ease-in-out
    transform hover:scale-[1.02] active:scale-[0.98]
    ${!localStorage.getItem("userId") ? "opacity-50 cursor-not-allowed" : ""}
    disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading
              ? "Publishing..."
              : !localStorage.getItem("userId")
              ? "Login to Publish"
              : "Publish Blog"}
          </button>

          {/* Additional Information */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm mb-2">
              Need help? Check out our{" "}
              <a
                href="#"
                className="text-blue-500 hover:text-blue-700 
                  transition-colors duration-300 
                  font-semibold"
              >
                Blogging Resources
              </a>
            </p>
            <p className="text-gray-500 text-xs italic">
              Your blog will be reviewed to ensure quality and community
              guidelines.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogEditor;
