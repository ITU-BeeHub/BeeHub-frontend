#!/bin/bash

# Build script for BeeHub Backend
# Cross-compilation for multiple platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to backend directory
cd "$(dirname "$0")/../BeeHub-backend"

# Build directory
BUILD_DIR="./builds"
BINARY_NAME="beehub"
VERSION=$(cat version.txt 2>/dev/null || echo "1.0.0")

echo -e "${GREEN}Building BeeHub Backend v${VERSION}${NC}"
echo "Working directory: $(pwd)"

# Create build directory
mkdir -p "$BUILD_DIR"

# Clean previous builds
rm -rf "$BUILD_DIR"/*

# Build for different platforms
echo -e "${YELLOW}Building for Windows x86-64...${NC}"
GOOS=windows GOARCH=amd64 go build -ldflags="-s -w" -o "$BUILD_DIR/windows-amd64/${BINARY_NAME}.exe" ./cmd/beeHub/main.go

echo -e "${YELLOW}Building for macOS ARM64...${NC}"
GOOS=darwin GOARCH=arm64 go build -ldflags="-s -w" -o "$BUILD_DIR/darwin-arm64/${BINARY_NAME}" ./cmd/beeHub/main.go

echo -e "${YELLOW}Building for macOS x86-64...${NC}"
GOOS=darwin GOARCH=amd64 go build -ldflags="-s -w" -o "$BUILD_DIR/darwin-amd64/${BINARY_NAME}" ./cmd/beeHub/main.go

echo -e "${YELLOW}Building for Linux x86-64...${NC}"
GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o "$BUILD_DIR/linux-amd64/${BINARY_NAME}" ./cmd/beeHub/main.go

# Copy config files to each build
for dir in "$BUILD_DIR"/*; do
    if [ -d "$dir" ]; then
        cp remote-config.json "$dir/" 2>/dev/null || true
        cp version.txt "$dir/" 2>/dev/null || true
        echo "Copied config files to $(basename "$dir")"
    fi
done

echo -e "${GREEN}Backend builds completed successfully!${NC}"
echo "Build outputs:"
ls -la "$BUILD_DIR"