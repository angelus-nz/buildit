#!/bin/bash
# Runs prisma migrate deploy, auto-baselining if the DB has an existing schema
# without migration history (Prisma P3005 error).
set -e

MIGRATIONS=(
  "20260526_add_inquiry_model"
  "20260526_add_project_updates"
  "20260526213803_init"
  "20260526220834_consent_applications"
  "20260526222851_add_review_reply"
  "20260526223027_messaging_conversations"
  "20260527073450_enable_rls"
  "20260527093000_add_consent_form_data_and_templates"
  "20260529120000_add_trust_signals"
  "20260529140000_add_review_invoice_link"
)

OUTPUT=$(npx prisma migrate deploy 2>&1)
EXIT_CODE=$?

if echo "$OUTPUT" | grep -q "P3005"; then
  echo "P3005: database has existing schema but no migration history. Baselining..."
  for migration in "${MIGRATIONS[@]}"; do
    echo "  Marking applied: $migration"
    npx prisma migrate resolve --applied "$migration"
  done
  echo "Baseline complete. Running migrate deploy..."
  npx prisma migrate deploy
else
  echo "$OUTPUT"
  exit $EXIT_CODE
fi
