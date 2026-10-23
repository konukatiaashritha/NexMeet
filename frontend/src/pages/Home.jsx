import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Calendar, Users, MapPin, ArrowRight, Star, Sparkles, TrendingUp, BookmarkIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import PeopleRecommendations from '../components/networking/PeopleRecommendations'

function Home() {
  const { isAuthenticated, user } = useAuth()

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Discover Events',
      description: 'Find workshops, conferences, meetups, and networking events tailored to your interests.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Connect & Network',
      description: 'Meet like-minded professionals, students, and industry experts at every event.',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Personalized Recommendations',
      description: 'Get event and people suggestions based on your skills, interests, and career goals.',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Location Flexibility',
      description: 'Choose from online, offline, or hybrid events. Set your preferred distance and location.',
    },
  ]

  const eventTypes = [
    { label: 'Workshops', emoji: '🛠️' },
    { label: 'Conferences', emoji: '🎤' },
    { label: 'Seminars', emoji: '📖' },
    { label: 'Meetups', emoji: '🤝' },
    { label: 'Hackathons', emoji: '💻' },
    { label: 'Guest Lectures', emoji: '🎓' },
    { label: 'Career Events', emoji: '💼' },
    { label: 'Startup Events', emoji: '🚀' },
  ]

  // ── Authenticated user dashboard-style Home ───────────────────────────────
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary-50">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              Welcome back, {user?.first_name}! 👋
            </h1>
            <p className="text-primary-100 text-sm mb-6">
              Discover events and people that match your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/events">
                <Button
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 w-full sm:w-auto"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Explore Events
                </Button>
              </Link>
              <Link to="/people">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary-600 w-full sm:w-auto"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Find People
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main column */}
            <div className="lg:col-span-2 space-y-8">

              {/* Recommended Events */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-semibold text-secondary-900">
                      Recommended for You
                    </h2>
                  </div>
                  <Link
                    to="/events"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                  >
                    View all <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {RECOMMENDED_EVENTS.map((event) => (
                    <RecommendedEventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>

              {/* Event Categories */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-secondary-900">
                    Browse by Category
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {eventTypes.map(({ label, emoji }) => (
                    <Link
                      key={label}
                      to={`/events?category=${label.toLowerCase()}`}
                      className="bg-white border border-secondary-200 rounded-xl p-4 text-center hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
                    >
                      <div className="text-2xl mb-1">{emoji}</div>
                      <span className="text-sm font-medium text-secondary-700">{label}</span>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* People You May Want to Connect With */}
              <div className="bg-white rounded-xl border border-secondary-200 shadow-sm p-5">
                <PeopleRecommendations
                  limit={3}
                  compact={false}
                  showViewAll
                />
              </div>

              {/* Quick links */}
              <div className="bg-white rounded-xl border border-secondary-200 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-secondary-900 mb-3">Quick Links</h3>
                <div className="space-y-2">
                  {[
                    { to: '/dashboard', icon: <Calendar className="w-4 h-4" />, label: 'My Dashboard' },
                    { to: '/registered-events', icon: <Calendar className="w-4 h-4" />, label: 'My Events' },
                    { to: '/saved-events', icon: <BookmarkIcon className="w-4 h-4" />, label: 'Saved Events' },
                    { to: '/networking', icon: <Users className="w-4 h-4" />, label: 'My Network' },
                    { to: '/profile', icon: <Users className="w-4 h-4" />, label: 'Edit Profile' },
                  ].map(({ to, icon, label }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center gap-3 py-2 px-1 text-sm text-secondary-700 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
                    >
                      <span className="text-secondary-400">{icon}</span>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Public / logged-out Home ──────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6">
              Discover. Connect. <span className="text-primary-600">Grow.</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              Join the leading platform for event discovery and professional networking.
              Find events that match your interests, connect with industry experts, and
              accelerate your career growth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/events">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Events
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Join NexMeet
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">10K+</div>
                <div className="text-sm text-secondary-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">500+</div>
                <div className="text-sm text-secondary-600">Events Monthly</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">50+</div>
                <div className="text-sm text-secondary-600">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">Why Choose NexMeet?</h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              We're more than just an event listing platform. We help you discover, connect, and
              grow professionally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">{feature.title}</h3>
                <p className="text-secondary-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Explore Every Type of Event
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              From technical workshops to networking meetups — find events that align with your
              interests and goals.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {eventTypes.map(({ label, emoji }) => (
              <Link
                key={label}
                to={`/events?category=${label.toLowerCase()}`}
                className="bg-white p-4 rounded-xl text-center hover:shadow-md hover:border-primary-300 border border-secondary-200 transition-all cursor-pointer"
              >
                <div className="text-2xl mb-1">{emoji}</div>
                <span className="text-secondary-700 font-medium text-sm">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Trusted by Professionals Everywhere
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Software Engineer',
                company: 'Tech Corp',
                quote:
                  'NexMeet helped me discover amazing tech meetups in my city. I made valuable connections that advanced my career.',
              },
              {
                name: 'Michael Chen',
                role: 'Product Manager',
                company: 'StartupXYZ',
                quote:
                  'The personalized recommendations are spot-on. I attended conferences that directly impacted my professional growth.',
              },
              {
                name: 'Emily Davis',
                role: 'Design Student',
                company: 'University',
                quote:
                  'As a student, NexMeet opened doors to industry events I never knew existed. The networking opportunities are incredible.',
              },
            ].map((t, index) => (
              <div key={index} className="card p-6">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-secondary-600 mb-4 italic">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-secondary-900">{t.name}</div>
                  <div className="text-sm text-secondary-500">
                    {t.role}, {t.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already discovering amazing events and
            growing their networks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto bg-white text-primary-600 hover:bg-primary-50"
              >
                Get Started Free
              </Button>
            </Link>
            <Link to="/events">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-600"
              >
                Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// ── Static recommended events for the logged-in home screen ──────────────────
const RECOMMENDED_EVENTS = [
  {
    id: 1,
    title: 'AI/ML Workshop for Beginners',
    category: 'workshop',
    organizer_name: 'Google',
    start_date: '2026-12-15',
    location: 'Mountain View, CA',
    price: 0,
    reason: 'Matches your AI/ML interests',
  },
  {
    id: 3,
    title: 'Startup Pitch Competition',
    category: 'startup',
    organizer_name: 'Startup Incubator',
    start_date: '2026-12-25',
    location: 'Innovation Center',
    price: 25,
    reason: 'Popular in your network',
  },
  {
    id: 2,
    title: 'React Developer Meetup',
    category: 'meetup',
    organizer_name: 'React Community',
    start_date: '2026-12-20',
    location: 'Tech Hub Downtown',
    price: 0,
    reason: 'Matches your React skills',
  },
  {
    id: 4,
    title: 'Data Science Bootcamp',
    category: 'workshop',
    organizer_name: 'Stanford University',
    start_date: '2027-01-05',
    location: 'Online',
    price: 150,
    reason: 'Matches your career goals',
  },
]

function RecommendedEventCard({ event }) {
  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <Link to={`/events/${event.id}`} className="block">
      <div className="bg-white border border-secondary-200 rounded-xl p-4 hover:shadow-md hover:border-primary-200 transition-all">
        <div className="flex items-start justify-between mb-2">
          <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
            {event.category}
          </span>
          <span className="text-sm font-semibold text-secondary-900">
            {event.price === 0 ? 'Free' : `$${event.price}`}
          </span>
        </div>
        <h3 className="font-semibold text-secondary-900 text-sm mb-1 line-clamp-2">
          {event.title}
        </h3>
        <p className="text-xs text-secondary-500 mb-2">by {event.organizer_name}</p>
        <div className="flex items-center gap-1 text-xs text-secondary-400 mb-3">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(event.start_date)}
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-primary-50 rounded-full">
          <Sparkles className="w-3 h-3 text-primary-500" />
          <span className="text-xs text-primary-700 font-medium">{event.reason}</span>
        </div>
      </div>
    </Link>
  )
}

export default Home
