import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, CheckCheck } from 'lucide-react'
import { notificationAPI, NOTIFICATION_META } from '../services/notificationService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Button from '../components/common/Button'

const formatTime = (dateStr) => {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now - d
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

function Notifications() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState('all')

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', filter],
    queryFn: () => notificationAPI.getNotifications({ unread: filter === 'unread' ? 'true' : undefined }),
    staleTime: 30 * 1000,
  })

  const markAllMutation = useMutation({
    mutationFn: notificationAPI.markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries(['notifications']),
  })

  const markOneMutation = useMutation({
    mutationFn: (id) => notificationAPI.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries(['notifications']),
  })

  const notifications = data?.data || []
  const unreadCount = data?.meta?.unreadCount ?? notifications.filter(n => !n.isRead).length

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-secondary-500">{unreadCount} unread</p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllMutation.mutate()}
                disabled={markAllMutation.isLoading}
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark all read
              </Button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-secondary-100 p-1 rounded-lg w-fit">
            {['all', 'unread'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                  filter === f ? 'bg-white text-secondary-900 shadow-sm' : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                {f}
                {f === 'unread' && unreadCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs bg-primary-600 text-white rounded-full">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </h3>
            <p className="text-secondary-600">
              {filter === 'unread'
                ? "You're all caught up! Check 'All' to see past notifications."
                : "Notifications about events, connections, and more will appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const meta = NOTIFICATION_META[notification.type] || {
                emoji: '🔔', color: 'text-secondary-600', bg: 'bg-secondary-50', label: 'Notification'
              }
              return (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  meta={meta}
                  onMarkRead={() => markOneMutation.mutate(notification.id)}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function NotificationItem({ notification, meta, onMarkRead }) {
  const content = (
    <div
      className={`p-4 rounded-xl border transition-all cursor-pointer ${
        notification.isRead
          ? 'bg-white border-secondary-200'
          : 'bg-primary-50 border-primary-200'
      }`}
      onClick={() => { if (!notification.isRead) onMarkRead() }}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${meta.bg}`}>
          <span className="text-xl">{meta.emoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className={`text-sm font-semibold ${notification.isRead ? 'text-secondary-700' : 'text-secondary-900'}`}>
                {notification.title}
              </p>
              <p className={`text-sm mt-0.5 ${notification.isRead ? 'text-secondary-500' : 'text-secondary-700'}`}>
                {notification.message}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {!notification.isRead && (
                <div className="w-2 h-2 bg-primary-600 rounded-full" />
              )}
              <span className="text-xs text-secondary-400 whitespace-nowrap">
                {formatTime(notification.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (notification.actionUrl) {
    return <Link to={notification.actionUrl}>{content}</Link>
  }
  return content
}

export default Notifications
