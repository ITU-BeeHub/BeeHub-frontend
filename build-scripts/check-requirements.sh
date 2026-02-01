#!/bin/bash

# System requirements checker for BeeHub build process

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}=== BeeHub Build Requirements Checker ===${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to get version
get_version() {
    case $1 in
        "go")
            go version 2>/dev/null | grep -o 'go[0-9.]*' | head -1
            ;;
        "node") 
            node --version 2>/dev/null
            ;;
        "npm")
            npm --version 2>/dev/null
            ;;
        *)
            echo "unknown"
            ;;
    esac
}

# Check Go
echo -e "${BLUE}Checking Go...${NC}"
if command_exists go; then
    VERSION=$(get_version go)
    echo -e "${GREEN}✓ Go found: $VERSION${NC}"
    
    # Check if Go version is >= 1.19
    GO_VERSION=$(go version | grep -o 'go[0-9.]*' | head -1 | cut -d'o' -f2)
    MAJOR=$(echo $GO_VERSION | cut -d'.' -f1)
    MINOR=$(echo $GO_VERSION | cut -d'.' -f2)
    
    if [[ $MAJOR -gt 1 || ($MAJOR -eq 1 && $MINOR -ge 19) ]]; then
        echo -e "${GREEN}✓ Go version is compatible${NC}"
    else
        echo -e "${YELLOW}⚠ Go version might be too old (recommended: >= 1.19)${NC}"
    fi
else
    echo -e "${RED}✗ Go not found${NC}"
    echo -e "${YELLOW}Install Go: https://golang.org/dl/${NC}"
fi

# Check Node.js
echo -e "${BLUE}Checking Node.js...${NC}"
if command_exists node; then
    VERSION=$(get_version node)
    echo -e "${GREEN}✓ Node.js found: $VERSION${NC}"
    
    # Check if Node version is >= 18
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
    
    if [[ $MAJOR -ge 18 ]]; then
        echo -e "${GREEN}✓ Node.js version is compatible${NC}"
    else
        echo -e "${YELLOW}⚠ Node.js version might be too old (recommended: >= 18)${NC}"
    fi
else
    echo -e "${RED}✗ Node.js not found${NC}"
    echo -e "${YELLOW}Install Node.js: https://nodejs.org/${NC}"
fi

# Check NPM
echo -e "${BLUE}Checking NPM...${NC}"
if command_exists npm; then
    VERSION=$(get_version npm)
    echo -e "${GREEN}✓ NPM found: $VERSION${NC}"
else
    echo -e "${RED}✗ NPM not found${NC}"
    echo -e "${YELLOW}NPM usually comes with Node.js${NC}"
fi

# Check additional tools for cross-compilation
echo -e "${BLUE}Checking additional tools...${NC}"

# Wine for Windows builds (optional)
if command_exists wine; then
    echo -e "${GREEN}✓ Wine found (helpful for Windows builds)${NC}"
else
    echo -e "${YELLOW}○ Wine not found (optional for Windows testing)${NC}"
fi

# Check available architectures in Go
echo -e "${BLUE}Checking Go cross-compilation support...${NC}"
if command_exists go; then
    echo -e "${GREEN}Supported GOOS/GOARCH combinations:${NC}"
    go tool dist list | grep -E "(windows|darwin|linux)" | head -10
fi

# Disk space check
echo -e "${BLUE}Checking disk space...${NC}"
AVAILABLE_SPACE=$(df -h . | awk 'NR==2 {print $4}')
echo -e "${GREEN}Available disk space: $AVAILABLE_SPACE${NC}"

# Memory check
echo -e "${BLUE}Checking memory...${NC}"
if command_exists free; then
    MEMORY=$(free -h | grep '^Mem:' | awk '{print $7}')
    echo -e "${GREEN}Available memory: $MEMORY${NC}"
fi

echo -e "${GREEN}=== Requirements Check Complete ===${NC}"
echo ""
echo -e "${YELLOW}Quick start commands:${NC}"
echo -e "Backend only:  ${BLUE}./build-scripts/build-backend.sh${NC}"
echo -e "Frontend only: ${BLUE}./build-scripts/build-frontend.sh${NC}" 
echo -e "Everything:    ${BLUE}./build-scripts/build-all.sh${NC}"