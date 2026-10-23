import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, Calendar, MapPin, Users, Search, Award } from 'lucide-react'
import { eventsAPI } from '../../services/eventsService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' • ' + d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
}

const formatPrice = (price) => {
  if (!price || price === 0) return 'Free'
  return `₹${price.toLocaleString('en-IN')}`
}

function RegisteredEvents() {
  const { data: registeredEventsData, isLoading, error } = useQuery({
    queryKey: ['registered-events'],
    queryFn: eventsAPI.getRegisteredEvents,
  })

  const allEvents = registeredEventsData?.data || []

  const upcomingEvents = allEvents.filter(event =>
    event.derivedStatus === 'UPCOMING' || event.derivedStatus === 'ONGOING'
  )
  const pastEvents = allEvents.filter(event =>
    event.derivedStatus === 'COMPLETED' || event.derivedStatus === 'CANCELLED'
  )
  const cancelledRegistrations = allEvents.filter(event => event.registrationStatus === 'CANCELLED')

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
          <p className="text-secondary-600">Events you've registered for</p>
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
              Start discovering amazing events and register for ones that interest you.
            </p>
            <Link to="/events">
              <Button>
                <Search className="w-4 h-4 mr-2" />
                Discover Events
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Upcoming ({upcomingEvents.length})
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {upcomingEvents.map(event => (
                    <EventRegistrationCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                  Past Events ({pastEvents.length})
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pastEvents.map(event => (
                    <EventRegistrationCard key={event.id} event={event} isPast />
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

function EventRegistrationCard({ event, isPast }) {
  return (
    <Link to={`/events/${event.id}`}>
      <div className={`card p-6 hover:shadow-lg transition-all ${isPast ? 'opacity-75' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full capitalize">
                {event.category}
              </span>
              {event.derivedStatus === 'ONGOING' && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Live Now
                </span>
              )}
              {event.derivedStatus === 'COMPLETED' && (
                <span className="px-2 py-1 bg-secondary-100 text-secondary-600 text-xs font-medium rounded-full">
                  Completed
                </span>
              )}
              {event.derivedStatus === 'CANCELLED' && (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                  Cancelled
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-1 line-clamp-2">{event.title}</h3>
            <p className="text-sm text-secondary-500">by {event.organizerName || 'Organizer'}</p>
          </div>
        </div>

        <div className="space-y-2 mt-3">
          <div className="flex items-center text-secondary-600 text-sm">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{formatDateTime(event.startDateTime)}</span>
          </div>
          {(event.location || event.city) && (
            <div className="flex items-center text-secondary-600 text-sm">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{event.isOnline ? 'Online' : (event.location || event.city)}</span>
            </div>
          )}
          {event.registeredCount !== undefined && (
            <div className="flex items-center text-secondary-600 text-sm">
              <Users className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{event.registeredCount} registered{event.capacity ? ` / ${event.capacity}` : ''}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-secondary-100">
          <div className="flex items-center gap-3">
            {event.certificateAvailable && (
              <span className="flex items-center text-primary-600 text-xs">
                <Award className="w-3 h-3 mr-1" />
                Certificate
              </span>
            )}
            <span className="text-sm font-medium text-green-600">
              {event.registrationStatus === 'REGISTERED' ? '✓ Registered' : event.registrationStatus}
            </span>
          </div>
          <span className="text-secondary-700 font-semibold">{formatPrice(event.price)}</span>
        </div>
      </div>
    </Link>
  )
}

export default RegisteredEvents
