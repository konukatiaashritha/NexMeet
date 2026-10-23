import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Users, ArrowRight, RefreshCw, Sparkles } from 'lucide-react'
import { networkingAPI } from '../../services/networkingService'
import ConnectionCard from '../networking/ConnectionCard'
import LoadingSpinner from '../common/LoadingSpinner'
import Button from '../common/Button'
import { CONNECTION_STATUS } from '../../constants'

/**
 * PeopleYouMayKnow
 * Context-aware "People You May Want to Connect With" section
 * designed specifically for the Event Details page.
 *
 * Shows attendees or other users who are relevant to the viewer,
 * ranked by relevance and with clear WHY explanations.
 *
 * Props:
 *  - eventId: string | number — scopes recommendations to this event
 *  - eventName: string        — used in reason text ("Both attending X")
 *  - limit: number            — max cards shown (default 4)
 */
function PeopleYouMayKnow({ eventId, eventName, limit = 4 }) {
  const [refreshKey, setRefreshKey] = useState(0)

  const { data, isLoading, error } = useQuery({
    queryKey: ['people-you-may-know', eventId, refreshKey],
    queryFn: () =>
      networkingAPI.getRecommendations({
        eventId,
        eventContext: eventName,
        limit: limit + 2, // fetch a couple extra so we can filter connected
      }),
    staleTime: 5 * 60 * 1000,
  })

  const recommendations = data?.recommendations || []

  // Filter out already-connected people and cap to limit
  const visible = recommendations
    .filter((r) => r.connection_status !== CONNECTION_STATUS.CONNECTED)
    .slice(0, limit)

  const handleStatusChange = () => setRefreshKey((k) => k + 1)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || visible.length === 0) return null

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <div>
            <h2 className="text-lg font-semibold text-secondary-900">
              People You May Want to Connect With
            </h2>
            <p className="text-xs text-secondary-500 mt-0.5">
              Based on shared interests, skills, and event attendance
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="p-1.5 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-100 transition-colors"
            title="Refresh suggestions"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/people"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            See all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {visible.map((person) => (
          <ConnectionCard
            key={person.id}
            person={person}
            reasons={person.recommendation_reasons || []}
            showReasons
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 text-center">
        <Link to="/people">
          <Button variant="outline" size="sm">
            <Users className="w-4 h-4 mr-2" />
            Discover More People
          </Button>
        </Link>
      </div>
    </section>
  )
}

export default PeopleYouMayKnow
