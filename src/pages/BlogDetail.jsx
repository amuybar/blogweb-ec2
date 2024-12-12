import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://54.221.51.93/api/blogs/${slug}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const dataJson = await response.json();
        const data = dataJson.data;
        setBlog(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setError("Failed to load blog details. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchBlogDetails();
  }, [slug]);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-purple-100">
        <div 
          className="w-32 h-32 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"
        />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div 
        className="container mx-auto px-4 py-8 text-center min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-red-50 to-red-100 animate-fade-in"
      >
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md transform transition-all duration-300 hover:scale-105">
          <h2 className="text-3xl text-red-600 mb-4 font-bold">Oops! Something went wrong</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg 
            hover:from-red-600 hover:to-pink-600 transition-all duration-300 
            transform hover:scale-105 active:scale-95"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No Blog Found
  if (!blog) {
    return (
      <div 
        className="container mx-auto px-4 py-8 text-center min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 animate-fade-in"
      >
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl text-gray-600 font-bold">Blog Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen py-12 animate-fade-in"
    >
      <div className="container mx-auto px-4 max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
        {/* Hero Section */}
        <div className="relative group">
          <img 
            src={blog.imageUrl} 
            alt={blog.title} 
            className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay Title */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">{blog.title}</h1>
          </div>
        </div>
        
        {/* Blog Metadata */}
        <div className="p-6">
          <div className="flex items-center justify-between text-gray-600 mb-6 border-b pb-4">
            <div>
              <span className="font-medium">Published on: </span>
              {new Date(blog.date).toLocaleDateString()}
            </div>
            {blog.author && (
              <div>
                <span className="font-medium">Author: </span>
                {blog.authorName}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-xl text-gray-700 italic">
              {blog.summary}
            </p>
          </div>

          {/* Blog Content */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog?.body }}
          />

          {/* Navigation Section */}
          <div className="mt-12 pt-6 border-t flex justify-between items-center">
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg 
              hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
              transform hover:scale-105 active:scale-95"
            >
              Back to Blogs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;