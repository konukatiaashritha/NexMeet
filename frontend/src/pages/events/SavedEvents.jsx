import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Bookmark, Calendar, MapPin, Users, Search } from 'lucide-react'
import { eventsAPI } from '../../services/eventsService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'

function SavedEvents() {
  const { data: savedEventsData, isLoading, error } = useQuery({
    queryKey: ['saved-events'],
    queryFn: eventsAPI.getSavedEvents,
  })

  const events = savedEventsData?.events || []

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Saved Events</h1>
          <p className="text-secondary-600">
            Events you've bookmarked for later
          </p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load saved events. Please try again.</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-10 h-10 text-secondary-400" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-3">No saved events yet</h3>
            <p className="text-secondary-600 mb-6 max-w-md mx-auto">
              Start exploring events and save the ones that interest you. They'll appear here for easy access.
            </p>
            <Link to="/events">
              <Button>
                <Search className="w-4 h-4 mr-2" />
                Discover Events
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Events Count */}
            <div className="mb-6">
              <p className="text-secondary-600">
                {events.length} saved event{events.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {events.map((event) => (
                <SavedEventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function SavedEventCard({ event }) {
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

  const isUpcoming = new Date(event.start_date) > new Date()
  const isPastEvent = new Date(event.start_date) < new Date()

  return (
    <Link to={`/events/${event.id}`} className="block">
      <div className="card p-6 h-full hover:shadow-lg transition-all relative">
        {/* Event Status Indicator */}
        {isPastEvent && (
          <div className="absolute top-4 right-4">
            <span className="px-2 py-1 bg-secondary-100 text-secondary-600 text-xs font-medium rounded-full">
              Past Event
            </span>
          </div>
        )}

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
              {event.category}
            </span>
            <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs font-medium rounded-full">
              {event.is_online ? (event.location ? 'Hybrid' : 'Online') : 'In-Person'}
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

        {/* Event Details */}
        <div className="space-y-3 mb-4">
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
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-secondary-100">
          <div className="text-sm text-secondary-600">
            by <span className="font-medium">{event.organizer_name || 'Organizer'}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-lg font-semibold text-secondary-900">
              {event.price === 0 || event.price === null ? 'Free' : `$${event.price}`}
            </div>
            <Bookmark className="w-4 h-4 text-primary-600 fill-current" />
          </div>
        </div>

        {/* Registration Status */}
        {event.is_registered && (
          <div className="mt-3 pt-3 border-t border-secondary-100">
            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              ✓ Registered
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}

export default SavedEvents