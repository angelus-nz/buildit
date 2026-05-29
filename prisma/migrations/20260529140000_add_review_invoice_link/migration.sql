-- Add invoiceId to Review for job-linked reviews (anti-abuse: one review per completed job)
ALTER TABLE "Review" ADD COLUMN "invoiceId" TEXT;

-- Unique constraint: one review per invoice
ALTER TABLE "Review" ADD CONSTRAINT "Review_invoiceId_key" UNIQUE ("invoiceId");

-- Foreign key: Review -> Invoice
ALTER TABLE "Review" ADD CONSTRAINT "Review_invoiceId_fkey"
  FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
