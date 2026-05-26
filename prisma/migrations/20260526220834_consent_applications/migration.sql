-- CreateEnum
CREATE TYPE "ConsentApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'PROCESSING', 'APPROVED', 'DECLINED');

-- CreateTable
CREATE TABLE "ConsentApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "councilId" TEXT NOT NULL,
    "consentTypeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "siteAddress" TEXT,
    "referenceNumber" TEXT,
    "status" "ConsentApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedAt" TIMESTAMP(3),
    "decidedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsentApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentCorrespondenceLog" (
    "id" TEXT NOT NULL,
    "consentApplicationId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentCorrespondenceLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ConsentApplication" ADD CONSTRAINT "ConsentApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentCorrespondenceLog" ADD CONSTRAINT "ConsentCorrespondenceLog_consentApplicationId_fkey" FOREIGN KEY ("consentApplicationId") REFERENCES "ConsentApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
