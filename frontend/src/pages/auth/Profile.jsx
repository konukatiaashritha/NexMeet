import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Camera, Save, MapPin, Building, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'

function Profile() {
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      email: user?.email || '',
      organization: user?.college_company || '',
      location: user?.location || '',
      bio: user?.bio || '',
      skills: user?.skills?.join(', ') || '',
      interests: user?.interests?.join(', ') || '',
      careerField: user?.career_field || '',
      experienceLevel: user?.experience_level || '',
    }
  })

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      setMessage('')
      
      const updateData = {
        first_name: data.firstName,
        last_name: data.lastName,
        college_company: data.organization,
        location: data.location,
        bio: data.bio,
        skills: data.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: data.interests.split(',').map(s => s.trim()).filter(Boolean),
        career_field: data.careerField,
        experience_level: data.experienceLevel,
      }
      
      updateUser(updateData)
      setMessage('Profile updated successfully!')
    } catch (error) {
      setMessage('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200">
          {/* Header */}
          <div className="px-6 py-8 border-b border-secondary-200">
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">Profile Settings</h1>
            <p className="text-secondary-600">Manage your personal information and preferences</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Success Message */}
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
                {message}
              </div>
            )}

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
                <p className="text-secondary-600 text-sm">Upload a professional photo to help others recognize you</p>
              </div>
            </div>

            {/* Basic Information */}
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

              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input bg-secondary-50"
                  disabled
                  {...register('email')}
                />
                <p className="mt-1 text-sm text-secondary-500">Email cannot be changed</p>
              </div>

              <div>
                <label className="label">Organization</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type="text"
                    className="input pl-10"
                    placeholder="College, company, or organization"
                    {...register('organization')}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="label">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
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
              <label className="label">Bio</label>
              <textarea
                rows={4}
                className="input resize-none"
                placeholder="Tell others about yourself, your interests, and what you're looking for..."
                {...register('bio')}
              />
            </div>

            {/* Professional Information */}
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
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="label">Experience Level</label>
                <select className="input" {...register('experienceLevel')}>
                  <option value="">Select your level</option>
                  <option value="student">Student</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior Level (6-10 years)</option>
                  <option value="executive">Executive (10+ years)</option>
                </select>
              </div>
            </div>

            {/* Skills and Interests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Skills</label>
                <textarea
                  rows={3}
                  className="input resize-none"
                  placeholder="Enter your skills separated by commas (e.g., React, Python, Project Management)"
                  {...register('skills')}
                />
              </div>

              <div>
                <label className="label">Interests</label>
                <textarea
                  rows={3}
                  className="input resize-none"
                  placeholder="Enter your interests separated by commas (e.g., AI/ML, Startups, Design Thinking)"
                  {...register('interests')}
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-secondary-200">
              <Button
                type="submit"
                loading={isLoading}
                className="flex items-center"
              >
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