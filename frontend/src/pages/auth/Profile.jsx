import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Camera, Save, MapPin, Building, User, Shield, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../services/authService'
import Button from '../../components/common/Button'
import NetworkingIntentSelector from '../../components/networking/NetworkingIntentSelector'
import LookingForSelector from '../../components/networking/LookingForSelector'
import { PRIVACY_OPTIONS, ATTENDANCE_VISIBILITY, CONNECTION_PREFERENCES } from '../../constants'

function Profile() {
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [activeSection, setActiveSection] = useState('basic')

  // Networking Intent state (WHY am I networking?)
  const [networkingGoals, setNetworkingGoals] = useState(
    user?.profile?.networkingIntents?.map(n => n.value || n) || user?.networking_goals || []
  )

  // Looking For state (WHAT am I looking for?)
  const [lookingFor, setLookingFor] = useState(
    user?.profile?.lookingFor?.map(l => l.value || l) || user?.looking_for || []
  )

  // Privacy settings state
  const [privacy, setPrivacy] = useState({
    profile_visibility: user?.profile?.privacy?.profileVisibility || user?.privacy?.profile_visibility || PRIVACY_OPTIONS.PUBLIC,
    skills_visible: user?.profile?.privacy?.skillsVisible ?? user?.privacy?.skills_visible ?? true,
    interests_visible: user?.profile?.privacy?.interestsVisible ?? user?.privacy?.interests_visible ?? true,
    college_company_visible: user?.profile?.privacy?.collegeCompanyVisible ?? user?.privacy?.college_company_visible ?? true,
    networking_intent_visible: user?.profile?.privacy?.networkingIntentVisible ?? user?.privacy?.networking_intent_visible ?? true,
    looking_for_visible: user?.profile?.privacy?.lookingForVisible ?? user?.privacy?.looking_for_visible ?? true,
    attendance_visibility: user?.profile?.privacy?.attendanceVisibility || user?.privacy?.attendance_visibility || ATTENDANCE_VISIBILITY.VISIBLE,
    connection_preference: user?.profile?.privacy?.connectionPreference || user?.privacy?.connection_preference || CONNECTION_PREFERENCES.ANYONE,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || user?.first_name || '',
      lastName: user?.lastName || user?.last_name || '',
      email: user?.email || '',
      organization: user?.profile?.college || user?.profile?.company || user?.college_company || '',
      location: user?.profile?.location || user?.location || '',
      bio: user?.profile?.about || user?.bio || '',
      skills: (user?.profile?.skills || user?.skills || []).join(', '),
      interests: (user?.profile?.interests || user?.interests || []).join(', '),
      careerField: user?.profile?.field || user?.career_field || '',
      experienceLevel: user?.profile?.experienceLevel || user?.experience_level || '',
    },
  })

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 4000)
  }

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        college: data.organization,
        company: data.organization,
        location: data.location,
        city: data.city || data.location,
        about: data.bio,
        skills: data.skills ? data.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        interests: data.interests ? data.interests.split(',').map((s) => s.trim()).filter(Boolean) : [],
        field: data.careerField,
        experienceLevel: data.experienceLevel || undefined,
        networkingIntents: networkingGoals,
        lookingFor: lookingFor,
      }
      const updated = await authAPI.updateProfile(updateData)
      updateUser(updated)

      // Also save privacy settings
      const privacyData = {
        profileVisibility: privacy.profile_visibility || privacy.profileVisibility,
        skillsVisible: privacy.skills_visible ?? privacy.skillsVisible ?? true,
        interestsVisible: privacy.interests_visible ?? privacy.interestsVisible ?? true,
        collegeCompanyVisible: privacy.college_company_visible ?? privacy.collegeCompanyVisible ?? true,
        networkingIntentVisible: privacy.networking_intent_visible ?? privacy.networkingIntentVisible ?? true,
        lookingForVisible: privacy.looking_for_visible ?? privacy.lookingForVisible ?? true,
        attendanceVisibility: privacy.attendance_visibility || privacy.attendanceVisibility,
        connectionPreference: privacy.connection_preference || privacy.connectionPreference,
      }
      await authAPI.updatePrivacy(privacyData)

      showMessage('Profile updated successfully!', 'success')
    } catch (error) {
      showMessage(error.response?.data?.error?.message || 'Failed to update profile. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const updatePrivacy = (key, value) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }))
  }

  const sections = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'professional', label: 'Professional' },
    { id: 'networking', label: 'Networking' },
    { id: 'privacy', label: 'Privacy' },
  ]

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200">
          {/* Header */}
          <div className="px-6 py-8 border-b border-secondary-200">
            <h1 className="text-2xl font-bold text-secondary-900 mb-1">Profile Settings</h1>
            <p className="text-secondary-600">
              Manage your personal information, networking preferences, and privacy
            </p>
          </div>

          {/* Section Tabs */}
          <div className="flex border-b border-secondary-200 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px ${
                  activeSection === section.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-secondary-600 hover:text-secondary-900'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            {/* Success / Error Message */}
            {message.text && (
              <div
                className={`mb-6 rounded-lg p-4 text-sm font-medium ${
                  message.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* ── BASIC INFO ─────────────────────────────────────────────── */}
            {activeSection === 'basic' && (
              <div className="space-y-6">
                {/* Profile Photo */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                      {user?.profile_picture ? (
                        <img
                          src={user.profile_picture}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-primary-600" />
                      )}
                    </div>
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-secondary-900">Profile Photo</h3>
                    <p className="text-secondary-500 text-sm">
                      Upload a photo to help others recognise you at events
                    </p>
                  </div>
                </div>

                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">First Name</label>
                    <input
                      type="text"
                      className={`input ${errors.firstName ? 'border-red-500' : ''}`}
                      {...register('firstName', { required: 'First name is required' })}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="label">Last Name</label>
                    <input
                      type="text"
                      className={`input ${errors.lastName ? 'border-red-500' : ''}`}
                      {...register('lastName', { required: 'Last name is required' })}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label className="label">Email</label>
                    <input
                      type="email"
                      className="input bg-secondary-50 text-secondary-500"
                      disabled
                      {...register('email')}
                    />
                    <p className="mt-1 text-xs text-secondary-400">Email cannot be changed</p>
                  </div>

                  {/* Organization */}
                  <div>
                    <label className="label">College / Company</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                      <input
                        type="text"
                        className="input pl-10"
                        placeholder="e.g. IIT Bombay, Google"
                        {...register('organization')}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="md:col-span-2">
                    <label className="label">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                      <input
                        type="text"
                        className="input pl-10"
                        placeholder="City, state or region"
                        {...register('location')}
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="label">About</label>
                  <textarea
                    rows={4}
                    className="input resize-none"
                    placeholder="Tell others about yourself, your background, and what you're working on..."
                    {...register('bio')}
                  />
                </div>
              </div>
            )}

            {/* ── PROFESSIONAL ───────────────────────────────────────────── */}
            {activeSection === 'professional' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Career Field</label>
                    <select className="input" {...register('careerField')}>
                      <option value="">Select your field</option>
                      <option value="technology">Technology</option>
                      <option value="business">Business</option>
                      <option value="design">Design</option>
                      <option value="marketing">Marketing</option>
                      <option value="finance">Finance</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="research">Research</option>
                      <option value="consulting">Consulting</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Experience Level</label>
                    <select className="input" {...register('experienceLevel')}>
                      <option value="">Select your level</option>
                      <option value="student">Student</option>
                      <option value="entry">Entry Level (0–2 years)</option>
                      <option value="mid">Mid Level (3–5 years)</option>
                      <option value="senior">Senior Level (6–10 years)</option>
                      <option value="executive">Executive (10+ years)</option>
                    </select>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="label">Skills</label>
                  <textarea
                    rows={3}
                    className="input resize-none"
                    placeholder="Enter skills separated by commas — e.g. React, Python, Project Management"
                    {...register('skills')}
                  />
                  <p className="mt-1 text-xs text-secondary-400">
                    These are used to match you with relevant events and people
                  </p>
                </div>

                {/* Interests */}
                <div>
                  <label className="label">Interests</label>
                  <textarea
                    rows={3}
                    className="input resize-none"
                    placeholder="Enter interests separated by commas — e.g. AI/ML, Startups, Design Thinking"
                    {...register('interests')}
                  />
                </div>
              </div>
            )}

            {/* ── NETWORKING ─────────────────────────────────────────────── */}
            {activeSection === 'networking' && (
              <div className="space-y-8">
                {/* Networking Intent */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-secondary-900">
                      Networking Intent
                    </h3>
                    <p className="text-sm text-secondary-500 mt-1">
                      <span className="font-medium text-secondary-700">WHY</span> are you networking?
                      This helps NexMeet suggest the right events and people for you.
                    </p>
                  </div>
                  <NetworkingIntentSelector
                    selected={networkingGoals}
                    onChange={setNetworkingGoals}
                    label=""
                    description=""
                  />
                </div>

                <hr className="border-secondary-200" />

                {/* Looking For */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-secondary-900">
                      Looking For
                    </h3>
                    <p className="text-sm text-secondary-500 mt-1">
                      <span className="font-medium text-secondary-700">WHAT</span> kind of connection
                      or opportunity are you looking for? This is shown on your profile.
                    </p>
                  </div>
                  <LookingForSelector
                    selected={lookingFor}
                    onChange={setLookingFor}
                    label=""
                    description=""
                  />
                </div>

                {/* Current selections summary */}
                {(networkingGoals.length > 0 || lookingFor.length > 0) && (
                  <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                    <p className="text-sm font-medium text-primary-800 mb-2">Your networking profile:</p>
                    {networkingGoals.length > 0 && (
                      <p className="text-sm text-primary-700">
                        <span className="font-medium">Intent:</span>{' '}
                        {networkingGoals.length} goal{networkingGoals.length !== 1 ? 's' : ''} selected
                      </p>
                    )}
                    {lookingFor.length > 0 && (
                      <p className="text-sm text-primary-700 mt-1">
                        <span className="font-medium">Looking for:</span>{' '}
                        {lookingFor.length} type{lookingFor.length !== 1 ? 's' : ''} of connections
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── PRIVACY ────────────────────────────────────────────────── */}
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <div className="flex items-start gap-3 p-4 bg-secondary-50 rounded-xl">
                  <Shield className="w-5 h-5 text-secondary-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-secondary-600">
                    Control who can see your information. Your email address is never shown publicly.
                  </p>
                </div>

                {/* Profile Visibility */}
                <div>
                  <label className="label">Profile Visibility</label>
                  <select
                    className="input"
                    value={privacy.profile_visibility}
                    onChange={(e) => updatePrivacy('profile_visibility', e.target.value)}
                  >
                    <option value={PRIVACY_OPTIONS.PUBLIC}>
                      Public — Anyone on NexMeet can view your profile
                    </option>
                    <option value={PRIVACY_OPTIONS.CONNECTIONS}>
                      Connections only — Only people you're connected with
                    </option>
                    <option value={PRIVACY_OPTIONS.PRIVATE}>
                      Private — Only you can see your profile
                    </option>
                  </select>
                </div>

                {/* Attendance Visibility */}
                <div>
                  <label className="label">Event Attendance Visibility</label>
                  <select
                    className="input"
                    value={privacy.attendance_visibility}
                    onChange={(e) => updatePrivacy('attendance_visibility', e.target.value)}
                  >
                    <option value={ATTENDANCE_VISIBILITY.VISIBLE}>
                      Visible — Show me in the attendee list for events I attend
                    </option>
                    <option value={ATTENDANCE_VISIBILITY.CONNECTIONS_ONLY}>
                      Connections only — Only show my attendance to connections
                    </option>
                    <option value={ATTENDANCE_VISIBILITY.HIDDEN}>
                      Hidden — Don't show me in any attendee lists
                    </option>
                  </select>
                  <p className="mt-1 text-xs text-secondary-400">
                    Controls whether others can see you in "Who's Going?" on event pages
                  </p>
                </div>

                {/* Connection Preference */}
                <div>
                  <label className="label">Who Can Send You Connection Requests?</label>
                  <select
                    className="input"
                    value={privacy.connection_preference}
                    onChange={(e) => updatePrivacy('connection_preference', e.target.value)}
                  >
                    <option value={CONNECTION_PREFERENCES.ANYONE}>
                      Anyone on NexMeet
                    </option>
                    <option value={CONNECTION_PREFERENCES.SAME_INTERESTS}>
                      People with similar interests
                    </option>
                    <option value={CONNECTION_PREFERENCES.SAME_EVENTS}>
                      People attending the same events
                    </option>
                    <option value={CONNECTION_PREFERENCES.CONNECTIONS_OF_CONNECTIONS}>
                      Connections of my connections
                    </option>
                  </select>
                </div>

                {/* Field-level visibility toggles */}
                <div>
                  <label className="label">Field Visibility</label>
                  <p className="text-sm text-secondary-500 mb-3">
                    Choose which fields others can see on your profile
                  </p>
                  <div className="space-y-3">
                    {[
                      { key: 'skills_visible', label: 'Skills' },
                      { key: 'interests_visible', label: 'Interests' },
                      { key: 'college_company_visible', label: 'College / Company' },
                      { key: 'networking_intent_visible', label: 'Networking Intent' },
                      { key: 'looking_for_visible', label: 'Looking For' },
                    ].map(({ key, label }) => (
                      <div
                        key={key}
                        className="flex items-center justify-between py-3 border-b border-secondary-100 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          {privacy[key] ? (
                            <Eye className="w-4 h-4 text-primary-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-secondary-400" />
                          )}
                          <span className="text-sm font-medium text-secondary-900">{label}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => updatePrivacy(key, !privacy[key])}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                            privacy[key] ? 'bg-primary-600' : 'bg-secondary-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              privacy[key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 mt-6 border-t border-secondary-200">
              <Button type="submit" loading={isLoading} className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
