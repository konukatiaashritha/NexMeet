import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Calendar, ArrowRight } from 'lucide-react'
import { eventsAPI } from '../../services/eventsService'

/**
 * SimilarEvents
 * Shows similar events in the EventDetails sidebar.
 * Matches by category and excludes the current event.
 */
function SimilarEvents({ eventId, category }) {
  const { data } = useQuery({
    queryKey: ['events', '', { category }],
    queryFn: () => eventsAPI.getEvents({ category }),
    staleTime: 5 * 60 * 1000,
  })

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const similar = (data?.events || [])
    .filter((e) => String(e.id) !== String(eventId) && new Date(e.start_date) > new Date())
    .slice(0, 3)

  if (similar.length === 0) return null

  return (
    <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-5">
      <h3 className="font-semibold text-secondary-900 mb-3 text-sm">Similar Events</h3>
      <div className="space-y-3">
        {similar.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="flex items-start gap-3 group"
          >
            {/* Category emoji avatar */}
            <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 text-base">
              {event.category === 'workshop'     ? '🛠️'
               : event.category === 'meetup'     ? '🤝'
               : event.category === 'startup'    ? '🚀'
               : event.category === 'conference' ? '🎤'
               : event.category === 'hackathon'  ? '💻'
               : '📅'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 group-hover:text-primary-700 transition-colors line-clamp-2 leading-snug">
                {event.title}
              </p>
              <p className="text-xs text-secondary-400 mt-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(event.start_date)}
              </p>
              <p className="text-xs font-semibold text-secondary-700 mt-0.5">
                {event.price === 0 || event.price == null ? 'Free' : `$${event.price}`}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <Link
        to={`/events?category=${category}`}
        className="flex items-center gap-1 mt-4 text-xs text-primary-600 hover:text-primary-700 font-medium"
      >
        More {category} events <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}

export default SimilarEvents
