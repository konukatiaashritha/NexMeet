import React, { useState } from 'react'
import { Star, ChevronDown, ChevronUp } from 'lucide-react'
import Button from '../common/Button'

// ── Mock reviews ──────────────────────────────────────────────────────────────
const MOCK_REVIEWS = [
  {
    id: 1,
    author: { name: 'Sarah Johnson', org: 'Tech Corp', initials: 'SJ' },
    created_at: '2026-11-15T00:00:00Z',
    ratings: { overall: 5, content: 5, speaker: 5, organization: 4, networking: 5 },
    comment: 'Absolutely fantastic workshop. The hands-on approach made complex ML concepts very accessible. The instructors were incredibly knowledgeable and the exercises were challenging but manageable. Will definitely attend again!',
  },
  {
    id: 2,
    author: { name: 'Rahul Sharma', org: 'Tech University', initials: 'RS' },
    created_at: '2026-11-16T00:00:00Z',
    ratings: { overall: 4, content: 4, speaker: 5, organization: 3, networking: 4 },
    comment: 'Great content overall. The speakers were excellent and clearly passionate about the subject. Could have been better organized — some sessions ran over time. The networking opportunities were a highlight.',
  },
  {
    id: 3,
    author: { name: 'Aashritha Reddy', org: 'DesignCo', initials: 'AR' },
    created_at: '2026-11-17T00:00:00Z',
    ratings: { overall: 5, content: 4, speaker: 4, organization: 5, networking: 5 },
    comment: 'Even as a designer with limited ML background I found the workshop very welcoming. The beginner-friendly approach was genuine, not just a label. Met some amazing people!',
  },
]

const RATING_LABELS = [
  { key: 'overall',      label: 'Overall' },
  { key: 'content',      label: 'Content' },
  { key: 'speaker',      label: 'Speaker' },
  { key: 'organization', label: 'Organisation' },
  { key: 'networking',   label: 'Networking' },
]

