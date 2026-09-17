import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, Filter, MapPin, Calendar, Users, Clock, Bookmark, BookmarkCheck } from 'lucide-react'
import { eventsAPI } from '../../services/eventsService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'

function Events() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    date: '',
    type: '',
    level: '',
    price: '',
  })
  const [showFilters, setShowFilters] = useState(false)

  const { data: eventsData, isLoading, error } = useQuery({
    queryKey: ['events', searchQuery, filters],
    queryFn: () => eventsAPI.getEvents({ q: searchQuery, ...filters }),
    keepPreviousData: true,
  })

  const events = eventsData?.events || []

  const handleSearch = (e) => {
    e.preventDefault()
    // Search is handled by the query key change
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      date: '',
      type: '',
      level: '',
      price: '',
    })
    setSearchQuery('')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">
              Discover Amazing Events
            </h1>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Find workshops, conferences, meetups, and networking events that match your interests
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search for events, topics, or organizers..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-secondary-500 hover:text-secondary-700 transition-colors"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="max-w-3xl mx-auto mt-6 p-6 bg-secondary-50 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input"
                >
                  <option value="">All Categories</option>
                  <option value="workshop">Workshops</option>
                  <option value="conference">Conferences</option>
                  <option value="seminar">Seminars</option>
                  <option value="meetup">Meetups</option>
                  <option value="hackathon">Hackathons</option>
                  <option value="networking">Networking</option>
                  <option value="career">Career Events</option>
                </select>

                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="input"
                >
                  <option value="">All Types</option>
                  <option value="online">Online</option>
                  <option value="offline">In-Person</option>
                  <option value="hybrid">Hybrid</option>
                </select>

                <select
                  value={filters.level}
                  onChange={(e) => handleFilterChange('level', e.target.value)}
                  className="input"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-600">
                  {events.length} events found
                </span>
                <Button variant="ghost" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load events. Please try again.</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">No events found</h3>
            <p className="text-secondary-600 mb-4">Try adjusting your search criteria or filters</p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Event Card Component
function EventCard({ event }) {
  const [isSaved, setIsSaved] = useState(event.is_saved || false)

  const handleSaveEvent = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      if (isSaved) {
        await eventsAPI.unsaveEvent(event.id)
      } else {
        await eventsAPI.saveEvent(event.id)
      }
      setIsSaved(!isSaved)
    } catch (error) {
      console.error('Failed to save/unsave event:', error)
    }
  }

  const getEventTypeIcon = () => {
    if (event.is_online && event.location) return '🌐'
    if (event.is_online) return '💻'
    return '📍'
  }

  const getEventTypeBadge = () => {
    if (event.is_online && event.location) return 'Hybrid'
    if (event.is_online) return 'Online'
    return 'In-Person'
  }

  return (
    <Link to={`/events/${event.id}`} className="block">
      <div className="card p-6 h-full hover:shadow-lg transition-all">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                {event.category}
              </span>
              <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs font-medium rounded-full">
                {getEventTypeBadge()}
              </span>
              {event.level && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  {event.level}
                </span>
              )}
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2 line-clamp-2">
              {event.title}
            </h3>
            <p className="text-secondary-600 text-sm mb-3 line-clamp-2">
              {event.description}
            </p>
          </div>
          <button
            onClick={handleSaveEvent}
            className="ml-4 p-2 text-secondary-400 hover:text-primary-600 transition-colors"
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-primary-600 fill-current" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Event Details */}
        <div className="space-y-3">
          <div className="flex items-center text-secondary-600 text-sm">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>
              {formatDate(event.start_date)}
              {event.start_time && ` • ${formatTime(event.start_time)}`}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center text-secondary-600 text-sm">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}

          <div className="flex items-center text-secondary-600 text-sm">
            <Users className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>
              {event.registered_count || 0} registered
              {event.capacity && ` • ${event.capacity - (event.registered_count || 0)} spots left`}
            </span>
          </div>

          {event.registration_deadline && (
            <div className="flex items-center text-secondary-600 text-sm">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Registration closes {formatDate(event.registration_deadline)}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-secondary-100">
          <div className="text-sm text-secondary-600">
            by <span className="font-medium">{event.organizer_name || 'Organizer'}</span>
          </div>
          <div className="text-lg font-semibold text-secondary-900">
            {event.price === 0 || event.price === null ? 'Free' : `$${event.price}`}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Events