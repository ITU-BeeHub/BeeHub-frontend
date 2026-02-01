#!/bin/bash

# Main build script for BeeHub Application
# Builds both backend and frontend for all platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${GREEN}=== BeeHub Complete Build Process ===${NC}"
echo "Root directory: $ROOT_DIR"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check dependencies
echo -e "${YELLOW}Checking dependencies...${NC}"

if ! command_exists go; then
    echo -e "${RED}Go is not installed. Please install Go first.${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}NPM is not installed. Please install NPM first.${NC}"
    exit 1
fi

echo -e "${GREEN}All dependencies found!${NC}"

# Build backend
echo -e "${BLUE}=== Building Backend ===${NC}"
cd "$ROOT_DIR/BeeHub-backend"
chmod +x ../build-scripts/build-backend.sh
../build-scripts/build-backend.sh

# Build frontend  
echo -e "${BLUE}=== Building Frontend ===${NC}"
cd "$ROOT_DIR"
chmod +x build-scripts/build-frontend.sh
build-scripts/build-frontend.sh

echo -e "${GREEN}=== Build Process Complete! ===${NC}"
echo -e "${YELLOW}Build artifacts:${NC}"
echo "- Backend: $ROOT_DIR/BeeHub-backend/builds/"
echo "- Frontend: $ROOT_DIR/BeeHub-frontend/dist/"

# Create release directory
RELEASE_DIR="$ROOT_DIR/releases/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$RELEASE_DIR"

# Copy builds to release directory
if [ -d "$ROOT_DIR/BeeHub-backend/builds" ]; then
    cp -r "$ROOT_DIR/BeeHub-backend/builds" "$RELEASE_DIR/backend"
    echo -e "${GREEN}Backend builds copied to release directory${NC}"
fi

if [ -d "$ROOT_DIR/BeeHub-frontend/dist" ]; then
    cp -r "$ROOT_DIR/BeeHub-frontend/dist" "$RELEASE_DIR/frontend"  
    echo -e "${GREEN}Frontend builds copied to release directory${NC}"
fi

echo -e "${GREEN}Release created at: $RELEASE_DIR${NC}"