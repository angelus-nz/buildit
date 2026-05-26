-- BUI-5: Add ProjectUpdate model; extend Project with isPublic + PLANNING status

-- Add PLANNING to the ProjectStatus enum
ALTER TYPE "ProjectStatus" ADD VALUE IF NOT EXISTS 'PLANNING';

-- Add isPublic column to Project (default true so existing rows stay public)
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN NOT NULL DEFAULT true;

-- Create ProjectUpdate table
CREATE TABLE IF NOT EXISTS "ProjectUpdate" (
  "id"        TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "body"      TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ProjectUpdate_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ProjectUpdate_projectId_fkey"
    FOREIGN KEY ("projectId")
    REFERENCES "Project"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "ProjectUpdate_projectId_idx" ON "ProjectUpdate"("projectId");

-- Add optional updateId FK to ProjectImage
ALTER TABLE "ProjectImage" ADD COLUMN IF NOT EXISTS "updateId" TEXT;

ALTER TABLE "ProjectImage"
  ADD CONSTRAINT IF NOT EXISTS "ProjectImage_updateId_fkey"
    FOREIGN KEY ("updateId")
    REFERENCES "ProjectUpdate"("id")
    ON DELETE SET NULL
    ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "ProjectImage_updateId_idx" ON "ProjectImage"("updateId");
