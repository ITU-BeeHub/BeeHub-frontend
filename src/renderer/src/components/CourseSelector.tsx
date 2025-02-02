import React, { useState, useEffect, useRef, useMemo } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { Course } from "../../../types/Course";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { useVirtualizer } from "@tanstack/react-virtual";

interface CourseSelectorProps {
  onAddCourse: (course: Course) => void;
  onAddCourseAsReserve: (course: Course) => void;
}

const CourseSelector: React.FC<CourseSelectorProps> = ({
  onAddCourse,
  onAddCourseAsReserve,
}) => {
  // ---------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDirectCRNMode, setIsDirectCRNMode] = useState(false);

  // Normal mode selections
  const [selectedCourseGroup, setSelectedCourseGroup] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Both modes rely on "selectedCRN" to add the final course
  const [selectedCRN, setSelectedCRN] = useState<string | null>(null);

  // Popover states
  const [isGroupPopoverOpen, setIsGroupPopoverOpen] = useState(false);
  const [isCodePopoverOpen, setIsCodePopoverOpen] = useState(false);
  const [isCRNPopoverOpen, setIsCRNPopoverOpen] = useState(false);

  // Search states
  const [groupSearchQuery, setGroupSearchQuery] = useState("");
  const [codeSearchQuery, setCodeSearchQuery] = useState("");
  const [crnSearchQuery, setCrnSearchQuery] = useState("");

  // Searching indicator
  const [isSearching, setIsSearching] = useState(false);

  // Refs for measuring popover width
  const groupTriggerRef = useRef<HTMLButtonElement>(null);
  const codeTriggerRef = useRef<HTMLButtonElement>(null);
  const crnTriggerRef = useRef<HTMLButtonElement>(null);

  // For “course code” popover keyboard navigation
  const courseCodeRef = useRef<HTMLDivElement>(null);

  // For virtualization of direct-CRN list
  const scrollParentRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------
  useEffect(() => {
    axios
      .get("http://localhost:8080/beePicker/courses")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCourses(response.data);
        } else {
          console.error("Unexpected data format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  // ---------------------------------------------------------------------
  // Keyboard navigation for course-code popover
  // ---------------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isCodePopoverOpen && courseCodeRef.current) {
        const char = event.key.toUpperCase();
        const courseElement = Array.from(courseCodeRef.current.children).find(
          (child) => (child as HTMLElement).textContent?.trim().startsWith(char)
        );
        if (courseElement) {
          (courseElement as HTMLElement).scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    };

    if (isCodePopoverOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCodePopoverOpen]);

  // ---------------------------------------------------------------------
  // Toggle modes
  // ---------------------------------------------------------------------
  const toggleMode = () => {
    setIsDirectCRNMode((prev) => !prev);
    // reset everything when toggling
    resetSelections();
  };

  const resetSelections = () => {
    setSelectedCourseGroup(null);
    setSelectedCourse(null);
    setSelectedCRN(null);
    setCrnSearchQuery("");
    setGroupSearchQuery("");
    setCodeSearchQuery("");
  };

  // ---------------------------------------------------------------------
  // Normal Mode: GROUP logic
  // ---------------------------------------------------------------------
  const allGroups = useMemo(() => {
    return Array.from(
      new Set(
        courses
          .filter((course) => !!course.dersKodu)
          .map((course) => course.dersKodu.substring(0, 3))
      )
    );
  }, [courses]);

  const filteredGroups = useMemo(() => {
    return allGroups
      .filter((group) =>
        group.toLowerCase().includes(groupSearchQuery.toLowerCase())
      )
      .sort();
  }, [allGroups, groupSearchQuery]);

  const handleSelectGroup = (group: string) => {
    setSelectedCourseGroup(group);
    setSelectedCourse(null);
    setSelectedCRN(null);
    setCrnSearchQuery("");
    setIsGroupPopoverOpen(false);
  };

  // ---------------------------------------------------------------------
  // Normal Mode: COURSE logic
  // ---------------------------------------------------------------------
  const filteredCoursesByGroup = useMemo(() => {
    if (!selectedCourseGroup) return [];
    return courses.filter((course) =>
      course.dersKodu.startsWith(selectedCourseGroup)
    );
  }, [courses, selectedCourseGroup]);

  const uniqueCoursesInGroup = useMemo(() => {
    // create unique (dersKodu+dersAdi)
    const map = new Map<string, Course>();
    for (const c of filteredCoursesByGroup) {
      const key = c.dersKodu + "_" + c.dersAdi;
      if (!map.has(key)) {
        map.set(key, c);
      }
    }
    return Array.from(map.values());
  }, [filteredCoursesByGroup]);

  const filteredCourseOptions = useMemo(() => {
    return uniqueCoursesInGroup.filter((course) => {
      const full = (course.dersKodu + " - " + course.dersAdi).toLowerCase();
      return full.includes(codeSearchQuery.toLowerCase());
    });
  }, [uniqueCoursesInGroup, codeSearchQuery]);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setSelectedCRN(null);
    setCrnSearchQuery("");
    setIsCodePopoverOpen(false);
  };

  // ---------------------------------------------------------------------
  // Direct CRN Mode: Filter logic
  // ---------------------------------------------------------------------
  // For direct CRN entry, we search in all courses by CRN, code, or name
  const directFilteredCRNs = useMemo(() => {
    if (!crnSearchQuery.trim()) {
      return [];
    }
    const query = crnSearchQuery.toLowerCase().trim();
    return courses
      .filter((course) => {
        const matchesCRN = course.crn.toLowerCase().includes(query);
        const matchesCode = course.dersKodu.toLowerCase().includes(query);
        const matchesName = course.dersAdi.toLowerCase().includes(query);
        return matchesCRN || matchesCode || matchesName;
      })
      .slice(0, 200); // limit if needed
  }, [courses, crnSearchQuery]);

  // ---------------------------------------------------------------------
  // Normal Mode: CRN logic
  // ---------------------------------------------------------------------
  // Show all CRNs belonging to the selected course (or filter by crnSearchQuery)
  const normalFilteredCRNs = useMemo(() => {
    if (!selectedCourse) return [];
    const allCrnsForCourse = courses.filter(
      (c) =>
        c.dersKodu === selectedCourse.dersKodu &&
        c.dersAdi === selectedCourse.dersAdi
    );
    if (!crnSearchQuery.trim()) {
      return allCrnsForCourse;
    }
    const lower = crnSearchQuery.toLowerCase();
    return allCrnsForCourse.filter((c) => c.crn.toLowerCase().includes(lower));
  }, [courses, selectedCourse, crnSearchQuery]);

  // ---------------------------------------------------------------------
  // Searching indicator (debounce)
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (!crnSearchQuery) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => setIsSearching(false), 300);
    return () => clearTimeout(timer);
  }, [crnSearchQuery]);

  // ---------------------------------------------------------------------
  // CRN: Virtualization for Direct mode
  // ---------------------------------------------------------------------
  const crnList = isDirectCRNMode ? directFilteredCRNs : normalFilteredCRNs;
  const rowVirtualizer = useVirtualizer({
    count: crnList.length,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  // ---------------------------------------------------------------------
  // Select CRN
  // ---------------------------------------------------------------------
  const handleSelectCRN = (crn: string) => {
    const found = courses.find((c) => c.crn === crn);
    if (!found) return;

    // In direct mode, also update group & course from found item
    if (isDirectCRNMode) {
      setSelectedCourseGroup(found.dersKodu.substring(0, 3));
      setSelectedCourse(found);
    }
    setSelectedCRN(crn);
    setIsCRNPopoverOpen(false);
  };

  // ---------------------------------------------------------------------
  // Add/Reserve
  // ---------------------------------------------------------------------
  const handleAddCourse = () => {
    if (!selectedCRN) return;
    const found = courses.find((c) => c.crn === selectedCRN);
    if (found) {
      onAddCourse(found);
      resetSelections();
    }
  };

  const handleAddCourseAsReserve = () => {
    if (!selectedCRN) return;
    const found = courses.find((c) => c.crn === selectedCRN);
    if (found) {
      onAddCourseAsReserve(found);
      resetSelections();
    }
  };

  // ---------------------------------------------------------------------
  // Popover content for CRN (split into two different UIs)
  // ---------------------------------------------------------------------
  const renderNormalModeCRNContent = () => (
    <PopoverContent
      className="p-0 max-h-80 overflow-y-auto"
      style={{ width: crnTriggerRef.current?.offsetWidth || "auto" }}
      align="start"
    >
      {/* Optional filter input for CRNs */}
      <div className="p-2 border-b">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Search CRN"
          value={crnSearchQuery}
          onChange={(e) => setCrnSearchQuery(e.target.value)}
        />
      </div>

      {/* List all matching CRNs */}
      {normalFilteredCRNs.length > 0 ? (
        <div className="grid gap-2 p-2">
          {normalFilteredCRNs.map((course) => (
            <Button
              variant="ghost"
              className="justify-start w-full"
              key={course.crn}
              onClick={() => handleSelectCRN(course.crn)}
            >
              {course.crn}
            </Button>
          ))}
        </div>
      ) : (
        <div className="p-2 text-sm text-center text-gray-500">
          {isSearching
            ? "Searching..."
            : selectedCourse
              ? "No CRNs available for this course"
              : "Select a course first"}
        </div>
      )}
    </PopoverContent>
  );

  const renderDirectModeCRNContent = () => (
    <PopoverContent
      className="p-0 overflow-hidden"
      style={{
        width: Math.max(crnTriggerRef.current?.offsetWidth || 0, 400), // Changed from 300 to 400
      }}
      align="start"
    >
      {/* Direct CRN search */}
      <div className="p-2 border-b">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Search by CRN, Code, or Name"
          value={crnSearchQuery}
          onChange={(e) => setCrnSearchQuery(e.target.value)}
        />
      </div>

      <div
        ref={scrollParentRef}
        className="max-h-[300px] overflow-auto"
        style={{
          height: Math.min(crnList.length * 40, 300),
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const course = crnList[virtualRow.index];
            return (
              <div
                key={virtualRow.index}
                className="absolute top-0 left-0 w-full"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <Button
                  variant="ghost"
                  className="w-full h-full px-4 py-2 flex items-center 
                             justify-between hover:bg-gray-100 group"
                  onClick={() => handleSelectCRN(course.crn)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium min-w-[60px]">
                      {course.crn}
                    </span>
                    <span className="text-sm text-blue-600">
                      {course.dersKodu}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 truncate flex-1 text-right">
                    {course.dersAdi}
                  </span>
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {!isSearching && crnList.length === 0 && (
        <div className="p-4 text-center text-sm text-gray-500">
          {crnSearchQuery
            ? "No match found"
            : "Type to search by CRN, code or name"}
        </div>
      )}
      {isSearching && (
        <div className="p-2 text-center text-sm text-gray-500">
          Searching...
        </div>
      )}
    </PopoverContent>
  );

  // ---------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
      {/* Left Part: Mode Toggle + Normal Group & Course (if not direct CRN mode) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 flex-wrap">
        {/* Toggle Button */}
        <Button
          variant="outline"
          onClick={toggleMode}
          className={`w-full sm:w-auto text-center font-normal 
            ${isDirectCRNMode ? "bg-[#FDC003] text-[#0372CE]" : ""}`}
        >
          {isDirectCRNMode ? "Direct CRN Mode" : "Normal Selection Mode"}
        </Button>

        {/* Group Selector (hidden in direct mode) */}
        {!isDirectCRNMode && (
          <Popover open={isGroupPopoverOpen} onOpenChange={setIsGroupPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                ref={groupTriggerRef}
                className="w-full sm:w-[120px] text-left font-normal border-[#0372CE] 
                           text-[#212121] overflow-hidden text-ellipsis 
                           whitespace-nowrap justify-start px-2"
              >
                {selectedCourseGroup ?? "Course Group"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 max-h-80 overflow-y-auto"
              style={{ width: groupTriggerRef.current?.offsetWidth || "auto" }}
              align="start"
            >
              <div className="p-2">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Search Course Group"
                  value={groupSearchQuery}
                  onChange={(e) => setGroupSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid gap-2 p-2">
                {filteredGroups.map((group) => (
                  <Button
                    variant="ghost"
                    className="justify-start w-full"
                    key={group}
                    onClick={() => handleSelectGroup(group)}
                  >
                    {group}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Course Selector (hidden in direct mode) */}
        {!isDirectCRNMode && (
          <Popover open={isCodePopoverOpen} onOpenChange={setIsCodePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                ref={codeTriggerRef}
                className="w-full sm:w-[380px] text-left font-normal border-[#0372CE]
                           text-[#212121] overflow-hidden text-ellipsis 
                           whitespace-nowrap justify-start px-2"
                disabled={!selectedCourseGroup}
              >
                {selectedCourse
                  ? `${selectedCourse.dersKodu} - ${selectedCourse.dersAdi}`
                  : "Select Course"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              ref={courseCodeRef}
              className="p-0 max-h-80 overflow-y-auto"
              style={{ width: codeTriggerRef.current?.offsetWidth || "auto" }}
              align="start"
            >
              <div className="p-2">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Search Course"
                  value={codeSearchQuery}
                  onChange={(e) => setCodeSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid gap-2 p-2">
                {filteredCourseOptions.map((course) => (
                  <Button
                    variant="ghost"
                    className="justify-start w-full"
                    key={`${course.dersKodu}__${course.dersAdi}`}
                    onClick={() => handleSelectCourse(course)}
                  >
                    {course.dersKodu} - {course.dersAdi}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* CRN Selector (both modes, but content differs) */}
        <Popover open={isCRNPopoverOpen} onOpenChange={setIsCRNPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              ref={crnTriggerRef}
              className={`w-full text-left font-normal border-[#0372CE]
                overflow-hidden text-ellipsis whitespace-nowrap justify-start px-2 
                transition-all duration-200
                ${isDirectCRNMode ? "sm:w-[200px]" : "sm:w-[120px]"}
                ${selectedCRN ? "text-[#0372CE] font-semibold" : "text-[#212121]"}`}
              disabled={!isDirectCRNMode && !selectedCourse}
            >
              {selectedCRN
                ? selectedCRN
                : isDirectCRNMode
                  ? "Enter CRN"
                  : "Select CRN"}
            </Button>
          </PopoverTrigger>
          {/* Conditionally render separate popover content for each mode */}
          {isDirectCRNMode
            ? renderDirectModeCRNContent()
            : renderNormalModeCRNContent()}
        </Popover>
      </div>

      {/* Right Part: Add + Reserve */}
      <div className="flex items-center">
        <Button
          className="bg-[#FDC003] text-[#0372CE] font-bold hover:bg-[#fdc003d9] 
                     rounded-r-none px-4"
          disabled={!selectedCRN}
          onClick={handleAddCourse}
          style={{ flex: "0 0 auto" }}
        >
          Add
        </Button>
        <div className="h-full w-px bg-gray-300"></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="bg-[#FDC003] text-[#0372CE] font-bold hover:bg-[#fdc003d9] 
                         rounded-l-none border-l-0 px-2"
              disabled={!selectedCRN}
              style={{ flex: "0 0 auto" }}
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.586l3.71-4.354a.75.75 0 011.08 1.04l-4.25 5A.75.75 0 0110 13a.75.75 0 01-.54-.22l-4.25-5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="whitespace-nowrap" style={{ width: "auto" }}>
            <DropdownMenuItem
              className="whitespace-nowrap"
              style={{ width: "auto" }}
              onClick={handleAddCourseAsReserve}
            >
              Add as Reserve
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CourseSelector;
