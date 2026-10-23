import React, { useState } from 'react'
import { MessageCircle, Pin, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { POST_TYPE_META } from '../../services/communityService'

/**
 * CommunityPost
 * A single post card in an event community feed.
 *
 * Props:
 *  - post: object
 *  - onReply: (post) => void — open reply panel
 */
function CommunityPost({ post, onReply }) {
  const [expanded, setExpanded] = useState(false)

  const meta = POST_TYPE_META[post.type] || POST_TYPE_META['discussion']
  const isLong = post.content?.length > 280

  const formatTime = (iso) => {
    const date = new Date(iso)
    const now  = new Date()
    const diff = Math.floor((now - date) / 1000)

    if (diff < 60)          return 'just now'
    if (diff < 3600)        return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400)       return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800)      return `${Math.floor(diff / 86400)}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className={`bg-white border rounded-xl p-5 hover:shadow-sm transition-shadow ${post.is_pinned ? 'border-primary-200 bg-primary-50/30' : 'border-secondary-200'}`}>
      {/* Top row: type badge + pin */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.color}`}>
            {meta.emoji} {meta.label}
          </span>
          {post.is_pinned && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 text-primary-600 text-xs rounded-full">
              <Pin className="w-3 h-3" />
              Pinned
            </span>
          )}
        </div>
        <span className="text-xs text-secondary-400">{formatTime(post.created_at)}</span>
      </div>

      {/* Title */}
      {post.title && (
        <h3 className="font-semibold text-secondary-900 mb-2 leading-snug">
          {post.title}
        </h3>
      )}

      {/* Content */}
      <div className="text-sm text-secondary-700 leading-relaxed">
        {isLong && !expanded
          ? post.content.slice(0, 280) + '...'
          : post.content}
      </div>

      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
        >
          {expanded
            ? <><ChevronUp className="w-3.5 h-3.5" />Show less</>
            : <><ChevronDown className="w-3.5 h-3.5" />Read more</>
          }
        </button>
      )}

      {/* Resource link */}
      {post.link && (
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-2 px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm text-primary-700 hover:bg-primary-50 hover:border-primary-300 transition-colors w-fit"
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          <span className="truncate max-w-xs">{post.link}</span>
        </a>
      )}

      {/* Author + reply row */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-secondary-100">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
            post.author.is_organizer
              ? 'bg-primary-100 text-primary-700'
              : 'bg-secondary-100 text-secondary-600'
          }`}>
            {post.author.name.charAt(0)}
          </div>
          <div className="leading-tight">
            <span className="text-xs font-medium text-secondary-900">{post.author.name}</span>
            {post.author.is_organizer && (
              <span className="ml-1.5 text-xs text-primary-600 font-medium">· Organizer</span>
            )}
            {post.author.org && !post.author.is_organizer && (
              <span className="ml-1 text-xs text-secondary-400">· {post.author.org}</span>
            )}
          </div>
        </div>

        <button
          onClick={() => onReply?.(post)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          {post.reply_count > 0 ? `${post.reply_count} replies` : 'Reply'}
        </button>
      </div>
    </div>
  )
}

export default CommunityPost
