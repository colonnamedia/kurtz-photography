import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Links from './pages/Links.jsx'
import Book from './pages/Book.jsx'
import Contact from './pages/Contact.jsx'
import Portfolio from './pages/Portfolio.jsx'
import Login from './pages/admin/Login.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import { auth } from './lib/api.js'
import { Navigate } from 'react-router-dom'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

function RequireAuth({ children }) {
  return auth.isLoggedIn() ? children : <Navigate to="/admin" replace />
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/links" element={<PublicLayout><Links /></PublicLayout>} />
        <Route path="/portfolio" element={<PublicLayout><Portfolio /></PublicLayout>} />
        <Route path="/weddings" element={<PublicLayout><Book /></PublicLayout>} />
        <Route path="/book" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="*" element={<PublicLayout><Home /></PublicLayout>} />
      </Routes>
    </>
  )
}
