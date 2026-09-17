import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, Calendar, MapPin, Users, Search, Clock, Award } from 'lucide-react'
import { eventsAPI } from '../../services/eventsService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'
import CertificateInfo from '../../components/events/CertificateInfo'

function RegisteredEvents() {
  const { data: registeredEventsData, isLoading, error } = useQuery({
    queryKey: ['registered-events'],
    queryFn: eventsAPI.getRegisteredEvents,
  })

  const allEvents = registeredEventsData?.events || []
  
  // Separate upcoming and past events
  const upcomingEvents = allEvents.filter(event => new Date(event.start_date) > new Date())
  const pastEvents = allEvents.filter(event => new Date(event.start_date) <= new Date())

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
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">My Events</h1>
          <p className="text-secondary-600">
            Events you've registered for
          </p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load registered events. Please try again.</p>
          </div>
        ) : allEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-secondary-400" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-3">No registered events yet</h3>
            <p className="text-secondary-600 mb-6 max-w-md mx-auto">
              Start discovering amazing events and register for ones that interest you. They'll appear here once you've registered.
            </p>
            <Link to="/events">
              <Button>
                <Search className="w-4 h-4 mr-2" />
                Discover Events
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                  Upcoming Events ({upcomingEvents.length})
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {upcomingEvents.map((event) => (
                    <RegisteredEventCard key={event.id} event={event} isUpcoming={true} />
                  ))}
                </div>
              </section>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                  Past Events ({pastEvents.length})
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pastEvents.map((event) => (
                    <RegisteredEventCard key={event.id} event={event} isUpcoming={false} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function RegisteredEventCard({ event, isUpcoming }) {
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

  const getTimeUntilEvent = () => {
    const eventDate = new Date(event.start_date)
    const now = new Date()
    const diffTime = eventDate - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 7) return `In ${diffDays} days`
    if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`
    return `In ${Math.ceil(diffDays / 30)} months`
  }

  return (
    <Link to={`/events/${event.id}`} className="block">
      <div className={`card p-6 h-full hover:shadow-lg transition-all relative ${
        !isUpcoming ? 'opacity-80' : ''
      }`}>
        {/* Event Status */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
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
          
          <div className="flex items-center gap-2">
            {isUpcoming ? (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {getTimeUntilEvent()}
              </span>
            ) : (
              <span className="px-2 py-1 bg-secondary-100 text-secondary-600 text-xs font-medium rounded-full">
                Completed
              </span>
            )}
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
        </div>

        {/* Event Title & Description */}
        <div className="mb-4">
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
              {event.capacity && ` • ${event.capacity} total capacity`}
            </span>
          </div>

          {/* Registration deadline warning for upcoming events */}
          {isUpcoming && event.registration_deadline && (
            <div className="flex items-center text-orange-600 text-sm">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Registration closes {formatDate(event.registration_deadline)}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-secondary-100">
          <div className="text-sm text-secondary-600">
            by <span className="font-medium">{event.organizer_name || 'Organizer'}</span>
          </div>
          <div className="text-lg font-semibold text-secondary-900">
            {event.price === 0 || event.price === null ? 'Free' : `$${event.price}`}
          </div>
        </div>

        {/* Additional Info for Past Events */}
        {!isUpcoming && (
          <div className="mt-4 pt-4 border-t border-secondary-100 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary-600">Event completed</span>
              {event.can_review && (
                <Button variant="outline" size="sm" onClick={(e) => {
                  e.preventDefault()
                  // Handle review action
                }}>
                  Write Review
                </Button>
              )}
            </div>

            {/* Certificate Information for Past Events */}
            {event.certificate?.available && (
              <div className="mt-3">
                <CertificateInfo certificate={event.certificate} compact={true} />
              </div>
            )}
          </div>
        )}

        {/* Reminder for Upcoming Events */}
        {isUpcoming && new Date(event.start_date) - new Date() < 7 * 24 * 60 * 60 * 1000 && (
          <div className="mt-4 pt-4 border-t border-secondary-100">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center text-blue-700 text-sm">
                <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="font-medium">Coming up soon!</span>
              </div>
              <p className="text-blue-600 text-xs mt-1">
                Don't forget to add this to your calendar
              </p>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}

export default RegisteredEvents