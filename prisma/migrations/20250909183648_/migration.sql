/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `status` on the `MediaStatus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."LibraryStatus" AS ENUM ('WISHLIST', 'WATCHING', 'COMPLETED', 'DROPPED', 'PAUSED');

-- AlterTable
ALTER TABLE "public"."Media" ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "imdbRating" DOUBLE PRECISION,
ADD COLUMN     "posterUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."MediaStatus" ADD COLUMN     "currentEpisode" INTEGER,
ADD COLUMN     "currentPage" INTEGER,
ADD COLUMN     "currentSeason" INTEGER,
ADD COLUMN     "totalPages" INTEGER,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."LibraryStatus" NOT NULL;

-- CreateTable
CREATE TABLE "public"."SourceMeta" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "lastFetched" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "mediaId" TEXT NOT NULL,

    CONSTRAINT "SourceMeta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SourceMeta_expiresAt_idx" ON "public"."SourceMeta"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "SourceMeta_source_externalId_key" ON "public"."SourceMeta"("source", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Media_externalId_key" ON "public"."Media"("externalId");

-- CreateIndex
CREATE INDEX "MediaStatus_status_idx" ON "public"."MediaStatus"("status");

-- AddForeignKey
ALTER TABLE "public"."SourceMeta" ADD CONSTRAINT "SourceMeta_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
