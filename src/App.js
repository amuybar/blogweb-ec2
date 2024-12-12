


      

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer';


const Home = lazy(() => import('./pages/Home'));
const BlogEditor = lazy(() => import('./pages/BlogEditorPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

const App = () => {
  return (
    <Router>
      <div className="app">
       <Navbar/>
        <div className="p-4">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog-editor" element={<BlogEditor />} />
               <Route path="/blogs/:slug" element={<BlogDetail />} /> 
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </Suspense>

        </div>
        <Footer/>
        <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      </div>
    </Router>
  );
};

export default App;
