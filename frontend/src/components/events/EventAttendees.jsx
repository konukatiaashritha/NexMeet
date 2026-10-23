import React, { useState, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Search, Filter, Users, X, RefreshCw, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react'
import { networkingAPI } from '../../services/networkingService'
import AttendeeCard from './AttendeeCard'
import LoadingSpinner from '../common/LoadingSpinner'
import Button from '../common/Button'

const ATTENDEE_FILTERS = [
  { id: 'all', label: 'Everyone' },
  { id: 'same_college', label: 'Same College' },
  { id: 'same_company', label: 'Same Company' },
  { id: 'similar_skills', label: 'Similar Skills' },
  { id: 'similar_interests', label: 'Similar Interests' },
  { id: 'students', label: 'Students' },
  { id: 'professionals', label: 'Professionals' },
  { id: 'mentors', label: 'Mentors' },
  { id: 'open_to_networking', label: 'Open to Networking' },
]

/**
 * EventAttendees
 * Full "Who's Going?" section for the Event Details page.
 *
 * Props:
 *  - eventId: string | number
 *  - isRegistered: boolean — whether current user is registered
 *  - attendanceVisible: boolean — current user's visibility setting
 *  - onToggleVisibility: (visible: boolean) => void
 */
function EventAttendees({ eventId, isRegistered, attendanceVisible, onToggleVisibility }) {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['event-attendees', eventId, refreshKey],
    queryFn: () => networkingAPI.getEventAttendees(eventId),
    staleTime: 2 * 60 * 1000,
  })

  const attendees = data?.attendees || []
  const totalAttendees = data?.total_attendees || attendees.length
  const visibleCount = data?.visible_attendees || attendees.filter(a => a.attendance_visible).length

  // Apply filter + search client-side
  const filtered = useMemo(() => {
    let result = attendees.filter((a) => a.attendance_visible !== false)

    // Filter chip
    if (activeFilter === 'same_college') {
      result = result.filter((a) => a.college_company?.toLowerCase().includes('university') || a.college_company?.toLowerCase().includes('college') || a.college_company?.toLowerCase().includes('institute'))
    } else if (activeFilter === 'same_company') {
      result = result.filter((a) => a.college_company && !a.college_company?.toLowerCase().includes('university'))
    } else if (activeFilter === 'similar_skills') {
      result = result.filter((a) => a.skills?.length > 0)
    } else if (activeFilter === 'similar_interests') {
      result = result.filter((a) => a.interests?.length > 0)
    } else if (activeFilter === 'students') {
      result = result.filter((a) => a.experience_level === 'student')
    } else if (activeFilter === 'professionals') {
      result = result.filter((a) => ['entry', 'mid', 'senior', 'executive'].includes(a.experience_level))
    } else if (activeFilter === 'mentors') {
      result = result.filter((a) => a.looking_for?.includes('mentors') || a.networking_goals?.includes('find_mentor'))
    } else if (activeFilter === 'open_to_networking') {
      result = result.filter((a) => a.networking_goals?.length > 0)
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((a) => {
        const name = `${a.first_name} ${a.last_name}`.toLowerCase()
        return (
          name.includes(q) ||
          a.college_company?.toLowerCase().includes(q) ||
          a.career_field?.toLowerCase().includes(q) ||
          a.skills?.some((s) => s.toLowerCase().includes(q)) ||
          a.interests?.some((i) => i.toLowerCase().includes(q))
        )
      })
    }

    return result
  }, [attendees, activeFilter, search])

  const handleStatusChange = () => {
    queryClient.invalidateQueries(['event-attendees', eventId])
    setRefreshKey((k) => k + 1)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-secondary-500 text-sm">
        Could not load attendees. Please try again.
      </div>
    )
  }

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-secondary-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-600" />
            Who's Going?
          </h2>
          <p className="text-sm text-secondary-500 mt-0.5">
            {totalAttendees} registered •{' '}
            {visibleCount} made their attendance visible
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="p-2 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-100 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
              showFilters
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-secondary-600 border-secondary-300 hover:border-primary-400'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {showFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Attendance visibility toggle for registered users */}
      {isRegistered && (
        <div className="mb-4 flex items-center justify-between px-4 py-3 bg-primary-50 border border-primary-200 rounded-xl">
          <div className="flex items-center gap-2">
            {attendanceVisible ? (
              <Eye className="w-4 h-4 text-primary-600" />
            ) : (
              <EyeOff className="w-4 h-4 text-secondary-400" />
            )}
            <div>
              <p className="text-sm font-medium text-secondary-900">
                {attendanceVisible ? 'Your attendance is visible' : 'Your attendance is hidden'}
              </p>
              <p className="text-xs text-secondary-500">
                {attendanceVisible
                  ? 'Others can see you in this list'
                  : 'You are not shown to other attendees'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onToggleVisibility?.(!attendanceVisible)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              attendanceVisible ? 'bg-primary-600' : 'bg-secondary-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                attendanceVisible ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      )}

      {/* Search bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
        <input
          type="text"
          placeholder="Search attendees by name, skill, or company..."
          className="w-full pl-9 pr-9 py-2.5 border border-secondary-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter chips */}
      {showFilters && (
        <div className="mb-4 flex flex-wrap gap-2 p-4 bg-secondary-50 rounded-xl border border-secondary-200">
          {ATTENDEE_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                activeFilter === f.id
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-secondary-600 border-secondary-300 hover:border-primary-400'
              }`}
            >
              {f.label}
            </button>
          ))}
          {(activeFilter !== 'all' || search) && (
            <button
              onClick={() => { setActiveFilter('all'); setSearch('') }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-all ml-auto"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      )}

      {/* Quick filter row when panel is closed */}
      {!showFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {ATTENDEE_FILTERS.slice(0, 5).map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                activeFilter === f.id
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-secondary-600 border-secondary-300 hover:border-primary-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {(activeFilter !== 'all' || search) && (
        <p className="text-xs text-secondary-500 mb-3">
          Showing {filtered.length} of {attendees.filter(a => a.attendance_visible !== false).length} visible attendees
        </p>
      )}

      {/* Attendee grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-secondary-400" />
          </div>
          <p className="text-secondary-600 font-medium">No attendees found</p>
          <p className="text-secondary-400 text-sm mt-1">
            {search || activeFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Be the first to make your attendance visible!'}
          </p>
          {(search || activeFilter !== 'all') && (
            <button
              onClick={() => { setSearch(''); setActiveFilter('all') }}
              className="mt-3 text-sm text-primary-600 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((attendee) => (
            <AttendeeCard
              key={attendee.id}
              attendee={attendee}
              reasons={attendee.recommendation_reasons || []}
              showReasons={attendee.recommendation_reasons?.length > 0}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Show hidden count nudge */}
      {totalAttendees > visibleCount && (
        <p className="text-xs text-secondary-400 text-center mt-4">
          {totalAttendees - visibleCount} attendee{totalAttendees - visibleCount !== 1 ? 's' : ''} chose to keep their attendance private
        </p>
      )}
    </div>
  )
}

export default EventAttendees