// ── StarRating ────────────────────────────────────────────────────────────────
function StarRating({ value, onChange, size = 'md' }) {
  const [hovered, setHovered] = useState(0)
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={`transition-colors ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <Star
            className={`${sizeClass} ${
              star <= (hovered || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-secondary-300'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

// ── ReviewCard ────────────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = review.comment?.length > 200

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const avgRating =
    Object.values(review.ratings).reduce((a, b) => a + b, 0) /
    Object.values(review.ratings).length

  return (
    <div className="border border-secondary-200 rounded-xl p-4 bg-secondary-50/50">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-700 flex-shrink-0">
            {review.author.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-secondary-900">{review.author.name}</p>
            <p className="text-xs text-secondary-400">{review.author.org} · {formatDate(review.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <StarRating value={Math.round(avgRating)} size="sm" />
          <span className="text-sm font-semibold text-secondary-700">{avgRating.toFixed(1)}</span>
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm text-secondary-700 leading-relaxed">
        {isLong && !expanded ? review.comment.slice(0, 200) + '...' : review.comment}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
        >
          {expanded ? <><ChevronUp className="w-3.5 h-3.5" />Less</> : <><ChevronDown className="w-3.5 h-3.5" />More</>}
        </button>
      )}

      {/* Category ratings */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 pt-3 border-t border-secondary-200">
        {RATING_LABELS.map(({ key, label }) => (
          <div key={key} className="text-center">
            <p className="text-xs text-secondary-400 mb-0.5">{label}</p>
            <StarRating value={review.ratings[key]} size="sm" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── WriteReviewForm ───────────────────────────────────────────────────────────
function WriteReviewForm({ onSubmit, onCancel }) {
  const [ratings, setRatings] = useState({
    overall: 0, content: 0, speaker: 0, organization: 0, networking: 0,
  })
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!ratings.overall || !comment.trim()) return
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 600)) // simulate API
    setIsSubmitting(false)
    setSubmitted(true)
    onSubmit?.({ ratings, comment })
  }

  if (submitted) {
    return (
      <div className="text-center py-8 bg-green-50 border border-green-200 rounded-xl">
        <div className="text-3xl mb-2">⭐</div>
        <p className="font-semibold text-green-800">Thank you for your review!</p>
        <p className="text-sm text-green-600 mt-1">Your feedback helps others discover great events.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-primary-50 border border-primary-200 rounded-xl p-5">
      <h4 className="font-semibold text-secondary-900 mb-4">Write Your Review</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {RATING_LABELS.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className={`text-sm ${key === 'overall' ? 'font-semibold text-secondary-900' : 'text-secondary-600'}`}>
              {label} {key === 'overall' && '*'}
            </span>
            <StarRating
              value={ratings[key]}
              onChange={(val) => setRatings((r) => ({ ...r, [key]: val }))}
            />
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label className="label text-sm">Your Experience *</label>
        <textarea
          rows={4}
          className="input resize-none text-sm"
          placeholder="Share what you found most valuable, what could be improved, and whether you'd recommend this event..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          loading={isSubmitting}
          disabled={!ratings.overall || !comment.trim()}
        >
          Submit Review
        </Button>
      </div>
    </form>
  )
}

// ── EventReviews (main export) ────────────────────────────────────────────────
function EventReviews({ eventId, isPastEvent, isAuthenticated }) {
  const [showForm, setShowForm] = useState(false)
  const [localReviews, setLocalReviews] = useState([])

  // Only show reviews for past/relevant events; mock reviews for demo
  const reviews = [...localReviews, ...MOCK_REVIEWS]

  const avgOverall =
    reviews.reduce((sum, r) => sum + r.ratings.overall, 0) / reviews.length

  const avgByCategory = RATING_LABELS.reduce((acc, { key }) => {
    acc[key] = reviews.reduce((sum, r) => sum + r.ratings[key], 0) / reviews.length
    return acc
  }, {})

  const handleSubmit = (data) => {
    const newReview = {
      id: Date.now(),
      author: { name: 'You', org: 'Your Organisation', initials: 'YO' },
      created_at: new Date().toISOString(),
      ratings: data.ratings,
      comment: data.comment,
    }
    setLocalReviews((prev) => [newReview, ...prev])
    setShowForm(false)
  }

  return (
    <div id="reviews">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
            Reviews
          </h2>
          <p className="text-xs text-secondary-500 mt-0.5">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''} from attendees
          </p>
        </div>
        {isAuthenticated && isPastEvent && !showForm && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            ⭐ Write Review
          </Button>
        )}
      </div>

      {/* Write review form */}
      {showForm && (
        <div className="mb-5">
          <WriteReviewForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Summary bar */}
      {reviews.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl mb-5">
          <div className="text-center flex-shrink-0">
            <p className="text-4xl font-bold text-secondary-900">{avgOverall.toFixed(1)}</p>
            <StarRating value={Math.round(avgOverall)} />
            <p className="text-xs text-secondary-500 mt-0.5">{reviews.length} reviews</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 flex-1">
            {RATING_LABELS.slice(1).map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-secondary-500 w-20">{label}</span>
                <div className="flex-1 h-1.5 bg-secondary-200 rounded-full">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${(avgByCategory[key] / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-secondary-700 w-6">
                  {avgByCategory[key].toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review list */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 bg-secondary-50 rounded-xl">
          <p className="text-secondary-500 text-sm">No reviews yet. Be the first to review this event!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Auth nudge */}
      {!isAuthenticated && (
        <p className="text-xs text-secondary-400 text-center mt-4">
          Sign in to write a review.
        </p>
      )}
      {isAuthenticated && !isPastEvent && (
        <p className="text-xs text-secondary-400 text-center mt-4">
          Reviews are available after the event has taken place.
        </p>
      )}
    </div>
  )
}

export default EventReviews
