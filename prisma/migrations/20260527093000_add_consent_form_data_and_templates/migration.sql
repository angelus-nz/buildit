-- Add formData JSON field to ConsentApplication for storing detailed form answers.
-- Add ConsentApplicationTemplate for tradesman-owned reusable form templates.

ALTER TABLE "ConsentApplication" ADD COLUMN "formData" JSONB;

CREATE TABLE "ConsentApplicationTemplate" (
  "id"            TEXT NOT NULL,
  "userId"        TEXT NOT NULL,
  "name"          TEXT NOT NULL,
  "consentTypeId" TEXT,
  "formData"      JSONB NOT NULL,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ConsentApplicationTemplate_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ConsentApplicationTemplate"
  ADD CONSTRAINT "ConsentApplicationTemplate_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enable RLS on the new table (service role only — no anon access)
ALTER TABLE "ConsentApplicationTemplate" ENABLE ROW LEVEL SECURITY;
