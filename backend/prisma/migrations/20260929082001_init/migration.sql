-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ORGANIZER', 'ADMIN');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('workshop', 'conference', 'seminar', 'meetup', 'hackathon', 'webinar', 'networking', 'career', 'startup', 'research', 'community', 'lecture', 'tech', 'company', 'college', 'other');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('beginner', 'intermediate', 'advanced', 'all');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('REGISTERED', 'CANCELLED', 'WAITLISTED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('REGISTERED', 'ATTENDED', 'DID_NOT_ATTEND');

-- CreateEnum
CREATE TYPE "ConnectionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'REMOVED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('REGISTRATION_CONFIRMED', 'CONNECTION_REQUEST', 'CONNECTION_ACCEPTED', 'EVENT_REMINDER', 'EVENT_UPDATED', 'EVENT_CANCELLED', 'COMMUNITY_UPDATE', 'RECOMMENDATION', 'REVIEW_REMINDER', 'REGISTRATION_CLOSING');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "ReportTargetType" AS ENUM ('USER', 'EVENT', 'COMMUNITY_POST', 'COMMENT');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "CertificateType" AS ENUM ('participation', 'completion', 'achievement', 'other');

-- CreateEnum
CREATE TYPE "PrivacyLevel" AS ENUM ('PUBLIC', 'CONNECTIONS', 'PRIVATE');

-- CreateEnum
CREATE TYPE "AttendanceVisibility" AS ENUM ('VISIBLE', 'CONNECTIONS_ONLY', 'HIDDEN');

-- CreateEnum
CREATE TYPE "ConnectionPreference" AS ENUM ('ANYONE', 'SAME_INTERESTS', 'SAME_EVENTS', 'CONNECTIONS_OF_CONNECTIONS');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "about" TEXT,
    "careerGoals" TEXT,
    "college" TEXT,
    "company" TEXT,
    "jobTitle" TEXT,
    "field" TEXT,
    "location" TEXT,
    "city" TEXT,
    "website" TEXT,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "twitterUrl" TEXT,
    "experienceLevel" "ExperienceLevel",
    "profileVisibility" "PrivacyLevel" NOT NULL DEFAULT 'PUBLIC',
    "skillsVisible" BOOLEAN NOT NULL DEFAULT true,
    "interestsVisible" BOOLEAN NOT NULL DEFAULT true,
    "collegeCompanyVisible" BOOLEAN NOT NULL DEFAULT true,
    "networkingIntentVisible" BOOLEAN NOT NULL DEFAULT true,
    "lookingForVisible" BOOLEAN NOT NULL DEFAULT true,
    "attendanceVisibility" "AttendanceVisibility" NOT NULL DEFAULT 'VISIBLE',
    "connectionPreference" "ConnectionPreference" NOT NULL DEFAULT 'ANYONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_skills" (
    "profileId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "user_skills_pkey" PRIMARY KEY ("profileId","skillId")
);

-- CreateTable
CREATE TABLE "user_interests" (
    "profileId" TEXT NOT NULL,
    "interestId" TEXT NOT NULL,

    CONSTRAINT "user_interests_pkey" PRIMARY KEY ("profileId","interestId")
);

-- CreateTable
CREATE TABLE "networking_intent_options" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "networking_intent_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "looking_for_options" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "looking_for_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_networking_intents" (
    "profileId" TEXT NOT NULL,
    "intentId" TEXT NOT NULL,

    CONSTRAINT "user_networking_intents_pkey" PRIMARY KEY ("profileId","intentId")
);

-- CreateTable
CREATE TABLE "user_looking_for" (
    "profileId" TEXT NOT NULL,
    "lookingForId" TEXT NOT NULL,

    CONSTRAINT "user_looking_for_pkey" PRIMARY KEY ("profileId","lookingForId")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "category" "EventCategory" NOT NULL DEFAULT 'other',
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "location" TEXT,
    "city" TEXT,
    "area" TEXT,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "onlineUrl" TEXT,
    "capacity" INTEGER,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "registrationDeadline" TIMESTAMP(3),
    "registrationUrl" TEXT,
    "experienceLevel" "ExperienceLevel" NOT NULL DEFAULT 'all',
    "networkingAvailable" BOOLEAN NOT NULL DEFAULT false,
    "certificateAvailable" BOOLEAN NOT NULL DEFAULT false,
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "externalId" TEXT,
    "sourceId" TEXT,
    "coverImage" TEXT,
    "tags" TEXT[],
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_skills" (
    "eventId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "event_skills_pkey" PRIMARY KEY ("eventId","skillId")
);

-- CreateTable
CREATE TABLE "event_speakers" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "company" TEXT,
    "bio" TEXT,
    "photoUrl" TEXT,
    "linkedinUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_speakers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_resources" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_certificates" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "issuedBy" TEXT,
    "certificateType" "CertificateType" NOT NULL DEFAULT 'participation',
    "skillsCovered" TEXT[],
    "eligibility" TEXT,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "amount" DOUBLE PRECISION,
    "deliveryMethod" TEXT,
    "officialUrl" TEXT,
    "additionalInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_registrations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'REGISTERED',
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_events" (
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_events_pkey" PRIMARY KEY ("userId","eventId")
);

