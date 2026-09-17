import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, User, Calendar, Bookmark, LogOut, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActiveLink = (path) => {
    return location.pathname === path
  }

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-bold text-secondary-900">NexMeet</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/events"
              className={`text-sm font-medium transition-colors ${
                isActiveLink('/events')
                  ? 'text-primary-600'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              Explore Events
            </Link>
            <Link
              to="/communities"
              className={`text-sm font-medium transition-colors ${
                isActiveLink('/communities')
                  ? 'text-primary-600'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              Communities
            </Link>
            <Link
              to="/certificate-test"
              className={`text-sm font-medium transition-colors ${
                isActiveLink('/certificate-test')
                  ? 'text-primary-600'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              Certificates
            </Link>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Search */}
                <button className="p-2 text-secondary-500 hover:text-secondary-700 transition-colors">
                  <Search className="w-5 h-5" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      {user?.profile_picture ? (
                        <img
                          src={user.profile_picture}
                          alt={user.first_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-primary-600" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-secondary-900">
                      {user?.first_name}
                    </span>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-1 z-50">
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Calendar className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        to="/saved-events"
                        className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Bookmark className="w-4 h-4 mr-3" />
                        Saved Events
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-secondary-600 hover:text-secondary-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-secondary-600 hover:text-secondary-900"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary-200">
            <nav className="space-y-2">
              <Link
                to="/events"
                className="block py-2 text-base font-medium text-secondary-600 hover:text-secondary-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore Events
              </Link>
              <Link
                to="/communities"
                className="block py-2 text-base font-medium text-secondary-600 hover:text-secondary-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Communities
              </Link>
              <Link
                to="/certificate-test"
                className="block py-2 text-base font-medium text-secondary-600 hover:text-secondary-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Certificates
              </Link>
              
              {isAuthenticated ? (
                <>
                  <hr className="my-2" />
                  <Link
                    to="/dashboard"
                    className="block py-2 text-base font-medium text-secondary-600 hover:text-secondary-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block py-2 text-base font-medium text-secondary-600 hover:text-secondary-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/saved-events"
                    className="block py-2 text-base font-medium text-secondary-600 hover:text-secondary-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Saved Events
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-base font-medium text-red-600 hover:text-red-700"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <hr className="my-2" />
                  <Link
                    to="/login"
                    className="block py-2 text-base font-medium text-secondary-600 hover:text-secondary-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 text-base font-medium text-primary-600 hover:text-primary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header