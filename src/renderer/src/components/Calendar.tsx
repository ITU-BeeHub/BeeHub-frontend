import React, { useState } from "react";
import CalendarDaysIcon from "./icons/CalendarDaysIcon";
import { Button } from "./ui/button";
import XIcon from "../components/icons/XIcon";
import CourseDetailsModal from "./CourseDetailsModal"; // Modal bileşenini ekle

interface CalendarProps {
  courses: any[];  // This should be the original `Course` array before transformation
  onRemoveCourse: (crn: string) => void;
}

interface TransformedCourse {
  id: string;
  name: string;
  code: string;
  crn: string;
  day: string;
  startTime: string;
  endTime: string;
  building: string;
  room: string;
  instructor: string;
  capacity: string;
  enrolled: string;
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const hours = [
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const Calendar: React.FC<CalendarProps> = ({ courses, onRemoveCourse }) => {
  console.log("Rendering Calendar");

  const [selectedCourse, setSelectedCourse] = useState<TransformedCourse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (course: TransformedCourse) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const formatTime = (time: string): number => {
    const [hour, minute] = time.split(":").map(Number);
    return hour + minute / 60;
  };

  const calculateGridRow = (startTime: string, endTime: string): string => {
    const startHour = formatTime(startTime);
    const endHour = formatTime(endTime);

    // Calculate the grid row numbers based on time, adjusted to half-hour slots
    const startRow = Math.round((startHour - 8) * 2) + 4; // Start from 2nd row to match the header
    const endRow = Math.round((endHour - 8) * 2) + 4;

    return `${startRow} / ${endRow}`;
  };

  const translateDay = (day: string): string => {
    const dayMap: { [key: string]: string } = {
      "Pazartesi": "Monday",
      "Salı": "Tuesday",
      "Çarşamba": "Wednesday",
      "Perşembe": "Thursday",
      "Cuma": "Friday",
    };
    return dayMap[day] || day;
  };

  const transformCourseData = (course: any): TransformedCourse[] => {
    const days = course.Day.split(" "); // Split "Pazartesi Perşembe" into ["Pazartesi", "Perşembe"]
    const times = course.Time.split(" "); // Split "0900/1129 0900/1129" into ["0900/1129", "0900/1129"]

    const transformedCourses: TransformedCourse[] = [];

    days.forEach((day: string, index: number) => {
      const timeRange = times[index].split("/"); // Split "0900/1129" into ["0900", "1129"]

      const startTime = `${timeRange[0].slice(0, 2)}:${timeRange[0].slice(2)}`; // "0900" -> "09:00"
      const endTime = `${timeRange[1].slice(0, 2)}:${timeRange[1].slice(2)}`; // "1129" -> "11:29"

      transformedCourses.push({
        id: course.CRN, // Use CRN as the ID
        name: course["Course Title"], // Use Course Title as the name
        code: course["Course Code"], // Use Course Code as the code
        crn: course.CRN, // Use CRN as is
        day: translateDay(day), // Translate day from Turkish to English
        startTime,
        endTime,
        building: course.Building,
        room: course.Room,
        instructor: course.Instructor,
        capacity: course.Capacity,
        enrolled: course.Enrolled,
      });
    });

    return transformedCourses;
  };

  const transformedCourses = courses.flatMap(transformCourseData);

  return (
    <div className="mt-2 bg-white rounded-lg shadow h-auto w-full overflow-x-auto p-4">
      <div className="flex items-center pb-2 mb-4">
        <CalendarDaysIcon className="h-6 w-6 text-[#6B7280] mr-4" />
        <span className="text-[#212121] font-medium">Weekly Calendar</span>
      </div>
      <div className="flex flex-row">
        {/* Saat Sütunu */}
        <div className="w-16 h-[32rem] grid mr-1">
          <div className="relative place-self-stretch">
            <div className="absolute left-0 right-0 bottom-0 top-0 grid grid-flow-row grid-rows-[repeat(12,_2fr)]">
              <div className="box-border "></div> {/* Empty first row */}
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="box-border flex justify-end items-center border-dashed"
                >
                  {hour}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Takvim Hücreleri */}
        {daysOfWeek.map((day) => (
          <div key={day} className="flex-1 h-[32rem] grid  border-gray-300">
            <div className="relative place-self-stretch">
              <div className="absolute left-0 right-0 bottom-0 top-0 grid grid-flow-row grid-rows-[repeat(12,_2fr)]">
                <div className="text-center flex-center align-middle">{day}</div>
                {hours.map((_, index) => (
                  <div
                    key={index}
                    className="box-border relative border-t-2  border-dashed order-gray-300"
                  ></div>
                ))}
              </div>
              <div className="events mx-2 absolute left-0 right-0 bottom-0 top-0 grid grid-flow-row border-l-2 border-dashed grid-rows-[repeat(24,_1fr)]">
                {transformedCourses
                  .filter((course) => course.day === day)
                  .map((course) => {
                    const gridRow = calculateGridRow(
                      course.startTime,
                      course.endTime
                    );
                    return (
                      <div
                        key={course.crn}
                        className="text-xs rounded-xl box-border break-words p-1 relative flex flex-col justify-center items-center cursor-pointer"
                        style={{
                          gridRow: gridRow,
                          backgroundColor: "#FDC003",
                        }}
                        onClick={() => openModal(course)} // Kursa tıklandığında modalı aç
                      >
                        <div className="absolute top-0 right-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="p-0 m-0 text-[#0372CE] hover:bg-transparent hover:text-[#0372CE] h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation(); // Modalı tetiklemeden kursu sil
                              onRemoveCourse(course.crn);
                            }}
                          >
                            <XIcon className="h-2.5 w-2.5" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                        <div className="text-center text-sm ">
                          {course.code} <br />
                          {course.name}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ))}
      </div>
      <CourseDetailsModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        course={selectedCourse as any} // Type assertion here
      />
    </div>
  );
};

export default Calendar;
