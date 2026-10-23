import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, MapPin, Building, UserPlus, UserCheck, UserX, Clock, X, MessageCircle } from 'lucide-react'
import { networkingAPI } from '../../services/networkingService'
import Button from '../common/Button'
import { CONNECTION_STATUS } from '../../constants'

/**
 * ConnectionCard
 * Displays a user card with their profile info, skills, interests,
 * networking intent, and a connection action button.
 *
 * Props:
 *  - person: user object
 *  - reasons: string[] — why this person is recommended
 *  - showReasons: boolean — show explanation
 *  - compact: boolean — smaller layout for sidebars
 *  - onStatusChange: (userId, newStatus) => void
 */
function ConnectionCard({ person, reasons = [], showReasons = false, compact = false, onStatusChange }) {
  const [connectionStatus, setConnectionStatus] = useState(
    person.connection_status || CONNECTION_STATUS.NONE
  )
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      await networkingAPI.sendConnectionRequest(person.id)
      setConnectionStatus(CONNECTION_STATUS.PENDING_SENT)
      onStatusChange?.(person.id, CONNECTION_STATUS.PENDING_SENT)
    } catch (err) {
      console.error('Failed to send connection request:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelRequest = async () => {
    setIsLoading(true)
    try {
      await networkingAPI.cancelConnectionRequest(person.id)
      setConnectionStatus(CONNECTION_STATUS.NONE)
      onStatusChange?.(person.id, CONNECTION_STATUS.NONE)
    } catch (err) {
      console.error('Failed to cancel request:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async () => {
    setIsLoading(true)
    try {
      await networkingAPI.respondToConnection(person.connection_id, 'accept')
      setConnectionStatus(CONNECTION_STATUS.CONNECTED)
      onStatusChange?.(person.id, CONNECTION_STATUS.CONNECTED)
    } catch (err) {
      console.error('Failed to accept request:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecline = async () => {
    setIsLoading(true)
    try {
      await networkingAPI.respondToConnection(person.connection_id, 'decline')
      setConnectionStatus(CONNECTION_STATUS.NONE)
      onStatusChange?.(person.id, CONNECTION_STATUS.NONE)
    } catch (err) {
      console.error('Failed to decline request:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async () => {
    setIsLoading(true)
    try {
      await networkingAPI.removeConnection(person.connection_id || person.id)
      setConnectionStatus(CONNECTION_STATUS.NONE)
      onStatusChange?.(person.id, CONNECTION_STATUS.NONE)
    } catch (err) {
      console.error('Failed to remove connection:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = () => {
    const first = person.first_name?.[0] || ''
    const last = person.last_name?.[0] || ''
    return (first + last).toUpperCase() || '?'
  }

  const fullName = `${person.first_name || ''} ${person.last_name || ''}`.trim()

  // ── Compact layout (sidebar / dashboard widget) ──────────────────
  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
          {person.profile_picture ? (
            <img src={person.profile_picture} alt={fullName} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-primary-600">{getInitials()}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-secondary-900 truncate">{fullName}</p>
          {person.college_company && (
            <p className="text-xs text-secondary-500 truncate">{person.college_company}</p>
          )}
        </div>

        {/* Action */}
        <ConnectButton
          status={connectionStatus}
          isLoading={isLoading}
          compact
          onConnect={handleConnect}
          onCancel={handleCancelRequest}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onRemove={handleRemove}
        />
      </div>
    )
  }

  // ── Full card layout ──────────────────────────────────────────────
  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      {/* Top row: avatar + basic info + action */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
          {person.profile_picture ? (
            <img src={person.profile_picture} alt={fullName} className="w-14 h-14 rounded-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-primary-600">{getInitials()}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-secondary-900 text-base leading-tight">{fullName}</h3>

          {person.career_field && (
            <p className="text-sm text-secondary-600 mt-0.5 capitalize">
              {person.experience_level && `${person.experience_level} · `}{person.career_field}
            </p>
          )}

          {person.college_company && (
            <div className="flex items-center gap-1 mt-1">
              <Building className="w-3.5 h-3.5 text-secondary-400 flex-shrink-0" />
              <span className="text-xs text-secondary-500 truncate">{person.college_company}</span>
            </div>
          )}

          {person.location && (
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-secondary-400 flex-shrink-0" />
              <span className="text-xs text-secondary-500 truncate">{person.location}</span>
            </div>
          )}
        </div>

        {/* Connection action */}
        <ConnectButton
          status={connectionStatus}
          isLoading={isLoading}
          onConnect={handleConnect}
          onCancel={handleCancelRequest}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onRemove={handleRemove}
        />
      </div>

      {/* Bio */}
      {person.bio && (
        <p className="text-sm text-secondary-600 mt-3 line-clamp-2">{person.bio}</p>
      )}

      {/* Skills */}
      {person.skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {person.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
            >
              {skill}
            </span>
          ))}
          {person.skills.length > 5 && (
            <span className="px-2 py-0.5 bg-secondary-100 text-secondary-500 text-xs rounded-full">
              +{person.skills.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Interests */}
      {person.interests?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {person.interests.slice(0, 4).map((interest) => (
            <span
              key={interest}
              className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full"
            >
              {interest}
            </span>
          ))}
        </div>
      )}

      {/* Networking intent */}
      {person.networking_goals?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-secondary-100">
          <p className="text-xs text-secondary-500 mb-1.5">Looking to:</p>
          <div className="flex flex-wrap gap-1.5">
            {person.networking_goals.slice(0, 3).map((goal) => (
              <span
                key={goal}
                className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full"
              >
                {formatGoal(goal)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Attending events */}
      {person.attending_events?.length > 0 && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-secondary-500">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
          Attending: {person.attending_events[0]}
        </div>
      )}

      {/* Recommendation reasons */}
      {showReasons && reasons.length > 0 && (
        <div className="mt-3 pt-3 border-t border-secondary-100">
          <p className="text-xs text-secondary-500 mb-1.5">Suggested because:</p>
          <ul className="space-y-0.5">
            {reasons.map((reason, i) => (
              <li key={i} className="flex items-center gap-1.5 text-xs text-secondary-600">
                <span className="text-green-500">✓</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Message button for connected users */}
      {connectionStatus === CONNECTION_STATUS.CONNECTED && (
        <div className="mt-3 pt-3 border-t border-secondary-100">
          <Link to={`/messages?user=${person.id}`}>
            <Button variant="outline" size="sm" className="w-full">
              <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
              Message
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

// ── ConnectButton sub-component ──────────────────────────────────────────────
function ConnectButton({ status, isLoading, compact, onConnect, onCancel, onAccept, onDecline, onRemove }) {
  if (status === CONNECTION_STATUS.NONE) {
    return (
      <Button
        size={compact ? 'sm' : 'sm'}
        onClick={onConnect}
        loading={isLoading}
        className="flex-shrink-0"
      >
        <UserPlus className="w-3.5 h-3.5 mr-1" />
        Connect
      </Button>
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
        {!compact && 'Pending'}
        <X className="w-3 h-3 ml-0.5" />
      </button>
    )
  }

  if (status === CONNECTION_STATUS.PENDING_RECEIVED) {
    return (
      <div className="flex gap-1.5 flex-shrink-0">
        <button
          onClick={onAccept}
          disabled={isLoading}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
        >
          <UserCheck className="w-3.5 h-3.5" />
          {!compact && 'Accept'}
        </button>
        <button
          onClick={onDecline}
          disabled={isLoading}
          className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-secondary-600 bg-secondary-100 hover:bg-secondary-200 rounded-lg transition-colors"
          title="Decline"
        >
          <UserX className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  if (status === CONNECTION_STATUS.CONNECTED) {
    return (
      <button
        onClick={onRemove}
        disabled={isLoading}
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors flex-shrink-0 group"
        title="Remove connection"
      >
        <UserCheck className="w-3.5 h-3.5 group-hover:hidden" />
        <UserX className="w-3.5 h-3.5 hidden group-hover:block" />
        {!compact && <span className="group-hover:hidden">Connected</span>}
        {!compact && <span className="hidden group-hover:block">Remove</span>}
      </button>
    )
  }

  return null
}

// ── Helpers ──────────────────────────────────────────────────────────────────
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

export default ConnectionCard
