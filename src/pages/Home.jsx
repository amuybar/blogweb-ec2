import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteBlog, setFavoriteBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Categories for filtering
  const categories = ["All", "Technology", "Health", "Lifestyle"];

  // Fetch blogs from the API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://api.nairobidossier.co.ke/api/blogs", {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
          
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
  
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
  
        const dataJson = await response.json();
        const data = dataJson.data;
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }
  
        setBlogs(data);
        setFilteredBlogs(data);
        
        if (data.length > 0) {
          setFavoriteBlog(data[0]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Detailed Error fetching blogs:", error);
        setError(`Failed to load blogs: ${error.message}`);
        setIsLoading(false);
      }
    };
  
    fetchBlogs();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(query) ||
      blog.summary.toLowerCase().includes(query)
    );
    
    setFilteredBlogs(filtered);
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    
    if (category === "All") {
      setFilteredBlogs(blogs);
      return;
    }
    
    const filtered = blogs.filter((blog) => 
      blog.body.toLowerCase().includes(category.toLowerCase())
    );
    
    setFilteredBlogs(filtered);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="w-32 h-32 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Top Bar */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome to the Blog Universe
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover inspiring stories, expert insights, and thought-provoking articles across various domains.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search blogs by title or summary..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full p-4 pl-10 border-2 border-gray-300 rounded-full 
                focus:outline-none focus:ring-2 focus:ring-blue-400 
                focus:border-transparent transition duration-300 
                shadow-md hover:shadow-lg"
              />
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </header>

        {/* Favorite Blog */}
        {favoriteBlog && (
          <section className="mb-12">
            <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative">
                <img 
                  src={favoriteBlog.imageUrl} 
                  alt={favoriteBlog.title} 
                  className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Featured Blog
                </h2>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{favoriteBlog.title}</h3>
                <p className="text-gray-600 mb-6">{favoriteBlog.summary}</p>
                <Link 
                  to={`/blogs/${favoriteBlog.slug}`} 
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg 
                  hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
                  transform hover:scale-105 active:scale-95 text-center"
                >
                  Read Full Article
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-5 py-2 rounded-full transition-all duration-300 
              ${
                selectedCategory === category 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } shadow-md hover:shadow-lg`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blogs Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center text-gray-600 py-12 bg-white rounded-2xl shadow-xl">
            <p className="text-2xl">No blogs found matching your search or selected category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.slug}
                className="bg-white rounded-2xl overflow-hidden shadow-xl 
                transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative">
                  <img 
                    src={blog.imageUrl} 
                    alt={blog.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-0 right-0 m-4 bg-white/70 px-3 py-1 rounded-full text-sm font-medium">
                    {new Date(blog.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{blog.summary}</p>
                  <div className="flex justify-between items-center">
                    <Link 
                      to={`/blogs/${blog.slug}`}
                      className="text-blue-500 hover:text-blue-700 font-medium 
                      transition duration-300 flex items-center"
                    >
                      Read More
                      <svg 
                        className="w-4 h-4 ml-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;