import React, { useState, useEffect } from "react";

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
        const response = await fetch("/api/blogs", {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          
        if (!response.ok) {
          // Try to parse error response
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
  
        // Explicitly parse as JSON and validate
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
  
        const dataJson = await response.json();
        const data = dataJson.data;
        console.log(data)
        
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl text-red-600 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Bar */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the Blog Page</h1>
        <p className="text-gray-600 mb-6">
          Discover the latest articles, news, and stories curated just for you.
        </p>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search blogs by title or summary..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
        />
      </div>

      {/* Favorite Blog */}
      {favoriteBlog && (
        <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg shadow-md">
          <h2 className="text-2xl font-bold text-blue-800 mb-3">Featured Blog</h2>
          <img 
            src={favoriteBlog.imageUrl} 
            alt={favoriteBlog.title} 
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{favoriteBlog.title}</h3>
          <p className="text-gray-700 mb-4">{favoriteBlog.summary}</p>
          <a 
            href={`/blogs/${favoriteBlog.slug}`} 
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Read Full Article
          </a>
        </div>
      )}

      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryFilter(category)}
            className={`px-4 py-2 rounded transition ${
              selectedCategory === category 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Blogs Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          No blogs found matching your search or selected category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.slug}
              className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img 
                src={blog.imageUrl} 
                alt={blog.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 text-gray-900">{blog.title}</h3>
                <p className="text-gray-600 mb-4">{blog.summary}</p>
                <div className="flex justify-between items-center">
                  
                   <a href={`/blogs/${blog.slug}`}
                    className="text-blue-500 hover:underline"
                  >
                    Read More
                  </a>
                  <span className="text-sm text-gray-500">
                    {new Date(blog.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;