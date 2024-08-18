import React from "react";
import { Course } from "../../../types/Course";
import CalendarDaysIcon from "./icons/CalendarDaysIcon";
import { Button } from "./ui/button";
import XIcon from "./icons/XIcon";

interface CalendarProps {
  courses: Course[];
  onRemoveCourse: (crn: string) => void;
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
              <div className="box-border"></div> {/* Empty first row */}
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="box-border flex justify-end items-center"
                >
                  {hour}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Takvim Hücreleri */}
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="flex-1 h-[32rem] grid border-l-2 border-dashed"
          >
            <div className="relative place-self-stretch">
              <div className="absolute left-0 right-0 bottom-0 top-0 grid grid-flow-row grid-rows-[repeat(12,_2fr)]">
                <div className="text-center align-middle">{day}</div>
                {hours.map((_, index) => (
                  <div key={index} className="box-border relative"></div>
                ))}
              </div>
              <div className="events mx-2 absolute left-0 right-0 bottom-0 top-0 grid grid-flow-row grid-rows-[repeat(24,_1fr)]">
                {courses
                  .filter((course) => course.day === day)
                  .map((course) => {
                    const gridRow = calculateGridRow(
                      course.startTime,
                      course.endTime
                    );
                    return (
                      <div
                        key={course.crn}
                        className="overflow-scroll text-xs rounded-xl box-border break-words p-1"
                        style={{
                          gridRow: gridRow,
                          backgroundColor: "#FDC003",
                        }}
                      >
                        {course.code} <br />
                        {course.name} <br />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-[#0372CE] hover:bg-transparent hover:text-[#0372CE] ml-2"
                          onClick={() => onRemoveCourse(course.crn)}
                        >
                          <XIcon className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
