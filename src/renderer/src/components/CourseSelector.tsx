import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";

import { Course } from "../../../types/Course";

interface CourseSelectorProps {
  onAddCourse: (course: Course) => void;
}

const availableCourses: Course[] = [
  {
    id: 1,
    name: "Introduction to Computer Science",
    code: "CS101",
    crn: "12345",
    day: "Monday",
    startTime: "9:00 AM",
    endTime: "11:00 AM",
  },
  {
    id: 2,
    name: "Calculus I",
    code: "MATH201",
    crn: "67890",
    day: "Wednesday",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
  },
  {
    id: 3,
    name: "General Physics I",
    code: "PHYS150",
    crn: "54321",
    day: "Friday",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
  },
  // Diğer dersler...
];

const CourseSelector: React.FC<CourseSelectorProps> = ({ onAddCourse }) => {
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(
    null
  );
  const [selectedCourseName, setSelectedCourseName] = useState<string | null>(
    null
  );
  const [selectedCRN, setSelectedCRN] = useState<string | null>(null);

  // Popover'ların açık/kapalı durumunu yönetmek için state
  const [isCodePopoverOpen, setIsCodePopoverOpen] = useState(false);
  const [isNamePopoverOpen, setIsNamePopoverOpen] = useState(false);
  const [isCRNPopoverOpen, setIsCRNPopoverOpen] = useState(false);

  // Seçilen courseCode'a göre courseName'leri filtrele
  const filteredCoursesByCode = availableCourses.filter(
    (course) => course.code === selectedCourseCode
  );

  // Seçilen courseName'e göre CRN'leri filtrele
  const filteredCoursesByName = filteredCoursesByCode.filter(
    (course) => course.name === selectedCourseName
  );

  const handleSelectCourseCode = (code: string) => {
    setSelectedCourseCode(code);
    setSelectedCourseName(null); // Yeni code seçildiğinde courseName sıfırlanmalı
    setSelectedCRN(null); // Aynı şekilde CRN de sıfırlanmalı
    setIsCodePopoverOpen(false); // Course Code popover'ını kapat
  };

  const handleSelectCourseName = (name: string) => {
    setSelectedCourseName(name);
    setSelectedCRN(null); // Yeni courseName seçildiğinde CRN sıfırlanmalı
    setIsNamePopoverOpen(false); // Course Name popover'ını kapat
  };

  const handleSelectCRN = (crn: string) => {
    setSelectedCRN(crn);
    setIsCRNPopoverOpen(false); // CRN popover'ını kapat
  };

  const handleAddCourse = () => {
    const selectedCourse = availableCourses.find(
      (course) =>
        course.code === selectedCourseCode &&
        course.name === selectedCourseName &&
        course.crn === selectedCRN
    );
    if (selectedCourse) {
      onAddCourse(selectedCourse);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 flex-wrap">
        {/* Course Code */}
        <Popover open={isCodePopoverOpen} onOpenChange={setIsCodePopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-[120px] text-left font-normal border-[#0372CE] text-[#212121] overflow-hidden text-ellipsis whitespace-nowrap justify-start px-2"
            >
              {selectedCourseCode ? selectedCourseCode : "Course Code"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="grid gap-2 p-2">
              {Array.from(
                new Set(availableCourses.map((course) => course.code))
              ).map((code) => (
                <Button
                  variant="ghost"
                  className="justify-start w-full"
                  key={code}
                  onClick={() => handleSelectCourseCode(code)}
                >
                  {code}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Course Name */}
        <Popover open={isNamePopoverOpen} onOpenChange={setIsNamePopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-[380px] text-left font-normal border-[#0372CE] text-[#212121] overflow-hidden text-ellipsis whitespace-nowrap justify-start px-2"
            >
              {selectedCourseName ? selectedCourseName : "Select Course Name"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="grid gap-2 p-2">
              {filteredCoursesByCode.map((course) => (
                <Button
                  variant="ghost"
                  className="justify-start w-full"
                  key={course.name}
                  onClick={() => handleSelectCourseName(course.name)}
                >
                  {course.name}
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
              className="w-full sm:w-[120px] text-left font-normal border-[#0372CE] text-[#212121] overflow-hidden text-ellipsis whitespace-nowrap justify-start px-2"
              disabled={!selectedCourseName}
            >
              {selectedCRN ? selectedCRN : "Select CRN"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="grid gap-2 p-2">
              {filteredCoursesByName.map((course) => (
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
        disabled={!selectedCourseCode || !selectedCourseName || !selectedCRN} // Seçimler yapılmadan buton aktif olmaz
      >
        Add
      </Button>
    </div>
  );
};

export default CourseSelector;
