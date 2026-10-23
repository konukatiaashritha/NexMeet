import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Calendar, MapPin, Users, BookmarkIcon, Clock,
  TrendingUp, Award, User, ArrowRight, UserPlus, Network
} from 'lucide-react'
import { eventsAPI } from '../../services/eventsService'
import { networkingAPI } from '../../services/networkingService'
import { notificationAPI } from '../../services/notificationService'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) +
    ' • ' + d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function Dashboard() {
  const { user } = useAuth()

  const { data: registeredData, isLoading: loadingRegistered } = useQuery({
    queryKey: ['registered-events'],
    queryFn: eventsAPI.getRegisteredEvents,
  })

  const { data: savedData, isLoading: loadingSaved } = useQuery({
    queryKey: ['saved-events'],
    queryFn: eventsAPI.getSavedEvents,
  })

  const { data: recommendedEvents } = useQuery({
    queryKey: ['recommended-events'],
    queryFn: () => eventsAPI.getEvents({ limit: 3, sort: 'newest' }),
  })

  const { data: connectionsData } = useQuery({
    queryKey: ['connections'],
    queryFn: networkingAPI.getConnections,
  })

  const { data: requestsData } = useQuery({
    queryKey: ['connection-requests'],
    queryFn: networkingAPI.getConnectionRequests,
  })

  const { data: notifData } = useQuery({
    queryKey: ['notifications-count'],
    queryFn: () => notificationAPI.getNotifications({ limit: 3 }),
    staleTime: 30 * 1000,
  })

  const allRegistered = registeredData?.data || []
  const allSaved = savedData?.data || []
  const connections = connectionsData || []
  const pendingCount = requestsData?.received?.length || 0
  const recentNotifs = notifData?.data?.slice(0, 3) || []

  const upcomingEvents = allRegistered
    .filter(e => e.derivedStatus === 'UPCOMING' || e.derivedStatus === 'ONGOING')
    .slice(0, 3)

  const nextEvent = upcomingEvents[0]

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Welcome back, {user?.firstName || user?.first_name || 'there'}!
          </h1>
          <p className="text-secondary-600">Here's what's happening in your network</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            title="Upcoming Events"
            value={upcomingEvents.length}
            color="bg-blue-500"
            link="/registered-events"
          />
          <StatCard
            icon={<BookmarkIcon className="w-6 h-6" />}
            title="Saved Events"
            value={allSaved.length}
            color="bg-purple-500"
            link="/saved-events"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Connections"
            value={connections.length}
            color="bg-green-500"
            link="/networking"
          />
          {pendingCount > 0 ? (
            <StatCard
              icon={<UserPlus className="w-6 h-6" />}
              title="Pending Requests"
              value={pendingCount}
              color="bg-orange-500"
              link="/networking"
            />
          ) : (
            <StatCard
              icon={<Network className="w-6 h-6" />}
              title="Events Registered"
              value={allRegistered.filter(e => e.registrationStatus === 'REGISTERED').length}
              color="bg-teal-500"
              link="/registered-events"
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Next Event */}
            {nextEvent && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-secondary-900">Next Event</h2>
                  <Link to="/registered-events" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                    View all <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="card p-6 border-l-4 border-primary-500">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full capitalize">
                        {nextEvent.category}
                      </span>
                      <h3 className="text-xl font-semibold text-secondary-900 mt-2 mb-3">{nextEvent.title}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-secondary-600 text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{formatDateTime(nextEvent.startDateTime)}</span>
                        </div>
                        {(nextEvent.location || nextEvent.city) && (
                          <div className="flex items-center text-secondary-600 text-sm">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{nextEvent.isOnline ? 'Online' : (nextEvent.location || nextEvent.city)}</span>
                          </div>
                        )}
                        <div className="flex items-center text-secondary-600 text-sm">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{nextEvent.registeredCount || 0} registered</span>
                        </div>
                      </div>
                    </div>
                    {nextEvent.derivedStatus === 'ONGOING' && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                        Live Now!
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <Link to={`/events/${nextEvent.id}`}>
                      <Button size="sm">View Event Details</Button>
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* Upcoming Events List */}
            {upcomingEvents.length > 1 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-secondary-900">Your Upcoming Events</h2>
                </div>
                <div className="space-y-3">
                  {upcomingEvents.slice(1).map(event => (
                    <Link key={event.id} to={`/events/${event.id}`}>
                      <div className="card p-4 hover:shadow-md transition-all flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary-700">
                            {new Date(event.startDateTime).toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()}
                          </span>
                          <span className="text-lg font-bold text-primary-700">
                            {new Date(event.startDateTime).getDate()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-secondary-900 truncate">{event.title}</h4>
                          <p className="text-sm text-secondary-500">{event.isOnline ? 'Online' : (event.city || event.location)}</p>
                        </div>
                        {event.certificateAvailable && (
                          <Award className="w-4 h-4 text-primary-500 flex-shrink-0" />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Discover More Events */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-secondary-900">Discover Events</h2>
                <Link to="/events" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(recommendedEvents?.data || []).slice(0, 4).map(event => (
                  <Link key={event.id} to={`/events/${event.id}`}>
                    <div className="card p-4 hover:shadow-md transition-all">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full capitalize">
                        {event.category}
                      </span>
                      <h4 className="font-medium text-secondary-900 mt-2 mb-1 line-clamp-2">{event.title}</h4>
                      <p className="text-xs text-secondary-500">{formatDate(event.startDateTime)}</p>
                      <p className="text-xs text-secondary-500">{event.isOnline ? 'Online' : event.city}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Profile Quick View */}
            <div className="card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
                  {user?.profile?.profilePhoto ? (
                    <img src={user.profile.profilePhoto} className="w-full h-full rounded-full object-cover" alt="Profile" />
                  ) : (
                    <User className="w-7 h-7 text-primary-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900">
                    {user?.firstName || user?.first_name} {user?.lastName || user?.last_name}
                  </h3>
                  <p className="text-sm text-secondary-500">
                    {user?.profile?.jobTitle || user?.profile?.field || 'NexMeet Member'}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-secondary-600 mb-4">
                <div className="flex justify-between">
                  <span>Profile complete</span>
                  <span className="font-medium text-primary-600">
                    {user?.profile?.about ? '80%' : '40%'}
                  </span>
                </div>
                <div className="w-full bg-secondary-100 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: user?.profile?.about ? '80%' : '40%' }}
                  />
                </div>
              </div>
              <Link to="/profile">
                <Button variant="outline" size="sm" className="w-full">Edit Profile</Button>
              </Link>
            </div>

            {/* Recent Notifications */}
            {recentNotifs.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-secondary-900">Recent Activity</h3>
                  <Link to="/notifications" className="text-primary-600 text-sm">View all</Link>
                </div>
                <div className="space-y-3">
                  {recentNotifs.map(notif => (
                    <div key={notif.id} className={`p-3 rounded-lg text-sm ${notif.isRead ? 'bg-secondary-50' : 'bg-primary-50'}`}>
                      <p className="font-medium text-secondary-900 line-clamp-1">{notif.title}</p>
                      <p className="text-secondary-500 text-xs mt-0.5 line-clamp-2">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="card p-6">
              <h3 className="font-semibold text-secondary-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { to: '/events', icon: Calendar, label: 'Discover Events' },
                  { to: '/networking', icon: Users, label: 'My Connections' },
                  { to: '/people', icon: UserPlus, label: 'Find People' },
                  { to: '/saved-events', icon: BookmarkIcon, label: 'Saved Events' },
                  { to: '/communities', icon: Network, label: 'Communities' },
                ].map(({ to, icon: Icon, label }) => (
                  <Link key={to} to={to} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary-50 transition-colors text-secondary-700 hover:text-primary-600">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{label}</span>
                    <ArrowRight className="w-3 h-3 ml-auto opacity-50" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, color, link }) {
  const content = (
    <div className="card p-6 hover:shadow-md transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 ${color} bg-opacity-10 rounded-lg flex items-center justify-center text-white`}
          style={{ background: `${color.replace('bg-', '')}20` }}>
          <span className={color.replace('bg-', 'text-')}>{icon}</span>
        </div>
      </div>
      <div className="text-3xl font-bold text-secondary-900 mb-1">{value}</div>
      <div className="text-sm text-secondary-600">{title}</div>
    </div>
  )
  return link ? <Link to={link}>{content}</Link> : content
}

export default Dashboard
