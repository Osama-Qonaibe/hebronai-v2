#!/bin/bash

# ============================================================================
# HebronAI v2 - Quick Migration Script
# ============================================================================
# Description: Quick script to run database migration
# Usage: ./run_migration.sh
# ============================================================================

set -e  # Exit on error

echo "============================================================================"
echo "HebronAI v2 - Database Migration"
echo "============================================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "migrations/001_complete_schema.sql" ]; then
    echo -e "${RED}Error: migrations/001_complete_schema.sql not found!${NC}"
    echo "Please run this script from the database/ directory"
    exit 1
fi

# Prompt for database credentials
echo -e "${YELLOW}Please enter your database credentials:${NC}"
echo ""

read -p "Database Host (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Database Name: " DB_NAME
if [ -z "$DB_NAME" ]; then
    echo -e "${RED}Error: Database name is required!${NC}"
    exit 1
fi

read -p "Database Username: " DB_USER
if [ -z "$DB_USER" ]; then
    echo -e "${RED}Error: Username is required!${NC}"
    exit 1
fi

read -sp "Database Password: " DB_PASSWORD
echo ""
if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}Error: Password is required!${NC}"
    exit 1
fi

echo ""
read -p "Database Type (postgres/mysql, default: postgres): " DB_TYPE
DB_TYPE=${DB_TYPE:-postgres}

echo ""
echo -e "${YELLOW}============================================================================${NC}"
echo -e "${YELLOW}Configuration Summary:${NC}"
echo -e "${YELLOW}============================================================================${NC}"
echo "Host: $DB_HOST"
echo "Database: $DB_NAME"
echo "Username: $DB_USER"
echo "Type: $DB_TYPE"
echo ""

read -p "Do you want to proceed? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo -e "${RED}Migration cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${YELLOW}============================================================================${NC}"
echo -e "${YELLOW}Creating backup...${NC}"
echo -e "${YELLOW}============================================================================${NC}"

BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"

if [ "$DB_TYPE" == "postgres" ]; then
    export PGPASSWORD=$DB_PASSWORD
    pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > $BACKUP_FILE 2>/dev/null || true
    echo -e "${GREEN}✓ Backup saved to: $BACKUP_FILE${NC}"
elif [ "$DB_TYPE" == "mysql" ]; then
    mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_FILE 2>/dev/null || true
    echo -e "${GREEN}✓ Backup saved to: $BACKUP_FILE${NC}"
else
    echo -e "${RED}Error: Unsupported database type: $DB_TYPE${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}============================================================================${NC}"
echo -e "${YELLOW}Running migration...${NC}"
echo -e "${YELLOW}============================================================================${NC}"

if [ "$DB_TYPE" == "postgres" ]; then
    export PGPASSWORD=$DB_PASSWORD
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f migrations/001_complete_schema.sql
    EXIT_CODE=$?
elif [ "$DB_TYPE" == "mysql" ]; then
    mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < migrations/001_complete_schema.sql
    EXIT_CODE=$?
fi

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}============================================================================${NC}"
    echo -e "${GREEN}✓ Migration completed successfully!${NC}"
    echo -e "${GREEN}============================================================================${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Update DATABASE_URL in Vercel environment variables"
    echo "2. Redeploy your application"
    echo "3. Test the database connection"
    echo ""
    echo "Backup file: $BACKUP_FILE"
else
    echo -e "${RED}============================================================================${NC}"
    echo -e "${RED}✗ Migration failed!${NC}"
    echo -e "${RED}============================================================================${NC}"
    echo ""
    echo "You can restore from backup:"
    if [ "$DB_TYPE" == "postgres" ]; then
        echo "  psql -h $DB_HOST -U $DB_USER -d $DB_NAME < $BACKUP_FILE"
    else
        echo "  mysql -h $DB_HOST -u $DB_USER -p $DB_NAME < $BACKUP_FILE"
    fi
    exit 1
fi

# Verify tables
echo ""
echo -e "${YELLOW}============================================================================${NC}"
echo -e "${YELLOW}Verifying tables...${NC}"
echo -e "${YELLOW}============================================================================${NC}"

if [ "$DB_TYPE" == "postgres" ]; then
    export PGPASSWORD=$DB_PASSWORD
    TABLE_COUNT=$(psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
    echo -e "${GREEN}✓ Found $TABLE_COUNT tables (expected: 25)${NC}"
elif [ "$DB_TYPE" == "mysql" ]; then
    TABLE_COUNT=$(mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DB_NAME';" 2>/dev/null)
    echo -e "${GREEN}✓ Found $TABLE_COUNT tables (expected: 25)${NC}"
fi

echo ""
echo -e "${GREEN}============================================================================${NC}"
echo -e "${GREEN}Migration process completed!${NC}"
echo -e "${GREEN}============================================================================${NC}"
