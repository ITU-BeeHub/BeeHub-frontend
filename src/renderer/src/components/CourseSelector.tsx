import React, { useState, useEffect, useRef } from "react";
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
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader } from "./ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

interface CourseSelectorProps {
  onAddCourse: (course: Course) => void;
  onAddCourseAsReserve: (course: Course) => void;
  existingCourses?: Course[]; // Add this prop
}

interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

const CourseSelector: React.FC<CourseSelectorProps> = ({
  onAddCourse,
  onAddCourseAsReserve,
  existingCourses = [], // Provide default empty array
}) => {

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

  const [isManualDialogOpen, setIsManualDialogOpen] = useState(false);
  const [manualCourse, setManualCourse] = useState<Course>({
    crn: "",
    dersKodu: "",
    dersAdi: "",
    adSoyad: "",
    akademikDonemKodu: "",
    baslangicSaati: "08:30",
    binaKodu: "",
    bitisSaati: "09:30",
    dersBransKoduId: "",
    dersTanimiId: "",
    dilKodu: "",
    gunAdiEN: "Monday",
    gunAdiTR: "Pazartesi",
    kontenjan: "",
    mekanAdi: "",
    ogrenciSayisi: "",
    ogretimYontemi: "",
    onSart: "",
    programSeviyeTipi: "",
    programSeviyeTipiId: "",
    rezervasyon: "",
    sinifOnsart: "",
    sinifProgram: "",
    webdeGoster: "",
    parentCRN: ""
  });
  const [manualSchedule, setManualSchedule] = useState([
    { day: "Monday", startTime: "08:30", endTime: "09:30" }
  ]);

  const days = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
  ];

  const times = [
    "08:30", "09:30", "10:30", "11:30", "12:30",
    "13:30", "14:30", "15:30", "16:30", "17:30"
  ];

  const addScheduleRow = () => {
    setManualSchedule([...manualSchedule, { day: "Monday", startTime: "08:30", endTime: "09:30" }]);
  };

  const removeScheduleRow = (index: number) => {
    setManualSchedule(manualSchedule.filter((_, i) => i !== index));
  };

  const updateSchedule = (index: number, field: string, value: string) => {
    const newSchedule = [...manualSchedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setManualSchedule(newSchedule);
  };

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

  const handleAddCourseAsReserve = () => {
    const selectedCourse = courses.find(
      (course) => course.crn === selectedCRN
    );
    if (selectedCourse) {
      onAddCourseAsReserve(selectedCourse);
      // Reset selections after adding the reserve course
      setSelectedCourseGroup(null);
      setSelectedCourseCode(null);
      setSelectedCRN(null);
    }
  };

  const handleManualSubmit = () => {
    const course: Course = {
      ...manualCourse,
      baslangicSaati: manualSchedule[0].startTime,
      bitisSaati: manualSchedule[0].endTime,
      gunAdiEN: manualSchedule[0].day,
      gunAdiTR: manualSchedule[0].day === "Monday" ? "Pazartesi" :
                manualSchedule[0].day === "Tuesday" ? "Salı" :
                manualSchedule[0].day === "Wednesday" ? "Çarşamba" :
                manualSchedule[0].day === "Thursday" ? "Perşembe" : "Cuma",
    };

    onAddCourse(course);
    setIsManualDialogOpen(false);
    setManualCourse({
      crn: "",
      dersKodu: "",
      dersAdi: "",
      adSoyad: "",
      akademikDonemKodu: "",
      baslangicSaati: "08:30",
      binaKodu: "",
      bitisSaati: "09:30",
      dersBransKoduId: "",
      dersTanimiId: "",
      dilKodu: "",
      gunAdiEN: "Monday",
      gunAdiTR: "Pazartesi",
      kontenjan: "",
      mekanAdi: "",
      ogrenciSayisi: "",
      ogretimYontemi: "",
      onSart: "",
      programSeviyeTipi: "",
      programSeviyeTipiId: "",
      rezervasyon: "",
      sinifOnsart: "",
      sinifProgram: "",
      webdeGoster: "",
      parentCRN: ""
    });
    setManualSchedule([{ day: "Monday", startTime: "08:30", endTime: "09:30" }]);
  };

  const updateManualCourse = (field: keyof Course, value: string) => {
    setManualCourse(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
      {/* Existing course selector UI */}
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

      <div className="flex items-center gap-4">
        {/* Existing Add/Reserve buttons */}
        <div className="flex items-center">
          {/* Left part of the button */}
          <Button
            className="bg-[#FDC003] text-[#0372CE] font-bold hover:bg-[#fdc003d9] rounded-r-none px-4"
            disabled={!selectedCourseGroup || !selectedCourseCode || !selectedCRN}
            onClick={handleAddCourse}
            style={{ flex: "0 0 auto" }} // Prevent stretching
          >
            Add
          </Button>
          {/* Separator line */}
          <div className="h-full w-px bg-gray-300"></div>
          {/* Right part with dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="bg-[#FDC003] text-[#0372CE] font-bold hover:bg-[#fdc003d9] rounded-l-none border-l-0 px-2"
                disabled={!selectedCourseGroup || !selectedCourseCode || !selectedCRN}
                style={{ flex: "0 0 auto" }} // Prevent stretching
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {/* SVG path */}
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.586l3.71-4.354a.75.75 0 011.08 1.04l-4.25 5A.75.75 0 0110 13a.75.75 0 01-.54-.22l-4.25-5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="whitespace-nowrap" style={{ width: "auto" }}>
              <DropdownMenuItem className="whitespace-nowrap" style={{ width: "auto" }} onClick={handleAddCourseAsReserve}>
                Add as Reserve
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Manual Entry Dialog */}
        <Dialog open={isManualDialogOpen} onOpenChange={setIsManualDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              Or Enter Manually
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Manual Course Entry</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="crn">CRN</Label>
                  <Input
                    id="crn"
                    value={manualCourse.crn}
                    onChange={(e) => updateManualCourse("crn", e.target.value)}
                    placeholder="Enter CRN"
                  />
                </div>
                <div>
                  <Label htmlFor="parentCRN">Parent CRN (Optional)</Label>
                  <Select
                    value={manualCourse.parentCRN}
                    onValueChange={(value: string) => updateManualCourse("parentCRN", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      {existingCourses.map((course) => (
                        <SelectItem key={course.crn} value={course.crn}>
                          {course.crn} - {course.dersKodu}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="courseCode">Course Code</Label>
                  <Input
                    id="courseCode"
                    value={manualCourse.dersKodu}
                    onChange={(e) => updateManualCourse("dersKodu", e.target.value)}
                    placeholder="e.g., BLG101E"
                  />
                </div>
                <div>
                  <Label htmlFor="courseName">Course Name</Label>
                  <Input
                    id="courseName"
                    value={manualCourse.dersAdi}
                    onChange={(e) => updateManualCourse("dersAdi", e.target.value)}
                    placeholder="Enter course name"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  value={manualCourse.adSoyad}
                  onChange={(e) => updateManualCourse("adSoyad", e.target.value)}
                  placeholder="Enter instructor name"
                />
              </div>

              {/* Schedule Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Schedule</Label>
                  <Button type="button" onClick={addScheduleRow} variant="outline" size="sm">
                    Add Time Slot
                  </Button>
                </div>
                
                {manualSchedule.map((slot, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div>
                      <Label>Day</Label>
                      <Select
                        value={slot.day}
                        onValueChange={(value: string) => updateSchedule(index, 'day', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {days.map(day => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Start Time</Label>
                        <Select
                        value={slot.startTime}
                        onValueChange={(value: string) => updateSchedule(index, 'startTime', value)}
                        >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {times.map((time: string) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                          ))}
                        </SelectContent>
                        </Select>
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <Select
                        value={slot.endTime}
                        onValueChange={(value: string) => updateSchedule(index, 'endTime', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {times.map(time => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {manualSchedule.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeScheduleRow(index)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleManualSubmit}
                disabled={!manualCourse.crn || !manualCourse.dersKodu || !manualCourse.dersAdi}
                className="bg-[#FDC003] text-[#0372CE] font-bold hover:bg-[#fdc003d9]"
              >
                Add Course
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CourseSelector;