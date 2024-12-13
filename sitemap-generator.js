const fs = require('fs');
const path = require('path');
const axios = require('axios');
const xmlbuilder = require('xmlbuilder');

// Base configuration
const baseURL = 'https://nairobidossier.co.ke';
const API_ENDPOINT = 'https://api.nairobidossier.co.ke/api/blogs';

// Fetch blog posts from API
const fetchBlogPosts = async () => {
  try {
    const response = await axios.get(API_ENDPOINT, {
      // Optional: Add headers if needed for authentication
      headers: {
        // 'Authorization': `Bearer ${process.env.API_TOKEN}`,
        'Accept': 'application/json'
      }
    });

    // Assuming the API returns an array of blog posts
    // Adjust the data extraction based on the actual API response structure
    return response.data.map(post => ({
      slug: post.slug || post.id, // Use slug or fallback to id
      title: post.title,
      updatedAt: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      publishedAt: post.publishedAt ? new Date(post.publishedAt) : new Date()
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error.message);
    return [];
  }
};

// Fetch static routes
const fetchStaticRoutes = () => {
  return [
    '/',
    '/about',
    '/blog-editor',
    '/contact'
    // Add other static routes as needed
  ];
};

// Build Sitemap
const buildSitemap = async () => {
  // Get static routes
  const staticRoutes = fetchStaticRoutes();

  // Fetch dynamic blog posts
  const blogPosts = await fetchBlogPosts();

  // Create XML sitemap
  const sitemap = xmlbuilder.create('urlset', { 
    version: '1.0', 
    encoding: 'UTF-8',
    attributes: {
      xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
    }
  });

  // Add static routes
  staticRoutes.forEach(route => {
    sitemap.ele('url')
      .ele('loc', {}, `${baseURL}${route}`)
      .up()
      .ele('changefreq', {}, 'daily')
      .up()
      .ele('priority', {}, route === '/' ? '1.0' : '0.8')
      .up()
  });

  // Add blog post routes
  blogPosts.forEach(post => {
    sitemap.ele('url')
      .ele('loc', {}, `${baseURL}/blog/${post.slug}`)
      .up()
      .ele('changefreq', {}, 'weekly')
      .up()
      .ele('priority', {}, '0.6')
      .up()
      .ele('lastmod', {}, post.updatedAt.toISOString())
      .up()
  });

  return sitemap.end({ pretty: true });
};

// Generate Sitemap
const generateSitemap = async () => {
  try {
    const sitemapXML = await buildSitemap();
    
    // Ensure public directory exists
    const publicDir = path.resolve('./public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    // Write sitemap
    fs.writeFileSync(path.resolve(publicDir, 'sitemap.xml'), sitemapXML);
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
};

// Execute sitemap generation
generateSitemap();