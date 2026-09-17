import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/auth/Profile'
import Events from './pages/events/Events'
import EventDetails from './pages/events/EventDetails'
import Dashboard from './pages/dashboard/Dashboard'
import SavedEvents from './pages/events/SavedEvents'
import RegisteredEvents from './pages/events/RegisteredEvents'
import Communities from './pages/community/Communities'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/communities" element={<Communities />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/saved-events" element={
            <ProtectedRoute>
              <SavedEvents />
            </ProtectedRoute>
          } />
          <Route path="/registered-events" element={
            <ProtectedRoute>
              <RegisteredEvents />
            </ProtectedRoute>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App