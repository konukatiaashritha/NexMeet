import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageCircle, Send, Trash2, ArrowLeft, Users } from 'lucide-react'
import { communityAPI } from '../../services/communityService'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'

const formatTime = (d) => {
  const date = new Date(d)
  const now = new Date()
  const diff = now - date
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

function EventCommunity() {
  const { eventId } = useParams()
  const { user, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [newPostContent, setNewPostContent] = useState('')
  const [expandedComments, setExpandedComments] = useState({})
  const [newComments, setNewComments] = useState({})
  const [page, setPage] = useState(1)

  const { data: communityData } = useQuery({
    queryKey: ['community', eventId],
    queryFn: () => communityAPI.getCommunity(eventId),
  })

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['community-posts', eventId, page],
    queryFn: () => communityAPI.getCommunityPosts(eventId, { page, limit: 20 }),
    keepPreviousData: true,
  })

  const invalidate = () => queryClient.invalidateQueries(['community-posts', eventId])

  const createPostMutation = useMutation({
    mutationFn: (content) => communityAPI.createPost(eventId, content),
    onSuccess: () => { setNewPostContent(''); invalidate() },
  })

  const deletePostMutation = useMutation({
    mutationFn: (id) => communityAPI.deletePost(id),
    onSuccess: invalidate,
  })

  const createCommentMutation = useMutation({
    mutationFn: ({ postId, content }) => communityAPI.createComment(postId, content),
    onSuccess: (_, { postId }) => { setNewComments(prev => ({ ...prev, [postId]: '' })); invalidate() },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: (id) => communityAPI.deleteComment(id),
    onSuccess: invalidate,
  })

  const posts = postsData?.data || []
  const pagination = postsData?.pagination

  const handleCreatePost = (e) => {
    e.preventDefault()
    if (!newPostContent.trim()) return
    createPostMutation.mutate(newPostContent.trim())
  }

  const handleCreateComment = (e, postId) => {
    e.preventDefault()
    const content = newComments[postId]?.trim()
    if (!content) return
    createCommentMutation.mutate({ postId, content })
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to={`/events/${eventId}`} className="flex items-center text-secondary-600 hover:text-secondary-900 mb-4 text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Event
          </Link>
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">
                {communityData?.name || 'Event Community'}
              </h1>
              <p className="text-sm text-secondary-500">
                {communityData?.postCount || posts.length} posts
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Create Post */}
        {isAuthenticated && (
          <form onSubmit={handleCreatePost} className="card p-4 mb-6">
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 text-primary-600 font-semibold text-sm">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="flex-1">
                <textarea
                  value={newPostContent}
                  onChange={e => setNewPostContent(e.target.value)}
                  placeholder="Share something with the community..."
                  rows={3}
                  className="w-full border border-secondary-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
                <div className="flex justify-end mt-2">
                  <Button size="sm" type="submit" disabled={!newPostContent.trim() || createPostMutation.isLoading}>
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Posts */}
        {isLoading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="large" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 card">
            <MessageCircle className="w-10 h-10 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">No posts yet</h3>
            <p className="text-secondary-500">Be the first to post in this community!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="card p-5">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm flex-shrink-0">
                      {post.author?.profile?.profilePhoto
                        ? <img src={post.author.profile.profilePhoto} className="w-full h-full rounded-full object-cover" alt="" />
                        : `${post.author?.firstName?.[0] || ''}${post.author?.lastName?.[0] || ''}`
                      }
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900 text-sm">
                        {post.author?.firstName} {post.author?.lastName}
                      </p>
                      <p className="text-xs text-secondary-400">
                        {formatTime(post.createdAt)}{post.isEdited ? ' (edited)' : ''}
                      </p>
                    </div>
                  </div>
                  {user?.id === post.authorId && (
                    <button
                      onClick={() => deletePostMutation.mutate(post.id)}
                      className="text-secondary-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Post Content */}
                <p className="text-secondary-800 text-sm whitespace-pre-wrap">{post.content}</p>

                {/* Comments */}
                {post.comments?.length > 0 && (
                  <div className="mt-4 space-y-3 pl-4 border-l-2 border-secondary-100">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="flex items-start gap-2">
                        <div className="w-7 h-7 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600 text-xs font-semibold flex-shrink-0">
                          {comment.author?.firstName?.[0]}{comment.author?.lastName?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="bg-secondary-50 rounded-lg px-3 py-2">
                            <p className="font-medium text-xs text-secondary-700">
                              {comment.author?.firstName} {comment.author?.lastName}
                            </p>
                            <p className="text-sm text-secondary-800">{comment.content}</p>
                          </div>
                          <p className="text-xs text-secondary-400 mt-1 px-3">{formatTime(comment.createdAt)}</p>
                        </div>
                        {user?.id === comment.authorId && (
                          <button
                            onClick={() => deleteCommentMutation.mutate(comment.id)}
                            className="text-secondary-300 hover:text-red-400 transition-colors mt-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                {isAuthenticated && (
                  <form onSubmit={(e) => handleCreateComment(e, post.id)} className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      className="flex-1 border border-secondary-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={newComments[post.id] || ''}
                      onChange={e => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                    />
                    <button
                      type="submit"
                      disabled={!newComments[post.id]?.trim()}
                      className="p-2 text-primary-600 hover:text-primary-700 disabled:opacity-40"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            ))}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center gap-3 pt-4">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  Previous
                </Button>
                <span className="text-sm text-secondary-600 self-center">
                  Page {page} of {pagination.totalPages}
                </span>
                <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default EventCommunity
