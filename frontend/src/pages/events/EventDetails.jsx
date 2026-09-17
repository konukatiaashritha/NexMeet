import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Calendar, MapPin, Users, Clock, DollarSign, Share2, 
  Bookmark, BookmarkCheck, CheckCircle, ArrowLeft 
} from 'lucide-react'
import { eventsAPI } from '../../services/eventsService'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'

function EventDetails() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  
  const [isRegistered, setIsRegistered] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

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
    mutationFn: () => isSaved ? eventsAPI.unsaveEvent(id) : eventsAPI.saveEvent(id),
    onSuccess: () => {
      setIsSaved(!isSaved)
    },
  })

  const handleRegister = () => {
    if (!isAuthenticated) {
      // Redirect to login
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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

  const canRegister = !isRegistered && event.capacity > (event.registered_count || 0) && 
                     new Date(event.registration_deadline) > new Date()

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Back Navigation */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/events" className="inline-flex items-center text-secondary-600 hover:text-secondary-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
          {/* Event Header */}
          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                    {event.category}
                  </span>
                  <span className="px-3 py-1 bg-secondary-100 text-secondary-700 text-sm font-medium rounded-full">
                    {event.is_online ? (event.location ? 'Hybrid' : 'Online') : 'In-Person'}
                  </span>
                  {event.level && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      {event.level}
                    </span>
                  )}
                  {event.price === 0 && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                      Free
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-secondary-900 mb-4">
                  {event.title}
                </h1>

                {/* Organizer */}
                <p className="text-lg text-secondary-600 mb-6">
                  Organized by <span className="font-semibold text-secondary-900">{event.organizer_name}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                {canRegister ? (
                  <Button
                    onClick={handleRegister}
                    loading={registerMutation.isLoading}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Register for Event
                  </Button>
                ) : isRegistered ? (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto"
                    disabled
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Registered
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto"
                    disabled
                  >
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
                      <BookmarkCheck className="w-4 h-4 mr-2" />
                    ) : (
                      <Bookmark className="w-4 h-4 mr-2" />
                    )}
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                  
                  <Button variant="outline">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Event Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pt-8 border-t border-secondary-200">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-secondary-400 mr-3" />
                <div>
                  <p className="text-sm text-secondary-600">Date & Time</p>
                  <p className="font-medium text-secondary-900">
                    {formatDate(event.start_date)}
                  </p>
                  {event.start_time && (
                    <p className="text-sm text-secondary-600">
                      {formatTime(event.start_time)}
                    </p>
                  )}
                </div>
              </div>

              {event.location && (
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-secondary-400 mr-3" />
                  <div>
                    <p className="text-sm text-secondary-600">Location</p>
                    <p className="font-medium text-secondary-900">{event.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <Users className="w-5 h-5 text-secondary-400 mr-3" />
                <div>
                  <p className="text-sm text-secondary-600">Attendees</p>
                  <p className="font-medium text-secondary-900">
                    {event.registered_count || 0}
                    {event.capacity && ` / ${event.capacity}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-secondary-400 mr-3" />
                <div>
                  <p className="text-sm text-secondary-600">Price</p>
                  <p className="font-medium text-secondary-900">
                    {event.price === 0 || event.price === null ? 'Free' : `$${event.price}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Event Description */}
          <div className="px-8 pb-8">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">About This Event</h2>
            <div className="prose max-w-none text-secondary-700 whitespace-pre-wrap">
              {event.description}
            </div>
          </div>

          {/* Speakers Section (if available) */}
          {event.speakers && event.speakers.length > 0 && (
            <div className="px-8 pb-8">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">Speakers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.speakers.map((speaker, index) => (
                  <div key={index} className="flex items-center p-4 bg-secondary-50 rounded-lg">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                      <span className="font-semibold text-primary-600">
                        {speaker.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">{speaker.name}</p>
                      <p className="text-sm text-secondary-600">{speaker.role}</p>
                      {speaker.organization && (
                        <p className="text-sm text-secondary-500">{speaker.organization}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Registration Deadline Warning */}
          {event.registration_deadline && new Date(event.registration_deadline) > new Date() && (
            <div className="px-8 pb-8">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                  <p className="text-yellow-800">
                    <span className="font-medium">Registration deadline:</span>{' '}
                    {formatDate(event.registration_deadline)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Who's Going Section */}
          {isAuthenticated && (event.attendees && event.attendees.length > 0) && (
            <div className="px-8 pb-8 border-t border-secondary-200 pt-8">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">Who's Going?</h2>
              <div className="flex flex-wrap gap-2">
                {event.attendees.slice(0, 10).map((attendee, index) => (
                  <div key={index} className="flex items-center p-2 bg-secondary-50 rounded-lg">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs font-semibold text-primary-600">
                        {attendee.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-secondary-700">{attendee.name}</span>
                  </div>
                ))}
                {event.attendees.length > 10 && (
                  <div className="flex items-center p-2 text-secondary-500">
                    +{event.attendees.length - 10} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventDetails