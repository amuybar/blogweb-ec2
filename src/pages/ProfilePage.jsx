import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [feeds, setFeeds] = useState([]);
  const [likedBlogs, setLikedBlogs] = useState([]);
  const [viewedBlogs, setViewedBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState('Feeds');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      toast.error('You must be logged in to view this page.');
      return;
    }

    // Fetch user details
    fetch('http://54.221.51.93/api/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => toast.error('Failed to fetch user details.'));

    // Fetch feeds initially
    fetchBlogs('Feeds');
  }, [token]);

  const fetchBlogs = (tab) => {
    let endpoint = 'http://54.221.51.93/api/blogs';
    if (tab === 'Liked') endpoint = '/api/blogs/liked';
    if (tab === 'Viewed') endpoint = '/api/blogs/viewed';

    fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (tab === 'Feeds') setFeeds(data);
        if (tab === 'Liked') setLikedBlogs(data);
        if (tab === 'Viewed') setViewedBlogs(data);
      })
      .catch((err) => toast.error('Failed to fetch blogs.'));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchBlogs(tab);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {user ? (
        <div className="bg-white shadow-md rounded-md p-6">
          <div className="flex items-center space-x-4 mb-6">
            <UserCircleIcon className="h-16 w-16 text-gray-500" />
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <Tab.Group>
            <Tab.List className="flex space-x-4 mb-6">
              {['Feeds', 'Liked', 'Viewed'].map((tab) => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    `px-4 py-2 rounded-md ${
                      selected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                    }`
                  }
                  onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                {activeTab === 'Feeds' && (
                  <div>
                    {feeds.length ? (
                      feeds.map((blog) => (
                        <div key={blog.id} className="p-4 bg-gray-100 rounded-md mb-4">
                          <h3 className="text-lg font-semibold">{blog.title}</h3>
                          <p className="text-gray-600">{blog.content}</p>
                        </div>
                      ))
                    ) : (
                      <p>No blogs found.</p>
                    )}
                  </div>
                )}
              </Tab.Panel>
              <Tab.Panel>
                {activeTab === 'Liked' && (
                  <div>
                    {likedBlogs.length ? (
                      likedBlogs.map((blog) => (
                        <div key={blog.id} className="p-4 bg-gray-100 rounded-md mb-4">
                          <h3 className="text-lg font-semibold">{blog.title}</h3>
                          <p className="text-gray-600">{blog.content}</p>
                        </div>
                      ))
                    ) : (
                      <p>No liked blogs found.</p>
                    )}
                  </div>
                )}
              </Tab.Panel>
              <Tab.Panel>
                {activeTab === 'Viewed' && (
                  <div>
                    {viewedBlogs.length ? (
                      viewedBlogs.map((blog) => (
                        <div key={blog.id} className="p-4 bg-gray-100 rounded-md mb-4">
                          <h3 className="text-lg font-semibold">{blog.title}</h3>
                          <p className="text-gray-600">{blog.content}</p>
                        </div>
                      ))
                    ) : (
                      <p>No viewed blogs found.</p>
                    )}
                  </div>
                )}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
};

export default ProfilePage;
