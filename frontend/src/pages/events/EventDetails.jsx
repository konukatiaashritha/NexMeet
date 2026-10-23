import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Calendar, MapPin, Users, Clock, DollarSign, Share2,
  Bookmark, BookmarkCheck, CheckCircle, ArrowLeft,
  BadgeCheck, Wifi, Building, Layers, ChevronDown, ChevronUp,
} from 'lucide-react'
import { eventsAPI } from '../../services/eventsService'
import { networkingAPI } from '../../services/networkingService'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'
import CertificateInfo from '../../components/events/CertificateInfo'
import EventAttendees from '../../components/events/EventAttendees'
import PeopleYouMayKnow from '../../components/events/PeopleYouMayKnow'
import EventReviews from '../../components/events/EventReviews'
import SimilarEvents from '../../components/events/SimilarEvents'

function EventDetails() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const [isRegistered, setIsRegistered] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [attendanceVisible, setAttendanceVisible] = useState(true)
  const [showFullDescription, setShowFullDescription] = useState(false)

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsAPI.getEvent(id),
  })

  const registerMutation = useMutation({
    mutationFn: () => eventsAPI.registerForEvent(id),
    onSuccess: () => {
      setIsRegistered(true)
      queryClient.invalidateQueries(['event', id])
    },
  })

  const saveMutation = useMutation({
    mutationFn: () =>
      isSaved ? eventsAPI.unsaveEvent(id) : eventsAPI.saveEvent(id),
    onSuccess: () => setIsSaved(!isSaved),
  })

  const handleRegister = () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/events/${id}`
      return
    }
    registerMutation.mutate()
  }

  const handleSave = () => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/events/${id}`
      return
    }
    saveMutation.mutate()
  }

  const handleToggleVisibility = async (visible) => {
    try {
      await networkingAPI.updateAttendanceVisibility(id, visible)
      setAttendanceVisible(visible)
    } catch (err) {
      console.error('Failed to update visibility:', err)
    }
  }

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

  const formatTime = (timeString) =>
    new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

  const formatShortDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Event Not Found</h2>
          <p className="text-secondary-600 mb-4">The event you're looking for doesn't exist.</p>
          <Link to="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isOnlineOnly = event.is_online && !event.location
  const isHybrid = event.is_online && event.location
  const eventTypeBadge = isOnlineOnly ? 'Online' : isHybrid ? 'Hybrid' : 'In-Person'
  const eventTypeIcon = isOnlineOnly || isHybrid ? <Wifi className="w-3.5 h-3.5" /> : <Building className="w-3.5 h-3.5" />

  const isFull = event.capacity && (event.registered_count || 0) >= event.capacity
  const isDeadlinePassed = event.registration_deadline && new Date(event.registration_deadline) < new Date()
  const canRegister = !isRegistered && !isFull && !isDeadlinePassed

  const DESCRIPTION_LIMIT = 400
  const descriptionTruncated =
    event.description?.length > DESCRIPTION_LIMIT && !showFullDescription

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Back Navigation */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/events"
            className="inline-flex items-center text-secondary-600 hover:text-secondary-900 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Events
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main Column ────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Event Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                  {event.category}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 text-secondary-700 text-xs font-medium rounded-full">
                  {eventTypeIcon}
                  {eventTypeBadge}
                </span>
                {event.level && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {event.level}
                  </span>
                )}
                {event.price === 0 && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                    Free
                  </span>
                )}
                {event.networking_available && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    🤝 Networking
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-2">
                {event.title}
              </h1>

              {/* Organizer */}
              <div className="flex items-center gap-2 mb-6">
                <p className="text-secondary-600">
                  Organized by{' '}
                  <span className="font-semibold text-secondary-900">{event.organizer_name}</span>
                </p>
                {event.organizer_verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Verified Organizer
                  </span>
                )}
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-t border-b border-secondary-100">
                <MetaItem
                  icon={<Calendar className="w-4 h-4 text-primary-500" />}
                  label="Date"
                  value={formatDate(event.start_date)}
                  sub={event.start_time ? formatTime(event.start_time) : undefined}
                />
                {event.location && (
                  <MetaItem
                    icon={<MapPin className="w-4 h-4 text-primary-500" />}
                    label="Location"
                    value={event.location}
                  />
                )}
                <MetaItem
                  icon={<Users className="w-4 h-4 text-primary-500" />}
                  label="Attendees"
                  value={`${event.registered_count || 0}${event.capacity ? ` / ${event.capacity}` : ''}`}
                  sub={event.capacity ? `${event.capacity - (event.registered_count || 0)} spots left` : undefined}
                />
                <MetaItem
                  icon={<DollarSign className="w-4 h-4 text-primary-500" />}
                  label="Price"
                  value={event.price === 0 || event.price == null ? 'Free' : `$${event.price}`}
                />
              </div>

              {/* Registration deadline warning */}
              {event.registration_deadline && !isDeadlinePassed && (
                <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  <p className="text-yellow-800 text-sm">
                    <span className="font-medium">Registration closes:</span>{' '}
                    {formatShortDate(event.registration_deadline)}
                  </p>
                </div>
              )}
            </div>

            {/* About */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-3">About This Event</h2>
              <div className="prose max-w-none text-secondary-700 text-sm leading-relaxed whitespace-pre-wrap">
                {descriptionTruncated
                  ? event.description.slice(0, DESCRIPTION_LIMIT) + '...'
                  : event.description}
              </div>
              {event.description?.length > DESCRIPTION_LIMIT && (
                <button
                  onClick={() => setShowFullDescription((v) => !v)}
                  className="mt-2 flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {showFullDescription ? (
                    <><ChevronUp className="w-4 h-4" />Show less</>
                  ) : (
                    <><ChevronDown className="w-4 h-4" />Read more</>
                  )}
                </button>
              )}
            </div>

            {/* What You'll Learn */}
            {event.what_you_learn?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
                <h2 className="text-lg font-semibold text-secondary-900 mb-3">What You'll Learn</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {event.what_you_learn.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-secondary-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills / Topics */}
            {event.skills_covered?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
                <h2 className="text-lg font-semibold text-secondary-900 mb-3">Skills & Topics</h2>
                <div className="flex flex-wrap gap-2">
                  {event.skills_covered.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full border border-primary-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers */}
            {event.speakers?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
                <h2 className="text-lg font-semibold text-secondary-900 mb-4">Speakers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.speakers.map((speaker, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="font-semibold text-primary-600 text-sm">
                          {speaker.name.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-secondary-900 text-sm truncate">
                          {speaker.name}
                        </p>
                        <p className="text-xs text-secondary-500 truncate">{speaker.role}</p>
                        {speaker.organization && (
                          <p className="text-xs text-secondary-400 truncate">
                            {speaker.organization}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificate Information */}
            {event.certificate && (
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
                <CertificateInfo certificate={event.certificate} />
              </div>
            )}

            {/* ── Who's Going ──────────────────────────────────────── */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              {isAuthenticated ? (
                <EventAttendees
                  eventId={id}
                  isRegistered={isRegistered}
                  attendanceVisible={attendanceVisible}
                  onToggleVisibility={handleToggleVisibility}
                />
              ) : (
                <div className="text-center py-8">
                  <Users className="w-10 h-10 text-secondary-300 mx-auto mb-3" />
                  <h3 className="font-semibold text-secondary-900 mb-1">Who's Going?</h3>
                  <p className="text-secondary-500 text-sm mb-4">
                    Sign in to see who's attending this event and connect with them.
                  </p>
                  <Link to={`/login?redirect=/events/${id}`}>
                    <Button size="sm">Sign in to see attendees</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* ── People You May Want to Connect With ──────────────── */}
            {isAuthenticated && (
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
                <PeopleYouMayKnow
                  eventId={id}
                  eventName={event?.title}
                  limit={4}
                />
              </div>
            )}

            {/* ── Reviews ──────────────────────────────────────────── */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <EventReviews
                eventId={id}
                isPastEvent={new Date(event.start_date) < new Date()}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>

          {/* ── Sidebar ────────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Register / Save card */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-5 sticky top-4">
              <div className="mb-4">
                <p className="text-2xl font-bold text-secondary-900">
                  {event.price === 0 || event.price == null ? 'Free' : `$${event.price}`}
                </p>
                {event.capacity && (
                  <p className="text-sm text-secondary-500 mt-0.5">
                    {event.capacity - (event.registered_count || 0)} of {event.capacity} spots remaining
                  </p>
                )}
              </div>

              {canRegister ? (
                <Button
                  onClick={handleRegister}
                  loading={registerMutation.isLoading}
                  className="w-full mb-3"
                  size="lg"
                >
                  Register for Event
                </Button>
              ) : isRegistered ? (
                <div className="w-full mb-3 flex items-center justify-center gap-2 py-3 px-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">You're registered!</span>
                </div>
              ) : isFull ? (
                <Button className="w-full mb-3" disabled size="lg">
                  Event Full
                </Button>
              ) : (
                <Button className="w-full mb-3" disabled size="lg">
                  Registration Closed
                </Button>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSave}
                  loading={saveMutation.isLoading}
                  className="flex-1"
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-4 h-4 mr-1.5 text-primary-600" />
                  ) : (
                    <Bookmark className="w-4 h-4 mr-1.5" />
                  )}
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline" className="px-3" title="Share event">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              {event.registration_deadline && !isDeadlinePassed && (
                <p className="text-xs text-secondary-400 text-center mt-3">
                  Registration closes {formatShortDate(event.registration_deadline)}
                </p>
              )}
            </div>

            {/* Quick details */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-5">
              <h3 className="font-semibold text-secondary-900 mb-3 text-sm">Event Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2 text-secondary-600">
                  <Layers className="w-4 h-4 mt-0.5 text-secondary-400 flex-shrink-0" />
                  <span className="capitalize">{event.level || 'All levels'}</span>
                </div>
                <div className="flex items-start gap-2 text-secondary-600">
                  {eventTypeIcon && React.cloneElement(eventTypeIcon, { className: 'w-4 h-4 mt-0.5 text-secondary-400 flex-shrink-0' })}
                  <span>{eventTypeBadge}</span>
                </div>
                <div className="flex items-start gap-2 text-secondary-600">
                  <Users className="w-4 h-4 mt-0.5 text-secondary-400 flex-shrink-0" />
                  <span>{event.registered_count || 0} registered</span>
                </div>
                {event.networking_available && (
                  <div className="flex items-start gap-2 text-secondary-600">
                    <span className="text-base leading-none mt-0.5">🤝</span>
                    <span>Networking available</span>
                  </div>
                )}
                {event.certificate?.available && (
                  <div className="flex items-start gap-2 text-secondary-600">
                    <span className="text-base leading-none mt-0.5">🎓</span>
                    <span>Certificate available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Organizer card */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-5">
              <h3 className="font-semibold text-secondary-900 mb-3 text-sm">Organizer</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary-600 text-sm">
                    {event.organizer_name?.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-secondary-900 text-sm truncate">
                    {event.organizer_name}
                  </p>
                  {event.organizer_verified && (
                    <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                      <BadgeCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Community link */}
            <Link
              to={`/events/${id}/community`}
              className="block bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary-800">Event Community</p>
                  <p className="text-xs text-primary-600 mt-0.5">
                    Discussions · Q&amp;A · Resources
                  </p>
                </div>
                <span className="text-2xl">👥</span>
              </div>
            </Link>

            {/* Similar Events */}
            {event.category && (
              <SimilarEvents eventId={id} category={event.category} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Meta item helper ───────────────────────────────────────── */
function MetaItem({ icon, label, value, sub }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-secondary-400">{label}</p>
        <p className="text-sm font-medium text-secondary-900 leading-snug truncate">{value}</p>
        {sub && <p className="text-xs text-secondary-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default EventDetails
