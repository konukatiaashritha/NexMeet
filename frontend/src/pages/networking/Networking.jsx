import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Users, UserPlus, Clock, CheckCircle, Search,
  ArrowRight, UserX, MapPin, Award
} from 'lucide-react'
import { networkingAPI } from '../../services/networkingService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'

const TABS = [
  { id: 'connections', label: 'My Connections', icon: Users },
  { id: 'received', label: 'Received', icon: UserPlus },
  { id: 'sent', label: 'Sent', icon: Clock },
]

function Networking() {
  const [activeTab, setActiveTab] = useState('connections')
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data: connections = [], isLoading: loadingConnections } = useQuery({
    queryKey: ['connections'],
    queryFn: networkingAPI.getConnections,
  })

  const { data: requestsData, isLoading: loadingRequests } = useQuery({
    queryKey: ['connection-requests'],
    queryFn: networkingAPI.getConnectionRequests,
  })

  const invalidate = () => {
    queryClient.invalidateQueries(['connections'])
    queryClient.invalidateQueries(['connection-requests'])
  }

  const acceptMutation = useMutation({
    mutationFn: (id) => networkingAPI.acceptConnection(id),
    onSuccess: invalidate,
  })

  const rejectMutation = useMutation({
    mutationFn: (id) => networkingAPI.rejectConnection(id),
    onSuccess: invalidate,
  })

  const removeMutation = useMutation({
    mutationFn: (id) => networkingAPI.removeConnection(id),
    onSuccess: invalidate,
  })

  const receivedRequests = requestsData?.received || []
  const sentRequests = requestsData?.sent || []
  const pendingCount = receivedRequests.length

  const filterBySearch = (list, nameKey = 'user') => {
    if (!search.trim()) return list
    const q = search.toLowerCase()
    return list.filter((item) => {
      const person = item[nameKey] || item
      const fullName = `${person.firstName || ''} ${person.lastName || ''}`.toLowerCase()
      return (
        fullName.includes(q) ||
        person.college?.toLowerCase().includes(q) ||
        person.company?.toLowerCase().includes(q) ||
        (person.skills || []).some((s) => s.toLowerCase().includes(q))
      )
    })
  }

  const isLoading = loadingConnections || loadingRequests

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">My Network</h1>
              <p className="text-secondary-600 mt-1">Manage your connections and requests</p>
            </div>
            <Link to="/people">
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Discover People
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 bg-secondary-50 rounded-lg">
              <div className="text-2xl font-bold text-secondary-900">{connections.length}</div>
              <div className="text-sm text-secondary-500">Connections</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
              <div className="text-sm text-secondary-500">Pending</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{sentRequests.length}</div>
              <div className="text-sm text-secondary-500">Sent</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 bg-secondary-100 p-1 rounded-xl w-fit">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === id ? 'bg-white text-secondary-900 shadow-sm' : 'text-secondary-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {id === 'received' && pendingCount > 0 && (
                  <span className="w-5 h-5 text-xs bg-primary-600 text-white rounded-full flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Search by name, skills, or company..."
            className="w-full pl-10 pr-4 py-2.5 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="large" /></div>
        ) : (
          <>
            {/* My Connections */}
            {activeTab === 'connections' && (
              <>
                {filterBySearch(connections).length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                      {search ? 'No matching connections' : 'No connections yet'}
                    </h3>
                    <p className="text-secondary-500 mb-6">
                      {search ? 'Try a different search term' : 'Start connecting with people at events!'}
                    </p>
                    {!search && <Link to="/people"><Button>Find People</Button></Link>}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filterBySearch(connections).map((conn) => (
                      <ConnectionCard
                        key={conn.connectionId}
                        person={conn.user}
                        connectionId={conn.connectionId}
                        status="connected"
                        onRemove={() => removeMutation.mutate(conn.connectionId)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Received Requests */}
            {activeTab === 'received' && (
              <>
                {receivedRequests.length === 0 ? (
                  <div className="text-center py-16">
                    <UserPlus className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">No pending requests</h3>
                    <p className="text-secondary-500">Connection requests you receive will appear here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {receivedRequests.map((req) => (
                      <PersonCard
                        key={req.id}
                        person={req.from}
                        message={req.message}
                        showActions
                        onAccept={() => acceptMutation.mutate(req.id)}
                        onReject={() => rejectMutation.mutate(req.id)}
                        isLoading={acceptMutation.isLoading || rejectMutation.isLoading}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Sent Requests */}
            {activeTab === 'sent' && (
              <>
                {sentRequests.length === 0 ? (
                  <div className="text-center py-16">
                    <Clock className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">No sent requests</h3>
                    <p className="text-secondary-500">Requests you've sent will appear here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sentRequests.map((req) => (
                      <PersonCard
                        key={req.id}
                        person={req.to}
                        badge="Pending"
                        badgeColor="bg-yellow-100 text-yellow-700"
                        onCancel={() => removeMutation.mutate(req.id)}
                        isLoading={removeMutation.isLoading}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function PersonCard({ person, message, showActions, badge, badgeColor, onAccept, onReject, onCancel, isLoading }) {
  if (!person) return null
  return (
    <div className="card p-5">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 text-primary-600 font-semibold text-lg">
          {person.profilePhoto
            ? <img src={person.profilePhoto} className="w-full h-full rounded-full object-cover" alt="" />
            : `${person.firstName?.[0] || ''}${person.lastName?.[0] || ''}`
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="font-semibold text-secondary-900 truncate">
              {person.firstName} {person.lastName}
            </h4>
            {badge && (
              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${badgeColor}`}>{badge}</span>
            )}
          </div>
          <p className="text-sm text-secondary-500 truncate">{person.jobTitle || person.company || person.college}</p>
          {person.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {person.skills.slice(0, 3).map(s => (
                <span key={s} className="px-2 py-0.5 bg-secondary-100 text-secondary-600 text-xs rounded-full">{s}</span>
              ))}
            </div>
          )}
          {message && <p className="text-xs text-secondary-500 mt-2 italic">"{message}"</p>}
        </div>
      </div>
      {showActions && (
        <div className="flex gap-2 mt-4">
          <Button size="sm" onClick={onAccept} disabled={isLoading} className="flex-1">
            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Accept
          </Button>
          <Button size="sm" variant="outline" onClick={onReject} disabled={isLoading}>
            <UserX className="w-3.5 h-3.5 mr-1" /> Decline
          </Button>
        </div>
      )}
      {onCancel && (
        <Button size="sm" variant="ghost" onClick={onCancel} disabled={isLoading} className="w-full mt-3">
          Cancel Request
        </Button>
      )}
    </div>
  )
}

// Simplified ConnectionCard that works with backend data format
function ConnectionCard({ person, connectionId, status, onRemove }) {
  if (!person) return null
  return (
    <div className="card p-5">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 text-primary-600 font-semibold text-lg">
          {person.profilePhoto
            ? <img src={person.profilePhoto} className="w-full h-full rounded-full object-cover" alt="" />
            : `${person.firstName?.[0] || ''}${person.lastName?.[0] || ''}`
          }
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-secondary-900 truncate">{person.firstName} {person.lastName}</h4>
          <p className="text-sm text-secondary-500 truncate">{person.jobTitle || person.company || person.college}</p>
          {person.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {person.skills.slice(0, 3).map(s => (
                <span key={s} className="px-2 py-0.5 bg-secondary-100 text-secondary-600 text-xs rounded-full">{s}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <span className="flex items-center text-xs text-green-600 font-medium">
          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Connected
        </span>
        <button
          onClick={onRemove}
          className="ml-auto text-xs text-secondary-400 hover:text-red-500 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default Networking
