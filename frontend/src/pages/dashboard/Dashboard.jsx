import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  Calendar, MapPin, Users, BookmarkIcon, Clock, 
  TrendingUp, Award, User, ArrowRight 
} from 'lucide-react'
import { eventsAPI } from '../../services/eventsService'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'
import CertificateBadge from '../../components/events/CertificateBadge'

function Dashboard() {
  const { user } = useAuth()

  const { data: registeredEvents, isLoading: loadingRegistered } = useQuery({
    queryKey: ['registered-events'],
    queryFn: eventsAPI.getRegisteredEvents,
  })

  const { data: savedEvents, isLoading: loadingSaved } = useQuery({
    queryKey: ['saved-events'],
    queryFn: eventsAPI.getSavedEvents,
  })

  const { data: recommendedEvents, isLoading: loadingRecommended } = useQuery({
    queryKey: ['recommended-events'],
    queryFn: () => eventsAPI.getEvents({ limit: 3, recommended: true }),
  })

  const upcomingEvents = registeredEvents?.events?.filter(event => 
    new Date(event.start_date) > new Date()
  ).slice(0, 3) || []

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-secondary-600">
            Here's what's happening in your network
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            title="Upcoming Events"
            value={upcomingEvents.length}
            color="bg-blue-500"
          />
          <StatCard
            icon={<BookmarkIcon className="w-6 h-6" />}
            title="Saved Events"
            value={savedEvents?.events?.length || 0}
            color="bg-green-500"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Network"
            value={user?.connections_count || 0}
            color="bg-purple-500"
          />
          <StatCard
            icon={<Award className="w-6 h-6" />}
            title="Events Attended"
            value={user?.events_attended || 0}
            color="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Events */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Upcoming Events</h2>
                <Link to="/registered-events" className="text-primary-600 hover:text-primary-700 font-medium">
                  View all <ArrowRight className="w-4 h-4 inline ml-1" />
                </Link>
              </div>

              {loadingRegistered ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : upcomingEvents.length === 0 ? (
                <EmptyState
                  icon={<Calendar className="w-8 h-8" />}
                  title="No upcoming events"
                  description="You haven't registered for any events yet"
                  action={
                    <Link to="/events">
                      <Button>Discover Events</Button>
                    </Link>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </section>

            {/* Recommended Events */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-primary-600 mr-2" />
                  <h2 className="text-xl font-semibold text-secondary-900">Recommended for You</h2>
                </div>
              </div>

              {loadingRecommended ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {recommendedEvents?.events?.slice(0, 3).map(event => (
                    <RecommendedEventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <ProfileCompletionCard user={user} />

            {/* Recent Activity */}
            <section>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Activity</h3>
              <div className="card p-4">
                <div className="space-y-3">
                  <ActivityItem
                    icon={<Users className="w-4 h-4 text-blue-500" />}
                    text="You registered for React Conference 2024"
                    time="2 hours ago"
                  />
                  <ActivityItem
                    icon={<BookmarkIcon className="w-4 h-4 text-green-500" />}
                    text="You saved 'AI in Healthcare' workshop"
                    time="1 day ago"
                  />
                  <ActivityItem
                    icon={<User className="w-4 h-4 text-purple-500" />}
                    text="Sarah Chen accepted your connection"
                    time="2 days ago"
                  />
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/events" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Explore Events
                  </Button>
                </Link>
                <Link to="/profile" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="w-4 h-4 mr-2" />
                    Update Profile
                  </Button>
                </Link>
                <Link to="/saved-events" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BookmarkIcon className="w-4 h-4 mr-2" />
                    Saved Events
                  </Button>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

// Component: Stat Card
function StatCard({ icon, title, value, color }) {
  return (
    <div className="card p-6">
      <div className="flex items-center">
        <div className={`${color} text-white rounded-lg p-3 mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-secondary-900">{value}</p>
          <p className="text-secondary-600 text-sm">{title}</p>
        </div>
      </div>
    </div>
  )
}

// Component: Event Card
function EventCard({ event }) {
  return (
    <Link to={`/events/${event.id}`} className="block">
      <div className="card p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-secondary-900 mb-2">{event.title}</h3>
            <div className="flex items-center text-secondary-600 text-sm mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(event.start_date)}
              {event.start_time && (
                <span className="ml-2">
                  • {new Date(`2000-01-01T${event.start_time}`).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              )}
            </div>
            {event.location && (
              <div className="flex items-center text-secondary-600 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                {event.location}
              </div>
            )}
            {event.certificate?.available && (
              <div className="mt-2">
                <CertificateBadge certificate={event.certificate} size="xs" />
              </div>
            )}
          </div>
          <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
            {event.category}
          </span>
        </div>
      </div>
    </Link>
  )
}

// Component: Recommended Event Card
function RecommendedEventCard({ event }) {
  return (
    <Link to={`/events/${event.id}`} className="block">
      <div className="card p-4 hover:shadow-md transition-shadow border-l-4 border-l-primary-500">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-secondary-900 flex-1">{event.title}</h3>
          <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full ml-2">
            {event.category}
          </span>
        </div>
        <p className="text-secondary-600 text-sm mb-3 line-clamp-2">{event.description}</p>
        <div className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded inline-block">
          Recommended: Matches your interests
        </div>
      </div>
    </Link>
  )
}

// Component: Profile Completion Card
function ProfileCompletionCard({ user }) {
  const completionFields = [
    { field: 'bio', label: 'Bio' },
    { field: 'skills', label: 'Skills' },
    { field: 'interests', label: 'Interests' },
    { field: 'career_field', label: 'Career Field' },
    { field: 'location', label: 'Location' },
  ]

  const completedFields = completionFields.filter(({ field }) => 
    user?.[field] && (Array.isArray(user[field]) ? user[field].length > 0 : true)
  ).length

  const completionPercentage = Math.round((completedFields / completionFields.length) * 100)

  if (completionPercentage === 100) return null

  return (
    <div className="card p-4">
      <h3 className="text-lg font-semibold text-secondary-900 mb-3">Complete Your Profile</h3>
      <div className="mb-3">
        <div className="flex justify-between text-sm text-secondary-600 mb-1">
          <span>{completionPercentage}% Complete</span>
        </div>
        <div className="w-full bg-secondary-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
      <p className="text-secondary-600 text-sm mb-3">
        Complete your profile to get better event recommendations
      </p>
      <Link to="/profile">
        <Button variant="outline" size="sm" className="w-full">
          Complete Profile
        </Button>
      </Link>
    </div>
  )
}

// Component: Activity Item
function ActivityItem({ icon, text, time }) {
  return (
    <div className="flex items-start">
      <div className="mr-3 mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-secondary-900 text-sm">{text}</p>
        <p className="text-secondary-500 text-xs">{time}</p>
      </div>
    </div>
  )
}

// Component: Empty State
function EmptyState({ icon, title, description, action }) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-secondary-400">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h3>
      <p className="text-secondary-600 mb-4">{description}</p>
      {action}
    </div>
  )
}

export default Dashboard