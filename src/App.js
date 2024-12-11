


      

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


const Home = lazy(() => import('./pages/Home'));
const BlogEditor = lazy(() => import('./pages/BlogEditorPage'));
const About = lazy(() => import('./pages/About'));

const App = () => {
  return (
    <Router>
      <div className="app">
        <nav className="p-4 bg-gray-800 text-white">
          <ul className="flex space-x-4">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/blog-editor">Blog Editor</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </nav>
        <div className="p-4">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog-editor" element={<BlogEditor />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
  );
};

export default App;
