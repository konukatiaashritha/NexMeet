import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, Users, Calendar, MessageCircle, ChevronRight } from 'lucide-react'
import { communityAPI } from '../../services/communityService'
import LoadingSpinner from '../../components/common/LoadingSpinner'

function Communities() {
  const [search, setSearch] = useState('')

  const { data: communities = [], isLoading } = useQuery({
    queryKey: ['communities'],
    queryFn: communityAPI.getAllCommunities,
    staleTime: 2 * 60 * 1000,
  })

  const filtered = search.trim()
    ? communities.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.event?.title.toLowerCase().includes(search.toLowerCase())
      )
    : communities

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">Event Communities</h1>
            <p className="text-secondary-600">
              Connect with attendees, share updates, and discuss events
            </p>
          </div>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search communities..."
              className="w-full pl-10 pr-4 py-2.5 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="large" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              {search ? 'No matching communities' : 'No communities yet'}
            </h3>
            <p className="text-secondary-500">
              {search ? 'Try a different search' : 'Communities are created automatically for published events.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map(community => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CommunityCard({ community }) {
  const event = community.event
  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <Link to={`/events/${event?.id}/community`}>
      <div className="card p-6 hover:shadow-lg transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-secondary-900 line-clamp-2 mb-1">{community.name}</h3>
            {community.description && (
              <p className="text-sm text-secondary-500 line-clamp-2">{community.description}</p>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-secondary-400 ml-3 flex-shrink-0 mt-0.5" />
        </div>

        {event && (
          <div className="mt-3 p-3 bg-secondary-50 rounded-lg space-y-1">
            <div className="flex items-center text-xs text-secondary-600 gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(event.startDateTime)}</span>
            </div>
            <p className="text-xs text-secondary-500 capitalize">{event.category} • {event.organizer?.organizationName}</p>
          </div>
        )}

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-secondary-100">
          <span className="flex items-center text-sm text-secondary-600">
            <MessageCircle className="w-4 h-4 mr-1.5" />
            {community.postCount || 0} posts
          </span>
          <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full capitalize">
            {event?.category || 'community'}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default Communities
