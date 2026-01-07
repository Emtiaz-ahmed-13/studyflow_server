-- CreateEnum
CREATE TYPE "MaterialType" AS ENUM ('PDF', 'YOUTUBE', 'ARTICLE', 'GOOGLE_DRIVE', 'CUSTOM');

-- AlterTable
ALTER TABLE "reading_materials" ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "type" "MaterialType" NOT NULL DEFAULT 'PDF',
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "study_techniques" ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Study Session',
ALTER COLUMN "duration" DROP NOT NULL;
