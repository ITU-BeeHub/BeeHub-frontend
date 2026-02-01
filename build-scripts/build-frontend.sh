#!/bin/bash

# Build script for BeeHub Frontend (Electron)
# Cross-compilation for multiple platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

cd "$(dirname "$0")/../BeeHub-frontend"

echo -e "${GREEN}Building BeeHub Frontend (Electron)${NC}"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Build the app first
echo -e "${YELLOW}Building application...${NC}"
npm run build

# Build for different platforms
echo -e "${BLUE}Available build targets:${NC}"
echo "1. Windows x86-64"
echo "2. macOS ARM64" 
echo "3. macOS x86-64"
echo "4. Linux"
echo "5. All platforms"

read -p "Select build target (1-5): " target

case $target in
    1)
        echo -e "${YELLOW}Building for Windows x86-64...${NC}"
        npm run build:win
        ;;
    2)
        echo -e "${YELLOW}Building for macOS ARM64...${NC}"
        electron-builder --mac --arm64
        ;;
    3)
        echo -e "${YELLOW}Building for macOS x86-64...${NC}"
        electron-builder --mac --x64
        ;;
    4)
        echo -e "${YELLOW}Building for Linux...${NC}"
        npm run build:linux
        ;;
    5)
        echo -e "${YELLOW}Building for all platforms...${NC}"
        echo -e "${BLUE}Building Windows x86-64...${NC}"
        npm run build:win
        
        echo -e "${BLUE}Building macOS ARM64...${NC}"
        electron-builder --mac --arm64
        
        echo -e "${BLUE}Building macOS x86-64...${NC}"
        electron-builder --mac --x64
        
        echo -e "${BLUE}Building Linux...${NC}"
        npm run build:linux
        ;;
    *)
        echo -e "${RED}Invalid selection${NC}"
        exit 1
        ;;
esac

echo -e "${GREEN}Frontend builds completed successfully!${NC}"
echo "Build outputs are in the 'dist' directory"
ls -la dist/ 2>/dev/null || echo "No dist directory found"