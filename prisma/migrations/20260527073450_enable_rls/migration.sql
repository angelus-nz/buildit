-- Enable Row Level Security on all application tables.
--
-- This app uses NextAuth + Prisma (server-side service-role connection),
-- not Supabase Auth. All application queries bypass RLS automatically via the
-- service_role key. RLS here protects tables from direct PostgREST (anon/
-- authenticated role) access, with narrow public-read exceptions for content
-- that is genuinely public.

-- ─── Auth tables (service role only) ─────────────────────────────────────────

ALTER TABLE "Account"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User"              ENABLE ROW LEVEL SECURITY;

-- No anon policies — these tables are only touched by the server via service_role.

-- ─── Business profiles ────────────────────────────────────────────────────────

ALTER TABLE "Business" ENABLE ROW LEVEL SECURITY;

-- Allow anonymous (public) reads of published businesses only.
CREATE POLICY "public_read_published_businesses"
  ON "Business"
  FOR SELECT
  TO anon
  USING ("isPublished" = true);

-- ─── Projects (work showcase) ─────────────────────────────────────────────────

ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;

-- Public can read projects that are marked public AND belong to a published business.
CREATE POLICY "public_read_public_projects"
  ON "Project"
  FOR SELECT
  TO anon
  USING (
    "isPublic" = true
    AND EXISTS (
      SELECT 1 FROM "Business" b
      WHERE b.id = "Project"."businessId"
        AND b."isPublished" = true
    )
  );

-- ─── Project updates ──────────────────────────────────────────────────────────

ALTER TABLE "ProjectUpdate" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_project_updates"
  ON "ProjectUpdate"
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM "Project" p
      JOIN "Business" b ON b.id = p."businessId"
      WHERE p.id = "ProjectUpdate"."projectId"
        AND p."isPublic" = true
        AND b."isPublished" = true
    )
  );

-- ─── Project images ───────────────────────────────────────────────────────────

ALTER TABLE "ProjectImage" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_project_images"
  ON "ProjectImage"
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM "Project" p
      JOIN "Business" b ON b.id = p."businessId"
      WHERE p.id = "ProjectImage"."projectId"
        AND p."isPublic" = true
        AND b."isPublished" = true
    )
  );

-- ─── Reviews ──────────────────────────────────────────────────────────────────

ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;

-- Reviews on published businesses are public.
CREATE POLICY "public_read_reviews"
  ON "Review"
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM "Business" b
      WHERE b.id = "Review"."businessId"
        AND b."isPublished" = true
    )
  );

-- ─── Private tables (service role only) ──────────────────────────────────────

ALTER TABLE "Quote"                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invoice"                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Inquiry"                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Conversation"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Message"                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ConversationParticipant"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ConsentApplication"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ConsentCorrespondenceLog"  ENABLE ROW LEVEL SECURITY;

-- No anon policies on private tables — all access is server-side via service_role.
