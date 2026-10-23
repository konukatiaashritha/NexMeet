import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, User, Calendar, Bookmark, LogOut, Users, Bell } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { notificationAPI } from '../../services/notificationService'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Poll unread notification count every 60 seconds
  const { data: notifData } = useQuery({
    queryKey: ['notification-count'],
    queryFn: notificationAPI.getUnreadCount,
    refetchInterval: 60 * 1000,
    enabled: isAuthenticated,
  })
  const unreadCount = typeof notifData === 'number' ? notifData : (notifData?.count || 0)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const navLinkClass = (path) =>
    `text-sm font-medium transition-colors ${
      isActiveLink(path)
        ? 'text-primary-600'
        : 'text-secondary-600 hover:text-secondary-900'
    }`

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
            <Link to="/events" className={navLinkClass('/events')}>
              Explore Events
            </Link>
            <Link to="/communities" className={navLinkClass('/communities')}>
              Communities
            </Link>
            <Link to="/certificate-test" className={navLinkClass('/certificate-test')}>
              Certificates
            </Link>
            {isAuthenticated && (
              <Link to="/networking" className={navLinkClass('/networking')}>
                Networking
              </Link>
            )}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {/* Notifications bell */}
                <Link
                  to="/notifications"
                  className="relative p-2 text-secondary-500 hover:text-primary-600 transition-colors rounded-lg hover:bg-secondary-50"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Discover People quick link */}
                <Link
                  to="/people"
                  className="p-2 text-secondary-500 hover:text-primary-600 transition-colors rounded-lg hover:bg-secondary-50"
                  title="Discover People"
                >
                  <Users className="w-5 h-5" />
                </Link>

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
                      {user?.firstName || user?.first_name}
                    </span>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-secondary-200 py-1 z-50">
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Calendar className="w-4 h-4 mr-3" />
                          Dashboard
                        </Link>
                        <Link
                          to="/notifications"
                          className="flex items-center justify-between px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <span className="flex items-center">
                            <Bell className="w-4 h-4 mr-3" />
                            Notifications
                          </span>
                          {unreadCount > 0 && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs font-bold bg-red-100 text-red-600 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          My Profile
                        </Link>
                        <Link
                          to="/registered-events"
                          className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Calendar className="w-4 h-4 mr-3" />
                          My Events
                        </Link>
                        <Link
                          to="/saved-events"
                          className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Bookmark className="w-4 h-4 mr-3" />
                          Saved Events
                        </Link>
                        <Link
                          to="/networking"
                          className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Users className="w-4 h-4 mr-3" />
                          My Network
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
                    </>
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
                <Link to="/register" className="btn-primary">
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
            <nav className="space-y-1">
              <MobileNavLink to="/events" onClick={() => setIsMenuOpen(false)}>
                Explore Events
              </MobileNavLink>
              <MobileNavLink to="/communities" onClick={() => setIsMenuOpen(false)}>
                Communities
              </MobileNavLink>
              <MobileNavLink to="/certificate-test" onClick={() => setIsMenuOpen(false)}>
                Certificates
              </MobileNavLink>

              {isAuthenticated ? (
                <>
                  <MobileNavLink to="/networking" onClick={() => setIsMenuOpen(false)}>
                    Networking
                  </MobileNavLink>
                  <MobileNavLink to="/people" onClick={() => setIsMenuOpen(false)}>
                    Discover People
                  </MobileNavLink>
                  <MobileNavLink to="/notifications" onClick={() => setIsMenuOpen(false)}>
                    Notifications {unreadCount > 0 && `(${unreadCount})`}
                  </MobileNavLink>
                  <hr className="my-2" />
                  <MobileNavLink to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink to="/profile" onClick={() => setIsMenuOpen(false)}>
                    My Profile
                  </MobileNavLink>
                  <MobileNavLink to="/registered-events" onClick={() => setIsMenuOpen(false)}>
                    My Events
                  </MobileNavLink>
                  <MobileNavLink to="/saved-events" onClick={() => setIsMenuOpen(false)}>
                    Saved Events
                  </MobileNavLink>
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false) }}
                    className="block w-full text-left py-2 px-1 text-base font-medium text-red-600 hover:text-red-700"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <hr className="my-2" />
                  <MobileNavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </MobileNavLink>
                  <MobileNavLink to="/register" onClick={() => setIsMenuOpen(false)} primary>
                    Sign Up
                  </MobileNavLink>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

function MobileNavLink({ to, children, onClick, primary }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={`block py-2 px-1 text-base font-medium transition-colors ${
        primary
          ? 'text-primary-600 hover:text-primary-700'
          : isActive
          ? 'text-primary-600'
          : 'text-secondary-600 hover:text-secondary-900'
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

export default Header