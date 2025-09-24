-- CreateEnum
CREATE TYPE "public"."MediaType" AS ENUM ('MOVIE', 'SERIES', 'BOOK');

-- CreateEnum
CREATE TYPE "public"."WatchStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'COMPLETED', 'DROPPED', 'PAUSED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Media" (
    "id" TEXT NOT NULL,
    "type" "public"."MediaType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "year" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SeriesDetails" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "episodes" INTEGER,
    "seasons" INTEGER,

    CONSTRAINT "SeriesDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MovieDetails" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "runtimeMinutes" INTEGER,
    "director" TEXT,

    CONSTRAINT "MovieDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BookDetails" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "author" TEXT,
    "pages" INTEGER,

    CONSTRAINT "BookDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MediaStatus" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "status" "public"."WatchStatus" NOT NULL,
    "rating" INTEGER,
    "progress" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Media_type_title_idx" ON "public"."Media"("type", "title");

-- CreateIndex
CREATE UNIQUE INDEX "SeriesDetails_mediaId_key" ON "public"."SeriesDetails"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "MovieDetails_mediaId_key" ON "public"."MovieDetails"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "BookDetails_mediaId_key" ON "public"."BookDetails"("mediaId");

-- CreateIndex
CREATE INDEX "MediaStatus_status_idx" ON "public"."MediaStatus"("status");

-- CreateIndex
CREATE UNIQUE INDEX "MediaStatus_userId_mediaId_key" ON "public"."MediaStatus"("userId", "mediaId");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SeriesDetails" ADD CONSTRAINT "SeriesDetails_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MovieDetails" ADD CONSTRAINT "MovieDetails_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookDetails" ADD CONSTRAINT "BookDetails_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MediaStatus" ADD CONSTRAINT "MediaStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MediaStatus" ADD CONSTRAINT "MediaStatus_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
