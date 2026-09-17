import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Calendar, Users, MapPin, ArrowRight, Star } from 'lucide-react'
import Button from '../components/common/Button'

function Home() {
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Discover Events',
      description: 'Find workshops, conferences, meetups, and networking events tailored to your interests.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Connect & Network',
      description: 'Meet like-minded professionals, students, and industry experts at every event.'
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Personalized Recommendations',
      description: 'Get event suggestions based on your skills, interests, and career goals.'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Location Flexibility',
      description: 'Choose from online, offline, or hybrid events. Set your preferred distance and location.'
    }
  ]

  const eventTypes = [
    'Workshops', 'Conferences', 'Seminars', 'Meetups', 
    'Hackathons', 'Guest Lectures', 'Career Events', 'Startup Events'
  ]

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
              Find events that match your interests, connect with industry experts, and accelerate your career growth.
            </p>
            
            {/* CTA Buttons */}
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
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Why Choose NexMeet?
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              We're more than just an event listing platform. We help you discover, connect, and grow professionally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Types Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Explore Every Type of Event
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              From technical workshops to networking meetups, find events that align with your interests and goals.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {eventTypes.map((type, index) => (
              <div 
                key={index}
                className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer"
              >
                <span className="text-secondary-700 font-medium">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
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
                name: "Sarah Johnson",
                role: "Software Engineer",
                company: "Tech Corp",
                quote: "NexMeet helped me discover amazing tech meetups in my city. I've made valuable connections that advanced my career."
              },
              {
                name: "Michael Chen",
                role: "Product Manager",
                company: "StartupXYZ",
                quote: "The personalized recommendations are spot-on. I've attended conferences that directly impacted my professional growth."
              },
              {
                name: "Emily Davis",
                role: "Design Student",
                company: "University",
                quote: "As a student, NexMeet opened doors to industry events I never knew existed. The networking opportunities are incredible."
              }
            ].map((testimonial, index) => (
              <div key={index} className="card p-6">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-secondary-600 mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="font-semibold text-secondary-900">{testimonial.name}</div>
                  <div className="text-sm text-secondary-500">{testimonial.role}, {testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already discovering amazing events and growing their networks.
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

export default Home