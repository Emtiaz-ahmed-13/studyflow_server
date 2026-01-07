-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "MeditationType" ADD VALUE 'GROUNDING_54321';
ALTER TYPE "MeditationType" ADD VALUE 'MANTRA_MEDITATION';
ALTER TYPE "MeditationType" ADD VALUE 'ALPHA_STATE_BREATHING';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "StudyTechniqueType" ADD VALUE 'INTERLEAVED_PRACTICE';
ALTER TYPE "StudyTechniqueType" ADD VALUE 'RETRIEVAL_LADDER';
ALTER TYPE "StudyTechniqueType" ADD VALUE 'CORNELL_NOTE_TAKING';
ALTER TYPE "StudyTechniqueType" ADD VALUE 'BLUR_TEACH_METHOD';
ALTER TYPE "StudyTechniqueType" ADD VALUE 'ACTIVE_ERROR_LOG';
ALTER TYPE "StudyTechniqueType" ADD VALUE 'POMODORO_PLUS';