-- CreateTable
CREATE TABLE "event_attendance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'REGISTERED',
    "markedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "connections" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "status" "ConnectionStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communities" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "communities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_posts" (
    "id" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_comments" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "relatedEntityId" TEXT,
    "relatedEntityType" TEXT,
    "actionUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "city" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "verificationNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizer_verifications" (
    "id" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "documents" TEXT[],
    "notes" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizer_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reportedUserId" TEXT,
    "targetType" "ReportTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "resolution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_change_history" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "changedById" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "fieldName" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_change_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_sources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "baseUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_sync_logs" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "eventId" TEXT,
    "status" "SyncStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "rawData" JSONB,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_sync_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "interests_name_key" ON "interests"("name");

-- CreateIndex
CREATE UNIQUE INDEX "networking_intent_options_value_key" ON "networking_intent_options"("value");

-- CreateIndex
CREATE UNIQUE INDEX "looking_for_options_value_key" ON "looking_for_options"("value");

-- CreateIndex
CREATE INDEX "events_startDateTime_idx" ON "events"("startDateTime");

-- CreateIndex
CREATE INDEX "events_city_idx" ON "events"("city");

-- CreateIndex
CREATE INDEX "events_category_idx" ON "events"("category");

-- CreateIndex
CREATE INDEX "events_organizerId_idx" ON "events"("organizerId");

-- CreateIndex
CREATE INDEX "events_status_idx" ON "events"("status");

-- CreateIndex
CREATE INDEX "events_isOnline_idx" ON "events"("isOnline");

-- CreateIndex
CREATE UNIQUE INDEX "event_certificates_eventId_key" ON "event_certificates"("eventId");

-- CreateIndex
CREATE INDEX "event_registrations_eventId_idx" ON "event_registrations"("eventId");

-- CreateIndex
CREATE INDEX "event_registrations_userId_idx" ON "event_registrations"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "event_registrations_userId_eventId_key" ON "event_registrations"("userId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "event_attendance_userId_eventId_key" ON "event_attendance"("userId", "eventId");

-- CreateIndex
CREATE INDEX "connections_requesterId_idx" ON "connections"("requesterId");

-- CreateIndex
CREATE INDEX "connections_targetId_idx" ON "connections"("targetId");

-- CreateIndex
CREATE UNIQUE INDEX "connections_requesterId_targetId_key" ON "connections"("requesterId", "targetId");

-- CreateIndex
CREATE UNIQUE INDEX "communities_eventId_key" ON "communities"("eventId");

-- CreateIndex
CREATE INDEX "community_posts_communityId_idx" ON "community_posts"("communityId");

-- CreateIndex
CREATE INDEX "community_comments_postId_idx" ON "community_comments"("postId");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "notifications"("isRead");

-- CreateIndex
CREATE INDEX "reviews_eventId_idx" ON "reviews"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_eventId_userId_key" ON "reviews"("eventId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "organizers_userId_key" ON "organizers"("userId");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");

-- CreateIndex
CREATE INDEX "event_change_history_eventId_idx" ON "event_change_history"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "event_sources_name_key" ON "event_sources"("name");

-- CreateIndex
CREATE INDEX "event_sync_logs_sourceId_idx" ON "event_sync_logs"("sourceId");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interests" ADD CONSTRAINT "user_interests_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_interests" ADD CONSTRAINT "user_interests_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "interests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_networking_intents" ADD CONSTRAINT "user_networking_intents_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_networking_intents" ADD CONSTRAINT "user_networking_intents_intentId_fkey" FOREIGN KEY ("intentId") REFERENCES "networking_intent_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_looking_for" ADD CONSTRAINT "user_looking_for_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_looking_for" ADD CONSTRAINT "user_looking_for_lookingForId_fkey" FOREIGN KEY ("lookingForId") REFERENCES "looking_for_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "organizers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "event_sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_skills" ADD CONSTRAINT "event_skills_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_skills" ADD CONSTRAINT "event_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_speakers" ADD CONSTRAINT "event_speakers_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_resources" ADD CONSTRAINT "event_resources_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_certificates" ADD CONSTRAINT "event_certificates_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_events" ADD CONSTRAINT "saved_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_events" ADD CONSTRAINT "saved_events_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendance" ADD CONSTRAINT "event_attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendance" ADD CONSTRAINT "event_attendance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connections" ADD CONSTRAINT "connections_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connections" ADD CONSTRAINT "connections_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communities" ADD CONSTRAINT "communities_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizers" ADD CONSTRAINT "organizers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizer_verifications" ADD CONSTRAINT "organizer_verifications_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "organizers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_change_history" ADD CONSTRAINT "event_change_history_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_change_history" ADD CONSTRAINT "event_change_history_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_sync_logs" ADD CONSTRAINT "event_sync_logs_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "event_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_sync_logs" ADD CONSTRAINT "event_sync_logs_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
