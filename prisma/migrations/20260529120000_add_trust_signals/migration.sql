-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('NONE', 'SELF_DECLARED', 'VERIFIED');

-- AlterTable: add trust signal fields to Business
ALTER TABLE "Business"
  ADD COLUMN "lbpNumber"               TEXT,
  ADD COLUMN "nzbn"                    TEXT,
  ADD COLUMN "insuranceCarrier"        TEXT,
  ADD COLUMN "insuranceExpiry"         TIMESTAMP(3),
  ADD COLUMN "trustVerificationStatus" "VerificationStatus" NOT NULL DEFAULT 'NONE';

-- CreateTable
CREATE TABLE "Certification" (
    "id"                 TEXT NOT NULL,
    "businessId"         TEXT NOT NULL,
    "name"               TEXT NOT NULL,
    "issuingBody"        TEXT,
    "certNumber"         TEXT,
    "expiresAt"          TIMESTAMP(3),
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'SELF_DECLARED',
    "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"          TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_businessId_fkey"
  FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
