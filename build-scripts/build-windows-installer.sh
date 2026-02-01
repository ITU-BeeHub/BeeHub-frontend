#!/bin/bash

# Build script for Windows x86-64 installer 
# To be run on macOS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Building BeeHub Windows Installer ===${NC}"
echo "Target: Windows x86-64 NSIS Installer"
echo "Build environment: macOS"
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")/../BeeHub-frontend"

# Check dependencies
echo -e "${YELLOW}Checking dependencies...${NC}"
if ! command -v node >/dev/null 2>&1; then
    echo -e "${RED}Node.js not found! Please install Node.js first.${NC}"
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    echo -e "${RED}NPM not found! Please install NPM first.${NC}"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Build Windows installer
echo -e "${YELLOW}Building Windows x86-64 installer...${NC}"
npm run build:win-installer

# Check if build was successful
if [ -f "dist/BeeHub Setup 1.2.1.exe" ]; then
    echo -e "${GREEN}✅ Windows installer built successfully!${NC}"
    echo -e "${BLUE}File: dist/BeeHub Setup 1.2.1.exe${NC}"
    ls -lh "dist/BeeHub Setup 1.2.1.exe"
else
    echo -e "${RED}❌ Windows installer build failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Windows build complete!${NC}"
echo -e "${YELLOW}Installation file ready for distribution${NC}"