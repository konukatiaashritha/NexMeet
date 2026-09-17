import React from 'react'
import { Link } from 'react-router-dom'
import { Home, Search, ArrowLeft } from 'lucide-react'
import Button from '../components/common/Button'

function NotFound() {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
      <div className="max-w-md w-full text-center px-4">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-primary-600 mb-4">404</div>
          <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-secondary-400" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-secondary-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-secondary-600 mb-8">
          The page you're looking for doesn't exist. It might have been moved, deleted, 
          or you entered the wrong URL.
        </p>

        {/* Actions */}
        <div className="space-y-4">
          <Link to="/" className="block">
            <Button className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
          </Link>
          
          <Link to="/events" className="block">
            <Button variant="outline" className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Explore Events
            </Button>
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="w-full text-secondary-600 hover:text-secondary-900 text-sm font-medium py-2 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-8 border-t border-secondary-200">
          <p className="text-secondary-500 text-sm">
            If you believe this is an error, please{' '}
            <Link to="/contact" className="text-primary-600 hover:text-primary-700 underline">
              contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound