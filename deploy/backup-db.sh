#!/bin/sh
# ==============================================================================
# Kuwait Painters Platform - Comprehensive Production Backup Script
# Backs up both:
#   1. PostgreSQL database container (kuwait-painters-postgres)
#   2. JSON State Storage (.data/kuwait-painters-db.json)
#
# Retention: 14 days of rotating gzipped backups
# Safe for EC2 cron jobs: /etc/cron.daily/kuwait-painters-backup
# ==============================================================================

set -eu

BACKUP_DIR="${BACKUP_DIR:-/var/backups/kuwait-painters}"
PROJECT_ROOT="${PROJECT_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
DATA_DIR="${DATA_DIR:-${PROJECT_ROOT}/.data}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

CONTAINER_NAME="kuwait-painters-postgres"
DB_NAME="${POSTGRES_DB:-kuwait_painters}"
DB_USER="${POSTGRES_USER:-kuwait_admin}"

mkdir -p "${BACKUP_DIR}"

echo "========================================================================"
echo "[$(date -Iseconds)] Kuwait Painters Backup Job Started"
echo "Backup Directory: ${BACKUP_DIR}"
echo "========================================================================"

# ------------------------------------------------------------------------------
# 1. JSON Database Storage Backup (.data/kuwait-painters-db.json)
# ------------------------------------------------------------------------------
JSON_SRC="${DATA_DIR}/kuwait-painters-db.json"
JSON_BACKUP_FILE="${BACKUP_DIR}/kuwait_painters_json_${TIMESTAMP}.json.gz"

if [ -f "${JSON_SRC}" ]; then
  echo "[$(date -Iseconds)] Backing up JSON state storage: ${JSON_SRC}..."
  gzip -c "${JSON_SRC}" > "${JSON_BACKUP_FILE}"
  JSON_SIZE=$(du -h "${JSON_BACKUP_FILE}" | cut -f1)
  echo "[$(date -Iseconds)] JSON backup successfully created: ${JSON_BACKUP_FILE} (${JSON_SIZE})"
else
  echo "[$(date -Iseconds)] WARNING: JSON file not found at ${JSON_SRC}, skipping JSON backup."
fi

# ------------------------------------------------------------------------------
# 2. PostgreSQL Container Backup (pg_dump)
# ------------------------------------------------------------------------------
PG_BACKUP_FILE="${BACKUP_DIR}/kuwait_painters_pg_${TIMESTAMP}.sql.gz"

if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "[$(date -Iseconds)] Backing up PostgreSQL database '${DB_NAME}' from '${CONTAINER_NAME}'..."
  docker exec -t "${CONTAINER_NAME}" pg_dump -U "${DB_USER}" -d "${DB_NAME}" | gzip > "${PG_BACKUP_FILE}"
  
  if [ -s "${PG_BACKUP_FILE}" ]; then
    PG_SIZE=$(du -h "${PG_BACKUP_FILE}" | cut -f1)
    echo "[$(date -Iseconds)] PostgreSQL backup successfully created: ${PG_BACKUP_FILE} (${PG_SIZE})"
  else
    echo "[$(date -Iseconds)] ERROR: PostgreSQL backup file is empty!"
    rm -f "${PG_BACKUP_FILE}"
    exit 1
  fi
else
  echo "[$(date -Iseconds)] INFO: Container '${CONTAINER_NAME}' is not currently running. Skipping pg_dump."
fi

# ------------------------------------------------------------------------------
# 3. Retention Cleanup (Pruning backups older than 14 days)
# ------------------------------------------------------------------------------
echo "[$(date -Iseconds)] Pruning backup files older than 14 days..."
find "${BACKUP_DIR}" -type f \( -name "kuwait_painters_*.sql.gz" -o -name "kuwait_painters_*.json.gz" \) -mtime +14 -exec rm -f {} \;

echo "========================================================================"
echo "[$(date -Iseconds)] Kuwait Painters Backup Completed Successfully."
echo "========================================================================"
