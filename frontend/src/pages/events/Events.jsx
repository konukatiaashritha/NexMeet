import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, Filter, MapPin, Calendar, Users, Clock, Bookmark, BookmarkCheck, Award } from 'lucide-react'
import { eventsAPI } from '../../services/eventsService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  return d.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) + ' • ' + d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
}

const formatPrice = (price) => {
  if (!price || price === 0) return 'Free'
  return `₹${price.toLocaleString('en-IN')}`
}

function Events() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    city: '',
    online: '',
    experienceLevel: '',
    price: '',
    networkingAvailable: '',
    certificateAvailable: '',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  const { data: eventsData, isLoading, error } = useQuery({
    queryKey: ['events', searchQuery, filters, page],
    queryFn: () => eventsAPI.getEvents({
      search: searchQuery || undefined,
      category: filters.category || undefined,
      city: filters.city || undefined,
      online: filters.online || undefined,
      experienceLevel: filters.experienceLevel || undefined,
      price: filters.price || undefined,
      networkingAvailable: filters.networkingAvailable || undefined,
      certificateAvailable: filters.certificateAvailable || undefined,
      page,
      limit: 20,
      sort: 'startDate',
    }),
    keepPreviousData: true,
  })

  const events = eventsData?.data || []
  const pagination = eventsData?.pagination

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({ category: '', city: '', online: '', experienceLevel: '', price: '', networkingAvailable: '', certificateAvailable: '' })
    setSearchQuery('')
    setPage(1)
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
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search for events, topics, or organizers..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
              />
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-secondary-500 hover:text-secondary-700 transition-colors"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="max-w-3xl mx-auto mt-6 p-6 bg-secondary-50 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)} className="input">
                  <option value="">All Categories</option>
                  <option value="workshop">Workshops</option>
                  <option value="conference">Conferences</option>
                  <option value="seminar">Seminars</option>
                  <option value="meetup">Meetups</option>
                  <option value="hackathon">Hackathons</option>
                  <option value="networking">Networking</option>
                  <option value="career">Career Events</option>
                  <option value="startup">Startup</option>
                  <option value="webinar">Webinar</option>
                </select>

                <select value={filters.online} onChange={(e) => handleFilterChange('online', e.target.value)} className="input">
                  <option value="">All Types</option>
                  <option value="false">In-Person</option>
                  <option value="true">Online</option>
                </select>

                <select value={filters.experienceLevel} onChange={(e) => handleFilterChange('experienceLevel', e.target.value)} className="input">
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="all">All Levels</option>
                </select>

                <input
                  type="text"
                  placeholder="Filter by city..."
                  className="input"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                />

                <select value={filters.price} onChange={(e) => handleFilterChange('price', e.target.value)} className="input">
                  <option value="">Any Price</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>

                <select value={filters.networkingAvailable} onChange={(e) => handleFilterChange('networkingAvailable', e.target.value)} className="input">
                  <option value="">All Events</option>
                  <option value="true">With Networking</option>
                </select>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-600">
                  {pagination?.total ?? events.length} events found
                </span>
                <Button variant="ghost" onClick={clearFilters}>Clear Filters</Button>
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
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-secondary-600 text-sm">
                  Page {pagination.page} of {pagination.totalPages} ({pagination.total} events)
                </span>
                <Button
                  variant="outline"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Event Card Component
function EventCard({ event }) {
  const [isSaved, setIsSaved] = useState(event.isSaved || false)

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

  const getEventTypeBadge = () => {
    if (event.isOnline) return 'Online'
    return 'In-Person'
  }

  const getDerivedStatusBadge = () => {
    switch (event.derivedStatus) {
      case 'UPCOMING': return { label: 'Upcoming', color: 'bg-blue-100 text-blue-700' }
      case 'ONGOING': return { label: 'Live Now', color: 'bg-green-100 text-green-700' }
      case 'COMPLETED': return { label: 'Completed', color: 'bg-secondary-100 text-secondary-600' }
      case 'CANCELLED': return { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
      default: return null
    }
  }

  const statusBadge = getDerivedStatusBadge()

  return (
    <Link to={`/events/${event.id}`} className="block">
      <div className="card p-6 h-full hover:shadow-lg transition-all">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full capitalize">
                {event.category}
              </span>
              <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs font-medium rounded-full">
                {getEventTypeBadge()}
              </span>
              {event.experienceLevel && event.experienceLevel !== 'all' && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full capitalize">
                  {event.experienceLevel}
                </span>
              )}
              {statusBadge && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusBadge.color}`}>
                  {statusBadge.label}
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
            <span>{formatDateTime(event.startDateTime)}</span>
          </div>

          {(event.location || event.city) && (
            <div className="flex items-center text-secondary-600 text-sm">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{event.location || event.city}</span>
            </div>
          )}

          <div className="flex items-center text-secondary-600 text-sm">
            <Users className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>
              {event.registeredCount || 0} registered
              {event.capacity && ` • ${Math.max(0, event.capacity - (event.registeredCount || 0))} spots left`}
            </span>
          </div>

          {event.registrationDeadline && (
            <div className="flex items-center text-secondary-600 text-sm">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Registration closes {new Date(event.registrationDeadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-secondary-100">
          <div className="flex items-center gap-3">
            <div className="text-sm text-secondary-600">
              by <span className="font-medium">{event.organizerName || 'Organizer'}</span>
            </div>
            {event.certificateAvailable && (
              <div className="flex items-center text-primary-600 text-xs">
                <Award className="w-3 h-3 mr-1" />
                Certificate
              </div>
            )}
            {event.networkingAvailable && (
              <div className="flex items-center text-green-600 text-xs">
                <Users className="w-3 h-3 mr-1" />
                Networking
              </div>
            )}
          </div>
          <div className="text-lg font-semibold text-secondary-900">
            {formatPrice(event.price)}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Events
