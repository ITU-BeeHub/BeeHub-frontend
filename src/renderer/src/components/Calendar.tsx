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

const Calendar: React.FC<CalendarProps> = ({ courses, onRemoveCourse }) => {
  const formatTime = (time: string): number => {
    const [hour] = time.split(":").map(Number);
    return hour;
  };

  const hours = Array.from({ length: 11 }, (_, i) => `${8 + i}:00`);

  return (
    <div className="mt-2 bg-white rounded-lg shadow h-auto w-full overflow-x-auto p-4">
      <div className="flex flex-col">
        <div className="flex items-center  pb-2 mb-4">
          <CalendarDaysIcon className="h-6 w-6 text-[#6B7280] mr-4" />
          <span className="text-[#212121] font-medium">Weekly Calendar</span>
        </div>
        <div className="grid grid-cols-6 gap-0">
          {/* Saatler */}
          <div className="flex flex-col w-full">
            <div className="h-12 flex justify-center items-center text-sm md:text-base lg:text-lg text-[#6B7280] ">Time</div>
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-12 flex justify-center items-center text-sm md:text-base lg:text-lg text-[#6B7280] "
              >
                {hour}
              </div>
            ))}
          </div>
          {/* Günler ve Dersler */}
          {daysOfWeek.map((day) => (
            <div key={day} className="flex flex-col w-full relative">
              <div className="h-12 flex justify-center items-center text-sm md:text-base lg:text-lg text-[#6B7280] ">
                {day}
              </div>
              {hours.map((_, hourIndex) => (
                <div key={hourIndex} className="h-12 "></div>
              ))}
              {courses
                .filter((course) => course.day === day)
                .map((course) => (
                  <div
                    key={course.crn}
                    className="absolute bg-[#FDC003] text-[#0372CE] font-medium rounded-lg p-2 md:p-4"
                    style={{
                      top: `${(formatTime(course.startTime) - 8) * 48}px`,
                      height: `${(formatTime(course.endTime) - formatTime(course.startTime)) * 48}px`,
                      left: 0,
                      right: 0,
                    }}
                  >
                    <p className="text-sm md:text-base lg:text-lg">{course.code}</p>
                    <div className="flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#0372CE] hover:bg-transparent hover:text-[#0372CE]"
                        onClick={() => onRemoveCourse(course.crn)}
                      >
                        <XIcon className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
