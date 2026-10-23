import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, Calendar, Users, TrendingUp, BarChart2,
  BadgeCheck, Edit, X, Eye, ChevronRight, Clock,
  CheckCircle, FileText, AlertTriangle,
} from 'lucide-react'
import { organizerAPI } from '../../services/organizerService'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'

const STATUS_META = {
  published:  { label: 'Published',  color: 'bg-green-100 text-green-700',   icon: CheckCircle },
  draft:      { label: 'Draft',      color: 'bg-secondary-100 text-secondary-500', icon: FileText },
  completed:  { label: 'Completed',  color: 'bg-blue-100 text-blue-700',     icon: CheckCircle },
  cancelled:  { label: 'Cancelled',  color: 'bg-red-100 text-red-600',       icon: X },
}

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

function OrganizerDashboard() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedEvent, setExpandedEvent] = useState(null)

  const { data: eventsData, isLoading: loadingEvents } = useQuery({
    queryKey: ['organizer-events', statusFilter],
    queryFn: () => organizerAPI.getMyEvents({ status: statusFilter || undefined }),
  })

  const { data: analytics, isLoading: loadingAnalytics } = useQuery({
    queryKey: ['organizer-analytics'],
    queryFn: organizerAPI.getAnalytics,
  })

  const { data: regData } = useQuery({
    queryKey: ['organizer-registrations', expandedEvent],
    queryFn: () => organizerAPI.getRegistrations(expandedEvent),
    enabled: !!expandedEvent,
  })

  const cancelMutation = useMutation({
    mutationFn: (id) => organizerAPI.cancelEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['organizer-events'])
      queryClient.invalidateQueries(['organizer-analytics'])
    },
  })

  const events = eventsData?.events || []

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-secondary-900">Organizer Dashboard</h1>
                {user?.organizer_verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verified Organizer
                  </span>
                )}
              </div>
              <p className="text-secondary-500 text-sm">
                Manage your events, registrations, and analytics.
              </p>
            </div>
            <Link to="/organizer/create-event">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Analytics cards ───────────────────────────────────────────── */}
        {loadingAnalytics ? (
          <div className="flex justify-center py-6"><LoadingSpinner /></div>
        ) : analytics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard icon={<Calendar className="w-5 h-5" />}  label="Total Events"        value={analytics.total_events}        color="bg-primary-500" />
            <StatCard icon={<CheckCircle className="w-5 h-5" />} label="Published"          value={analytics.published_events}    color="bg-green-500" />
            <StatCard icon={<Users className="w-5 h-5" />}      label="Total Registrations" value={analytics.total_registrations} color="bg-purple-500" />
            <StatCard icon={<BarChart2 className="w-5 h-5" />}  label="Fill Rate"           value={`${analytics.fill_rate}%`}     color="bg-orange-500" />
          </div>
        )}

        {/* ── Events list ───────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900">My Events</h2>
            {/* Status filter */}
            <div className="flex gap-2">
              {['', 'published', 'draft', 'completed', 'cancelled'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    statusFilter === s
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-secondary-600 border-secondary-300 hover:border-primary-400'
                  }`}
                >
                  {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loadingEvents ? (
            <div className="flex justify-center py-12"><LoadingSpinner /></div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-secondary-200">
              <Calendar className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
              <h3 className="font-semibold text-secondary-900 mb-1">No events yet</h3>
              <p className="text-secondary-500 text-sm mb-4">
                Create your first event to get started.
              </p>
              <Link to="/organizer/create-event">
                <Button size="sm"><Plus className="w-4 h-4 mr-1.5" />Create Event</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <OrganizerEventRow
                  key={event.id}
                  event={event}
                  isExpanded={expandedEvent === event.id}
                  registrations={expandedEvent === event.id ? regData?.registrations || [] : []}
                  onExpand={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                  onCancel={() => cancelMutation.mutate(event.id)}
                  isCancelling={cancelMutation.isLoading}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Recent registrations ──────────────────────────────────────── */}
        {analytics?.recent_registrations?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Recent Registrations</h2>
            <div className="bg-white border border-secondary-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary-50 border-b border-secondary-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wide">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wide hidden sm:table-cell">Organisation</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wide hidden md:table-cell">Registered</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {analytics.recent_registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-secondary-50">
                      <td className="px-4 py-3 font-medium text-secondary-900">{reg.user.name}</td>
                      <td className="px-4 py-3 text-secondary-500 hidden sm:table-cell">{reg.user.org}</td>
                      <td className="px-4 py-3 text-secondary-500 hidden md:table-cell">{formatDate(reg.registered_at)}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          {reg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Verified organizer nudge ───────────────────────────────────── */}
        {!user?.organizer_verified && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-start gap-4">
            <BadgeCheck className="w-8 h-8 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Get Verified Organizer Status</h3>
              <p className="text-sm text-blue-700">
                Verified organizers get a badge on all their events, higher visibility in search results,
                and access to advanced analytics. Contact us to apply.
              </p>
              <a
                href="mailto:organizers@nexmeet.com"
                className="inline-block mt-3 text-sm font-medium text-blue-700 hover:underline"
              >
                Apply for verification →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white border border-secondary-200 rounded-xl p-5 flex items-center gap-4">
      <div className={`${color} text-white rounded-lg p-2.5`}>{icon}</div>
      <div>
        <p className="text-xl font-bold text-secondary-900">{value}</p>
        <p className="text-xs text-secondary-500">{label}</p>
      </div>
    </div>
  )
}

// ── OrganizerEventRow ─────────────────────────────────────────────────────────
function OrganizerEventRow({ event, isExpanded, registrations, onExpand, onCancel, isCancelling }) {
  const statusMeta = STATUS_META[event.status] || STATUS_META.draft
  const StatusIcon = statusMeta.icon
  const fillPct = event.capacity
    ? Math.min(100, Math.round(((event.registered_count || 0) / event.capacity) * 100))
    : null

  return (
    <div className="bg-white border border-secondary-200 rounded-xl overflow-hidden">
      {/* Main row */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${statusMeta.color}`}>
                <StatusIcon className="w-3 h-3" />{statusMeta.label}
              </span>
              <span className="px-2 py-0.5 bg-secondary-100 text-secondary-600 text-xs rounded-full">
                {event.category}
              </span>
              {event.is_online ? (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">Online</span>
              ) : (
                <span className="px-2 py-0.5 bg-secondary-100 text-secondary-600 text-xs rounded-full">In-Person</span>
              )}
            </div>

            <Link to={`/events/${event.id}`} className="group">
              <h3 className="font-semibold text-secondary-900 group-hover:text-primary-700 transition-colors">
                {event.title}
              </h3>
            </Link>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-secondary-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(event.start_date)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {event.registered_count || 0}{event.capacity ? ` / ${event.capacity}` : ''} registered
              </span>
              {event.registration_deadline && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Deadline: {formatDate(event.registration_deadline)}
                </span>
              )}
            </div>

            {/* Fill bar */}
            {fillPct !== null && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 max-w-xs h-1.5 bg-secondary-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${fillPct >= 90 ? 'bg-red-400' : fillPct >= 70 ? 'bg-orange-400' : 'bg-primary-400'}`}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
                <span className="text-xs text-secondary-400">{fillPct}% full</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to={`/events/${event.id}`}>
              <button className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="View event">
                <Eye className="w-4 h-4" />
              </button>
            </Link>
            {event.status !== 'cancelled' && event.status !== 'completed' && (
              <Link to={`/organizer/create-event?edit=${event.id}`}>
                <button className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Edit event">
                  <Edit className="w-4 h-4" />
                </button>
              </Link>
            )}
            {event.status === 'published' && (
              <button
                onClick={onCancel}
                disabled={isCancelling}
                className="p-2 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Cancel event"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onExpand}
              className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="View registrations"
            >
              <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded registrations */}
      {isExpanded && (
        <div className="border-t border-secondary-100 bg-secondary-50 p-4">
          <p className="text-xs font-semibold text-secondary-500 uppercase tracking-wide mb-3">
            Registrations ({registrations.length})
          </p>
          {registrations.length === 0 ? (
            <p className="text-sm text-secondary-400">No registrations yet.</p>
          ) : (
            <div className="space-y-2">
              {registrations.map((reg) => (
                <div key={reg.id} className="flex items-center justify-between bg-white border border-secondary-200 rounded-lg px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-secondary-900">{reg.user.name}</p>
                    <p className="text-xs text-secondary-400">{reg.user.org} · {reg.user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-secondary-400">{formatDate(reg.registered_at)}</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">{reg.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OrganizerDashboard
