-- DropForeignKey
ALTER TABLE "ai_chat_sessions" DROP CONSTRAINT "ai_chat_sessions_readingMaterialId_fkey";

-- AlterTable
ALTER TABLE "ai_chat_sessions" ALTER COLUMN "readingMaterialId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ai_chat_sessions" ADD CONSTRAINT "ai_chat_sessions_readingMaterialId_fkey" FOREIGN KEY ("readingMaterialId") REFERENCES "reading_materials"("id") ON DELETE SET NULL ON UPDATE CASCADE;
