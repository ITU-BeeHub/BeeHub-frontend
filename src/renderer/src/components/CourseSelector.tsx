import React, { useState, useEffect, useRef } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { Course } from "../../../types/Course";
import axios from "axios";

interface CourseSelectorProps {
  onAddCourse: (course: Course) => void;
}

const CourseSelector: React.FC<CourseSelectorProps> = ({ onAddCourse }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseGroup, setSelectedCourseGroup] = useState<string | null>(null);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(null);
  const [selectedCRN, setSelectedCRN] = useState<string | null>(null);

  // Popover'ların açık/kapalı durumunu yönetmek için state
  const [isGroupPopoverOpen, setIsGroupPopoverOpen] = useState(false);
  const [isCodePopoverOpen, setIsCodePopoverOpen] = useState(false);
  const [isCRNPopoverOpen, setIsCRNPopoverOpen] = useState(false);  

  // Search state for filtering
  const [groupSearchQuery, setGroupSearchQuery] = useState<string>("");
  const [codeSearchQuery, setCodeSearchQuery] = useState<string>("");
  const [crnSearchQuery, setCrnSearchQuery] = useState<string>("");

  const courseCodeRef = useRef<HTMLDivElement>(null);

  // Ref to capture the width of each PopoverTrigger button
  const groupTriggerRef = useRef<HTMLButtonElement>(null);
  const codeTriggerRef = useRef<HTMLButtonElement>(null);
  const crnTriggerRef = useRef<HTMLButtonElement>(null);

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

  // Handle keyboard navigation for dersKodus
  const handleKeyDown = (event: KeyboardEvent) => {
    if (isCodePopoverOpen && courseCodeRef.current) {
      const char = event.key.toUpperCase();
      const courseElement = Array.from(courseCodeRef.current.children).find(
        (child) => (child as HTMLElement).textContent?.trim().startsWith(char)
      );

      if (courseElement) {
        (courseElement as HTMLElement).scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  };

  useEffect(() => {
    if (isCodePopoverOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCodePopoverOpen]);

  // Filtering by Course Group (first 3 characters of dersKodu)
  const filteredCoursesByGroup = courses.filter(
    (course) => course["dersKodu"] && course["dersKodu"].startsWith(selectedCourseGroup || "")
  );

  // Extracting unique Course Groups and applying search query
  const filteredGroups = Array.from(
    new Set(
      courses
        .filter(course => course["dersKodu"])
        .map((course) => course["dersKodu"].substring(0, 3))
    )
  )
  .filter(group => group !== undefined && group.toLowerCase().includes(groupSearchQuery.toLowerCase()))
  .sort();

  // Filtering by specific dersKodu within the selected group and applying search query
  const filteredCoursesByCode = filteredCoursesByGroup
    .filter((course) => course["dersKodu"] + " - " + course["dersAdi"] === selectedCourseCode && course.crn.toLowerCase().includes(crnSearchQuery.toLowerCase()))
    .sort((a, b) => a.crn.localeCompare(b.crn));

  const filteredUniqueCourses = Array.from(
    new Set(filteredCoursesByGroup.map((course) => course["dersKodu"]))
  )
  .map((uniqueCode) => filteredCoursesByGroup.find(course => course["dersKodu"] === uniqueCode))
  .filter(course => course !== undefined && (course?.dersKodu?.toLowerCase() + " - " + course?.dersAdi?.toLowerCase()).includes(codeSearchQuery.toLowerCase())) // Filter by search
  .sort((a, b) => {
    if (a && b) { // Ensure both a and b are not undefined
      if (a["dersKodu"] < b["dersKodu"]) return -1;
      if (a["dersKodu"] > b["dersKodu"]) return 1;
    }
    return 0; // Treat undefined cases as equal
  });

  const handleSelectCourseGroup = (group: string) => {
    setSelectedCourseGroup(group);
    setSelectedCourseCode(null); // Yeni grup seçildiğinde courseCode sıfırlanmalı
    setSelectedCRN(null); // Aynı şekilde CRN de sıfırlanmalı
    setIsGroupPopoverOpen(false); // Group popover'ını kapat
  };

  const handleSelectCourseCode = (code: string) => {
    setSelectedCourseCode(code);
    setSelectedCRN(null); // Yeni code seçildiğinde CRN sıfırlanmalı
    setIsCodePopoverOpen(false); // dersKodu popover'ını kapat
  };

  const handleSelectCRN = (crn: string) => {
    setSelectedCRN(crn);
    setIsCRNPopoverOpen(false); // CRN popover'ını kapat
  };

  const handleAddCourse = () => {
    const selectedCourse = courses.find(
      (course) =>
        course.crn === selectedCRN
    );
    if (selectedCourse) {
      onAddCourse(selectedCourse);
      // Reset selections after adding the course
      setSelectedCourseGroup(null);
      setSelectedCourseCode(null);
      setSelectedCRN(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 flex-wrap">
        {/* Course Group */}
        <Popover open={isGroupPopoverOpen} onOpenChange={setIsGroupPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              ref={groupTriggerRef} // Capture button width
              className="w-full sm:w-[120px] text-left font-normal border-[#0372CE] text-[#212121] overflow-hidden text-ellipsis whitespace-nowrap justify-start px-2"
            >
              {selectedCourseGroup ? selectedCourseGroup : "Course Group"}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 max-h-80 overflow-y-auto"
            style={{ width: groupTriggerRef.current?.offsetWidth || "auto" }} // Dynamically set width
            align="start"
          >
            {/* Search input for Course Group */}
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
                group && (
                  <Button
                    variant="ghost"
                    className="justify-start w-full"
                    key={group}
                    onClick={() => handleSelectCourseGroup(group)}
                  >
                    {group}
                  </Button>
                )
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* dersKodu */}
        <Popover open={isCodePopoverOpen} onOpenChange={setIsCodePopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              ref={codeTriggerRef} // Capture button width
              className="w-full sm:w-[380px] text-left font-normal border-[#0372CE] text-[#212121] overflow-hidden text-ellipsis whitespace-nowrap justify-start px-2"
              disabled={!selectedCourseGroup}
            >
              {selectedCourseCode ? selectedCourseCode : "Select Course"}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            ref={courseCodeRef}
            className="p-0 max-h-80 overflow-y-auto"
            style={{ width: codeTriggerRef.current?.offsetWidth || "auto" }} // Dynamically set width
            align="start"
          >
            {/* Search input for Course */}
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
              {filteredUniqueCourses.map((course) => (
                <Button
                  variant="ghost"
                  className="justify-start w-full"
                  key={course && course["dersKodu"] && course["dersAdi"] ? course["dersKodu"] + course["dersAdi"] : ""}
                  onClick={() => handleSelectCourseCode(course && course["dersKodu"] ? course["dersKodu"] + " - " + course["dersAdi"] : "")}
                >
                  {course && course["dersKodu"] ? `${course["dersKodu"]} - ${course["dersAdi"]}` : ""}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* CRN */}
        <Popover open={isCRNPopoverOpen} onOpenChange={setIsCRNPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              ref={crnTriggerRef} // Capture button width
              className="w-full sm:w-[120px] text-left font-normal border-[#0372CE] text-[#212121] overflow-hidden text-ellipsis whitespace-nowrap justify-start px-2"
              disabled={!selectedCourseCode}
            >
              {selectedCRN ? selectedCRN : "Select CRN"}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 max-h-80 overflow-y-auto"
            style={{ width: crnTriggerRef.current?.offsetWidth || "auto" }} // Dynamically set width
            align="start"
          >
            {/* Search input for CRN */}
            <div className="p-2">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Search CRN"
                value={crnSearchQuery}
                onChange={(e) => setCrnSearchQuery(e.target.value)}
              />
            </div>
            <div className="grid gap-2 p-2">
              {filteredCoursesByCode.map((course) => (
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
          </PopoverContent>
        </Popover>
      </div>

      <Button
        className="bg-[#FDC003] text-[#0372CE] font-bold hover:bg-[#fdc003d9] w-full sm:w-auto"
        onClick={handleAddCourse}
        disabled={!selectedCourseGroup || !selectedCourseCode || !selectedCRN} // Seçimler yapılmadan buton aktif olmaz
      >
        Add
      </Button>
    </div>
  );
};

export default CourseSelector;
