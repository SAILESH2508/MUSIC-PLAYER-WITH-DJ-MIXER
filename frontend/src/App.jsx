import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import api from './api';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import SongCarousel from './components/Music/SongCarousel';

import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import SongForm from './components/Music/SongForm';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

const Layout = ({ children, searchTerm, setSearchTerm }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const username = localStorage.getItem('username');
  if (!username) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('user/');
        localStorage.setItem('username', response.data.username);
        window.dispatchEvent(new Event('storage')); // Notify listeners
      } catch (error) {
        // Expected behavior: 403 Forbidden if not logged in.
        // This is not a bug, just the initial auth check failing.
        console.info("User not currently logged in (Session check failed).");
        localStorage.removeItem('username');
        window.dispatchEvent(new Event('storage'));
      }
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <Layout searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Routes */}
          <Route path="/playlist" element={
            <ProtectedRoute>
              <SongCarousel searchTerm={searchTerm} />
            </ProtectedRoute>
          } />

          <Route path="/add-song" element={
            <ProtectedRoute>
              <SongForm />
            </ProtectedRoute>
          } />
          <Route path="/edit-song/:id" element={
            <ProtectedRoute>
              <SongForm />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
