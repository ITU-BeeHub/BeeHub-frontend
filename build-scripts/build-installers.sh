#!/bin/bash

# Master build script for both Windows and macOS installers
# To be run on macOS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${PURPLE}=== BeeHub Complete Installer Build Process ===${NC}"
echo -e "${BLUE}Building both Windows and macOS installers${NC}"
echo ""

# Function to show build menu
show_menu() {
    echo -e "${YELLOW}Select build option:${NC}"
    echo "1. Build Windows x86-64 installer only"
    echo "2. Build macOS ARM64 DMG only"  
    echo "3. Build both installers"
    echo "4. Exit"
    echo ""
}

# Function to build Windows installer
build_windows() {
    echo -e "${BLUE}=== Building Windows Installer ===${NC}"
    "$SCRIPT_DIR/build-windows-installer.sh"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Windows installer completed${NC}"
        return 0
    else
        echo -e "${RED}❌ Windows installer failed${NC}"
        return 1
    fi
}

# Function to build macOS DMG
build_macos() {
    echo -e "${BLUE}=== Building macOS DMG ===${NC}"
    "$SCRIPT_DIR/build-macos-dmg.sh"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ macOS DMG completed${NC}"
        return 0
    else
        echo -e "${RED}❌ macOS DMG failed${NC}"
        return 1
    fi
}

# Make scripts executable
chmod +x "$SCRIPT_DIR/build-windows-installer.sh"
chmod +x "$SCRIPT_DIR/build-macos-dmg.sh"

# Show menu if no arguments provided
if [ $# -eq 0 ]; then
    while true; do
        show_menu
        read -p "Enter your choice (1-4): " choice
        
        case $choice in
            1)
                build_windows
                break
                ;;
            2)
                build_macos
                break
                ;;
            3)
                echo -e "${PURPLE}Building both installers...${NC}"
                echo ""
                
                WIN_SUCCESS=0
                MAC_SUCCESS=0
                
                # Build Windows
                build_windows
                WIN_SUCCESS=$?
                
                echo ""
                
                # Build macOS
                build_macos
                MAC_SUCCESS=$?
                
                echo ""
                echo -e "${PURPLE}=== Build Summary ===${NC}"
                if [ $WIN_SUCCESS -eq 0 ]; then
                    echo -e "${GREEN}✅ Windows installer: SUCCESS${NC}"
                else
                    echo -e "${RED}❌ Windows installer: FAILED${NC}"
                fi
                
                if [ $MAC_SUCCESS -eq 0 ]; then
                    echo -e "${GREEN}✅ macOS DMG: SUCCESS${NC}"
                else
                    echo -e "${RED}❌ macOS DMG: FAILED${NC}"
                fi
                
                if [ $WIN_SUCCESS -eq 0 ] && [ $MAC_SUCCESS -eq 0 ]; then
                    echo -e "${GREEN}🎉 All builds completed successfully!${NC}"
                else
                    echo -e "${YELLOW}⚠️  Some builds failed. Check logs above.${NC}"
                fi
                break
                ;;
            4)
                echo "Exiting..."
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid option. Please try again.${NC}"
                echo ""
                ;;
        esac
    done
else
    # Handle command line arguments
    case "$1" in
        "windows"|"win"|"w")
            build_windows
            ;;
        "macos"|"mac"|"m")
            build_macos
            ;;
        "both"|"all"|"b")
            build_windows
            echo ""
            build_macos
            ;;
        *)
            echo -e "${RED}Usage: $0 [windows|macos|both]${NC}"
            exit 1
            ;;
    esac
fi

echo ""
echo -e "${GREEN}🎯 Build process completed!${NC}"

# Show build outputs
FRONTEND_DIR="$SCRIPT_DIR/../BeeHub-frontend"
if [ -d "$FRONTEND_DIR/dist" ]; then
    echo ""
    echo -e "${BLUE}Build outputs in dist/:${NC}"
    ls -lh "$FRONTEND_DIR/dist" | grep -E "\.(exe|dmg)$" || echo "No installer files found"
fi