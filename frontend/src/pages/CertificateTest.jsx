import React from 'react'
import { Link } from 'react-router-dom'
import CertificateInfo from '../components/events/CertificateInfo'
import CertificateBadge from '../components/events/CertificateBadge'

function CertificateTest() {
  // Sample certificate data
  const sampleCertificates = [
    {
      available: true,
      issued_by: 'Google',
      type: 'completion',
      skills_covered: ['Machine Learning', 'Python', 'Data Analysis'],
      eligibility_requirements: 'Attend the full workshop and complete the assessment',
      cost: 'free',
      delivery_method: 'after_assessment',
      certificate_link: 'https://developers.google.com/certification',
      additional_info: 'Certificate will be sent via email within 5 business days'
    },
    {
      available: true,
      issued_by: 'Stanford University',
      type: 'achievement',
      skills_covered: ['Data Science', 'Statistics', 'R Programming'],
      eligibility_requirements: 'Complete all assignments and pass final evaluation with 80% score',
      cost: 'paid',
      amount: 50,
      delivery_method: 'after_requirements',
      certificate_link: 'https://online.stanford.edu/certificates',
      additional_info: 'Official Stanford continuing education certificate'
    },
    {
      available: true,
      issued_by: 'Tech Events Inc',
      type: 'participation',
      skills_covered: ['Technology Trends', 'Networking', 'Leadership'],
      eligibility_requirements: 'Attend at least 50% of the sessions',
      cost: 'free',
      delivery_method: 'automatic'
    }
  ]

  return (
    <div className="min-h-screen bg-secondary-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Certificate Features
        </h1>
        <p className="text-lg text-secondary-600 mb-8">
          Discover certificate opportunities available with NexMeet events
        </p>

        {/* Certificate Badges */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
            Certificate Indicators
          </h2>
          <p className="text-secondary-600 mb-4">
            Small badges that appear on event cards to indicate certificate availability:
          </p>
          <div className="flex gap-4 flex-wrap">
            <CertificateBadge certificate={sampleCertificates[0]} size="xs" />
            <CertificateBadge certificate={sampleCertificates[0]} size="sm" />
            <CertificateBadge certificate={sampleCertificates[0]} size="md" />
          </div>
        </section>

        {/* Certificate Information - Full */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
            Full Certificate Information
          </h2>
          <p className="text-secondary-600 mb-4">
            Detailed certificate information displayed on event details pages:
          </p>
          <CertificateInfo certificate={sampleCertificates[0]} />
        </section>

        {/* Certificate Information - Compact */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
            Compact Certificate Display
          </h2>
          <p className="text-secondary-600 mb-4">
            Expandable certificate information shown for past events:
          </p>
          <CertificateInfo certificate={sampleCertificates[1]} compact={true} />
        </section>

        {/* Multiple Certificates */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
            Different Certificate Types
          </h2>
          <p className="text-secondary-600 mb-4">
            Examples of various certificate types available through different events:
          </p>
          <div className="space-y-6">
            {sampleCertificates.map((cert, index) => (
              <CertificateInfo key={index} certificate={cert} compact={true} />
            ))}
          </div>
        </section>

        {/* Event Card Example */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
            Certificate Badge on Event Card
          </h2>
          <p className="text-secondary-600 mb-4">
            How certificate badges appear on actual event cards:
          </p>
          <div className="card p-6 max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                workshop
              </span>
              <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs font-medium rounded-full">
                In-Person
              </span>
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              AI/ML Workshop
            </h3>
            <p className="text-secondary-600 text-sm mb-3">
              Learn machine learning basics with Google experts and earn a certificate
            </p>
            <div className="flex items-center text-secondary-600 text-sm mb-3">
              <span>📅 Dec 15, 2024 • 2:00 PM</span>
            </div>
            <div className="flex items-center text-secondary-600 text-sm mb-3">
              <span>📍 Google Campus, Mountain View</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-secondary-100">
              <div className="flex items-center gap-3">
                <span className="text-sm text-secondary-600">
                  by <span className="font-medium">Google</span>
                </span>
                <CertificateBadge certificate={sampleCertificates[0]} size="xs" />
              </div>
              <div className="text-lg font-semibold text-secondary-900">
                Free
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section>
          <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
            Explore Certificate Features
          </h2>
          <p className="text-secondary-600 mb-6">
            See certificate features integrated throughout the NexMeet platform:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/events" className="card p-6 hover:shadow-md transition-shadow text-center">
              <h3 className="font-semibold text-secondary-900 mb-2">Events Page</h3>
              <p className="text-secondary-600 text-sm">View certificate badges on event cards</p>
            </Link>
            <Link to="/events/1" className="card p-6 hover:shadow-md transition-shadow text-center">
              <h3 className="font-semibold text-secondary-900 mb-2">Event Details</h3>
              <p className="text-secondary-600 text-sm">See full certificate information</p>
            </Link>
            <Link to="/login" className="card p-6 hover:shadow-md transition-shadow text-center">
              <h3 className="font-semibold text-secondary-900 mb-2">Dashboard</h3>
              <p className="text-secondary-600 text-sm">Certificate indicators after login</p>
            </Link>
          </div>
        </section>

        <div className="mt-8 p-6 bg-primary-50 border border-primary-200 rounded-lg">
          <h3 className="font-semibold text-primary-900 mb-3">🎯 Certificate Features Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-primary-800">
            <div>
              <h4 className="font-medium mb-2">Where Certificates Appear:</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Small badges on event cards</li>
                <li>Full sections on event details pages</li>
                <li>Indicators on user dashboard</li>
                <li>Expandable info for past events</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Design Principles:</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Non-intrusive supporting feature</li>
                <li>Maintains networking focus</li>
                <li>Consistent blue/primary theming</li>
                <li>Optional and organizer-controlled</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CertificateTest