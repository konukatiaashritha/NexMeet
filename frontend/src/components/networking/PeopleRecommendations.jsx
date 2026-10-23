import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Users, ArrowRight, RefreshCw } from 'lucide-react'
import { networkingAPI } from '../../services/networkingService'
import ConnectionCard from './ConnectionCard'
import LoadingSpinner from '../common/LoadingSpinner'
import Button from '../common/Button'
import { CONNECTION_STATUS } from '../../constants'

/**
 * PeopleRecommendations
 * Displays smart people-you-may-want-to-connect-with section.
 *
 * Props:
 *  - limit: number — max cards to show (default 3)
 *  - compact: boolean — compact mode for dashboard sidebar
 *  - showViewAll: boolean — show "View all" link
 *  - eventId: string — if provided, filter recommendations by event
 */
function PeopleRecommendations({ limit = 3, compact = false, showViewAll = true, eventId }) {
  const [refreshKey, setRefreshKey] = useState(0)

  const { data, isLoading, error } = useQuery({
    queryKey: ['people-recommendations', eventId, refreshKey],
    queryFn: () => networkingAPI.getRecommendations({ eventId, limit: limit + 2 }),
    staleTime: 5 * 60 * 1000, // 5 min cache
  })

  const recommendations = data?.recommendations || []

  // Filter out already-connected people and cap to limit
  const visible = recommendations
    .filter(r => r.connection_status !== CONNECTION_STATUS.CONNECTED)
    .slice(0, limit)

  const handleStatusChange = () => {
    // Refetch after a connection action
    setRefreshKey(k => k + 1)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || visible.length === 0) return null

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-600" />
          <h3 className={compact ? 'text-base font-semibold text-secondary-900' : 'text-xl font-semibold text-secondary-900'}>
            People You May Want to Connect With
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="p-1.5 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-100 transition-colors"
            title="Refresh suggestions"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {showViewAll && (
            <Link
              to="/people"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className={compact ? 'space-y-1' : 'grid grid-cols-1 gap-4'}>
        {visible.map((person) => (
          <ConnectionCard
            key={person.id}
            person={person}
            reasons={person.recommendation_reasons || []}
            showReasons={!compact}
            compact={compact}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {/* View all footer */}
      {showViewAll && !compact && (
        <div className="mt-4 text-center">
          <Link to="/people">
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Discover More People
            </Button>
          </Link>
        </div>
      )}
    </section>
  )
}

export default PeopleRecommendations
