import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, UserPlus, Search, Sparkles, CheckCircle } from 'lucide-react'
import { networkingAPI } from '../../services/networkingService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'

function People() {
  const [sending, setSending] = useState({})
  const [connected, setConnected] = useState({})
  const queryClient = useQueryClient()

  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ['people-recommendations'],
    queryFn: () => networkingAPI.getPeopleRecommendations(20),
    staleTime: 2 * 60 * 1000,
  })

  const connectMutation = useMutation({
    mutationFn: ({ userId, message }) => networkingAPI.sendConnectionRequest(userId, message),
    onMutate: ({ userId }) => setSending(prev => ({ ...prev, [userId]: true })),
    onSuccess: (_, { userId }) => {
      setConnected(prev => ({ ...prev, [userId]: true }))
      queryClient.invalidateQueries(['connections'])
      queryClient.invalidateQueries(['connection-requests'])
    },
    onSettled: (_, __, { userId }) => setSending(prev => ({ ...prev, [userId]: false })),
  })

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-primary-600" />
            <h1 className="text-3xl font-bold text-secondary-900">People You May Know</h1>
          </div>
          <p className="text-secondary-600">
            Personalized recommendations based on your skills, interests, and events
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="large" /></div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">No recommendations yet</h3>
            <p className="text-secondary-500 max-w-md mx-auto">
              Complete your profile with skills, interests, and register for events to get personalized people recommendations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map(({ user, reason, allReasons }) => {
              const isConnected = connected[user.id]
              const isSending = sending[user.id]
              return (
                <div key={user.id} className="card p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 text-primary-600 font-bold text-xl">
                      {user.profilePhoto
                        ? <img src={user.profilePhoto} className="w-full h-full rounded-full object-cover" alt="" />
                        : `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-secondary-900 text-lg">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-secondary-500 truncate">
                        {user.jobTitle || user.company || user.college}
                      </p>
                    </div>
                  </div>

                  {/* Skills */}
                  {user.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {user.skills.slice(0, 4).map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-secondary-100 text-secondary-700 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Reason */}
                  <div className="mt-3 p-3 bg-primary-50 rounded-lg">
                    <p className="text-sm text-primary-700 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      {reason}
                    </p>
                  </div>

                  {/* Connect Button */}
                  <div className="mt-4">
                    {isConnected ? (
                      <div className="flex items-center text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Request Sent
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => connectMutation.mutate({ userId: user.id })}
                        disabled={isSending}
                        className="w-full"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        {isSending ? 'Connecting...' : 'Connect'}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default People
