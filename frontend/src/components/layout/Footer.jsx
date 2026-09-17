import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-secondary-50 border-t border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold text-secondary-900">NexMeet</span>
            </Link>
            <p className="text-secondary-600 mb-4 max-w-md">
              Discover amazing events, connect with like-minded people, and grow your professional network.
            </p>
            <p className="text-sm text-secondary-500">
              © 2024 NexMeet. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-secondary-900 mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Explore Events
                </Link>
              </li>
              <li>
                <Link to="/communities" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Communities
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-secondary-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-secondary-600 hover:text-primary-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer