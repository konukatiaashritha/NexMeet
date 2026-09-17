import React from 'react'
import { Link } from 'react-router-dom'
import { Users, Building, GraduationCap, Code, Briefcase, Heart } from 'lucide-react'
import Button from '../../components/common/Button'

function Communities() {
  const communityTypes = [
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Tech Communities',
      description: 'Developer meetups, coding bootcamps, and tech conferences',
      count: '150+ communities',
      color: 'bg-blue-500'
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: 'Companies',
      description: 'Corporate events, workshops, and networking opportunities',
      count: '80+ companies',
      color: 'bg-purple-500'
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Educational Institutions',
      description: 'Universities, colleges, and research organizations',
      count: '200+ institutions',
      color: 'bg-green-500'
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Professional Groups',
      description: 'Industry associations and professional networks',
      count: '120+ groups',
      color: 'bg-orange-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Startup Communities',
      description: 'Entrepreneur meetups and startup ecosystems',
      count: '90+ communities',
      color: 'bg-red-500'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Interest Groups',
      description: 'Hobby clubs and special interest communities',
      count: '300+ groups',
      color: 'bg-pink-500'
    }
  ]

  const featuredCommunities = [
    {
      name: 'React Developers Network',
      type: 'Tech Community',
      members: '15.2k',
      upcomingEvents: 5,
      description: 'The largest React.js developer community with regular meetups and workshops.',
      logo: '⚛️'
    },
    {
      name: 'Stanford University',
      type: 'Educational Institution',
      members: '8.5k',
      upcomingEvents: 12,
      description: 'Lectures, seminars, and research presentations from Stanford University.',
      logo: '🎓'
    },
    {
      name: 'Silicon Valley Entrepreneurs',
      type: 'Startup Community',
      members: '22.1k',
      upcomingEvents: 8,
      description: 'Connect with fellow entrepreneurs and startup founders in Silicon Valley.',
      logo: '🚀'
    },
    {
      name: 'Women in Tech',
      type: 'Professional Group',
      members: '18.7k',
      upcomingEvents: 6,
      description: 'Empowering women in technology through networking and mentorship.',
      logo: '👩‍💻'
    }
  ]

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-secondary-900 mb-4">
              Discover Communities
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-8">
              Connect with organizations, institutions, and communities that host amazing events. 
              Follow your favorites to stay updated on their latest activities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Browse All Communities
              </Button>
              <Button variant="outline" size="lg">
                Create Community Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Community Types */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-secondary-900 mb-8 text-center">
            Explore by Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityTypes.map((type, index) => (
              <div
                key={index}
                className="card p-6 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className={`${type.color} text-white rounded-lg p-3 w-fit mb-4`}>
                  {type.icon}
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  {type.title}
                </h3>
                <p className="text-secondary-600 mb-3">
                  {type.description}
                </p>
                <p className="text-sm font-medium text-primary-600">
                  {type.count}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Communities */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-secondary-900">
              Featured Communities
            </h2>
            <Button variant="outline">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredCommunities.map((community, index) => (
              <div key={index} className="card p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">{community.logo}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-900">
                        {community.name}
                      </h3>
                      <p className="text-sm text-secondary-500">{community.type}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Follow
                  </Button>
                </div>

                <p className="text-secondary-600 mb-4">
                  {community.description}
                </p>

                <div className="flex items-center justify-between text-sm text-secondary-600">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {community.members} members
                  </span>
                  <span>
                    {community.upcomingEvents} upcoming events
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Coming Soon Banner */}
        <div className="mt-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Communities Feature Coming Soon</h3>
          <p className="text-primary-100 mb-4">
            We're working on advanced community features including detailed profiles, 
            member directories, and community-specific event recommendations.
          </p>
          <Button variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50">
            Get Notified
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Communities