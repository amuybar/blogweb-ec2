import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogDetail = () => {
  const { slug } = useParams();
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl text-red-600 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-700">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  // No Blog Found
  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl text-gray-600">Blog Not Found</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hero Section */}
      <div className="mb-8">
        <img 
          src={blog.imageUrl} 
          alt={blog.title} 
          className="w-full h-96 object-cover rounded-lg mb-6 shadow-md"
        />
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
        
        <div className="flex items-center text-gray-600 mb-6">
          <span className="mr-4">
            Published on: {new Date(blog.date).toLocaleDateString()}
          </span>
          {blog.author && (
            <span>
              Author: {blog.author}
            </span>
          )}
        </div>

        {/* Summary */}
        <p className="text-xl text-gray-700 italic border-l-4 border-blue-500 pl-4 mb-6">
          {blog.summary}
        </p>
      </div>

      {/* Blog Content */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog?.body }}
      />

      {/* Related or Navigation Section */}
      <div className="mt-12 pt-6 border-t">
        <div className="flex justify-between">
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;