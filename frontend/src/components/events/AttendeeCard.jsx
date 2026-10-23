import React, { useState } from 'react'
import { Building, MapPin, UserPlus, UserCheck, UserX, Clock, X } from 'lucide-react'
import { networkingAPI } from '../../services/networkingService'
import { CONNECTION_STATUS } from '../../constants'

/**
 * AttendeeCard
 * Displays a rich attendee card on the Event Details "Who's Going?" section.
 *
 * Props:
 *  - attendee: object — full attendee profile
 *  - reasons: string[] — why this person is relevant to the viewer
 *  - showReasons: boolean
 *  - onStatusChange: () => void — callback after connection action
 */
function AttendeeCard({ attendee, reasons = [], showReasons = false, onStatusChange }) {
  const [connectionStatus, setConnectionStatus] = useState(
    attendee.connection_status || CONNECTION_STATUS.NONE
  )
  const [isLoading, setIsLoading] = useState(false)

  const getInitials = () => {
    const f = attendee.first_name?.[0] || ''
    const l = attendee.last_name?.[0] || ''
    return (f + l).toUpperCase() || '?'
  }

  const fullName = `${attendee.first_name || ''} ${attendee.last_name || ''}`.trim()

  const avatarColors = [
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-green-100 text-green-700',
    'bg-orange-100 text-orange-700',
    'bg-pink-100 text-pink-700',
    'bg-teal-100 text-teal-700',
  ]
  const colorClass = avatarColors[(attendee.id || 0) % avatarColors.length]

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      await networkingAPI.sendConnectionRequest(attendee.id)
      setConnectionStatus(CONNECTION_STATUS.PENDING_SENT)
      onStatusChange?.()
    } catch (err) {
      console.error('Failed to send connection request:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelRequest = async () => {
    setIsLoading(true)
    try {
      await networkingAPI.cancelConnectionRequest(attendee.id)
      setConnectionStatus(CONNECTION_STATUS.NONE)
      onStatusChange?.()
    } catch (err) {
      console.error('Failed to cancel request:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async () => {
    setIsLoading(true)
    try {
      await networkingAPI.respondToConnection(attendee.connection_id, 'accept')
      setConnectionStatus(CONNECTION_STATUS.CONNECTED)
      onStatusChange?.()
    } catch (err) {
      console.error('Failed to accept request:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white border border-secondary-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      {/* Top row: avatar + basic info + connect button */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-base ${colorClass}`}>
          {attendee.profile_picture ? (
            <img
              src={attendee.profile_picture}
              alt={fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            getInitials()
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-secondary-900 text-sm leading-tight truncate">
            {fullName}
          </h4>

          {(attendee.career_field || attendee.experience_level) && (
            <p className="text-xs text-secondary-500 mt-0.5 capitalize">
              {[attendee.experience_level, attendee.career_field]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}

          {attendee.college_company && (
            <div className="flex items-center gap-1 mt-1">
              <Building className="w-3 h-3 text-secondary-400 flex-shrink-0" />
              <span className="text-xs text-secondary-500 truncate">
                {attendee.college_company}
              </span>
            </div>
          )}
        </div>

        {/* Connect button */}
        <ConnectButton
          status={connectionStatus}
          isLoading={isLoading}
          onConnect={handleConnect}
          onCancel={handleCancelRequest}
          onAccept={handleAccept}
        />
      </div>

      {/* Skills */}
      {attendee.skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {attendee.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
            >
              {skill}
            </span>
          ))}
          {attendee.skills.length > 4 && (
            <span className="px-2 py-0.5 bg-secondary-100 text-secondary-500 text-xs rounded-full">
              +{attendee.skills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Networking intent chips */}
      {attendee.networking_goals?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {attendee.networking_goals.slice(0, 2).map((goal) => (
            <span
              key={goal}
              className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full"
            >
              {formatGoal(goal)}
            </span>
          ))}
        </div>
      )}

      {/* Recommendation reasons */}
      {showReasons && reasons.length > 0 && (
        <div className="mt-3 pt-3 border-t border-secondary-100">
          <ul className="space-y-0.5">
            {reasons.slice(0, 2).map((reason, i) => (
              <li key={i} className="flex items-center gap-1.5 text-xs text-secondary-600">
                <span className="text-green-500 flex-shrink-0">✓</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/* ── Connect button variants ─────────────────────────────────── */
function ConnectButton({ status, isLoading, onConnect, onCancel, onAccept }) {
  if (status === CONNECTION_STATUS.NONE) {
    return (
      <button
        onClick={onConnect}
        disabled={isLoading}
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50"
      >
        <UserPlus className="w-3.5 h-3.5" />
        Connect
      </button>
    )
  }

  if (status === CONNECTION_STATUS.PENDING_SENT) {
    return (
      <button
        onClick={onCancel}
        disabled={isLoading}
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-secondary-600 bg-secondary-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors flex-shrink-0"
        title="Cancel request"
      >
        <Clock className="w-3.5 h-3.5" />
        Pending
        <X className="w-3 h-3 ml-0.5" />
      </button>
    )
  }

  if (status === CONNECTION_STATUS.PENDING_RECEIVED) {
    return (
      <button
        onClick={onAccept}
        disabled={isLoading}
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex-shrink-0"
      >
        <UserCheck className="w-3.5 h-3.5" />
        Accept
      </button>
    )
  }

  if (status === CONNECTION_STATUS.CONNECTED) {
    return (
      <span className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg flex-shrink-0">
        <UserCheck className="w-3.5 h-3.5" />
        Connected
      </span>
    )
  }

  return null
}

/* ── Helpers ─────────────────────────────────────────────────── */
function formatGoal(goal) {
  const map = {
    meet_people: '🤝 Meet people',
    learn: '📚 Learn',
    find_mentor: '🧑‍🏫 Find mentor',
    career_opportunities: '💼 Career',
    startup_collaborators: '🚀 Startups',
    research_collaborators: '🔬 Research',
    meet_professionals: '👥 Professionals',
    meet_students: '🎓 Students',
    project_teammates: '💻 Teammates',
    build_network: '🌐 Network',
  }
  return map[goal] || goal
}

export default AttendeeCard
