#!/bin/bash

# Build script for macOS ARM64 DMG installer
# To be run on macOS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Building BeeHub macOS DMG Installer ===${NC}"
echo "Target: macOS ARM64 DMG"
echo "Build environment: macOS"
echo ""

# Navigate to frontend directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ROOT_DIR="$(cd "$FRONTEND_DIR/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/BeeHub-backend"

cd "$FRONTEND_DIR"

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

if ! command -v go >/dev/null 2>&1; then
    echo -e "${RED}Go not found! Please install Go first.${NC}"
    exit 1
fi

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${YELLOW}⚠️  Warning: This script is optimized for macOS${NC}"
    echo -e "${YELLOW}   DMG creation may not work properly on other platforms${NC}"
fi

# Build backend for macOS ARM64
echo -e "${YELLOW}Building backend for macOS ARM64...${NC}"
cd "$BACKEND_DIR"
GOOS=darwin GOARCH=arm64 go build -ldflags="-s -w" -o "beehub-mac-arm" ./cmd/beeHub/main.go
echo -e "${GREEN}✅ Backend built: beehub-mac-arm${NC}"
ls -lh beehub-mac-arm

# Return to frontend directory
cd "$SCRIPT_DIR/.."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Build macOS DMG
echo -e "${YELLOW}Building macOS ARM64 DMG...${NC}"
npm run build:mac-dmg

# Check if build was successful
DMG_FILE=$(find dist -name "*.dmg" -type f | head -1)
if [ -n "$DMG_FILE" ]; then
    echo -e "${GREEN}✅ macOS DMG built successfully!${NC}"
    echo -e "${BLUE}File: $DMG_FILE${NC}"
    ls -lh "$DMG_FILE"
    
    # Show DMG info
    if command -v hdiutil >/dev/null 2>&1; then
        echo ""
        echo -e "${BLUE}DMG Information:${NC}"
        hdiutil imageinfo "$DMG_FILE" | grep -E "(Format|Size|Compressed"
    fi
else
    echo -e "${RED}❌ macOS DMG build failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 macOS DMG build complete!${NC}"
echo -e "${YELLOW}Installation file ready for distribution${NC}"
echo ""
echo -e "${BLUE}To test the DMG:${NC}"
echo "  1. Double-click the DMG file"
echo "  2. Drag BeeHub to Applications folder"
echo "  3. Eject the DMG"
echo "  4. Launch BeeHub from Applications"