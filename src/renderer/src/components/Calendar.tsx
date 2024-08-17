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
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

const Calendar: React.FC<CalendarProps> = ({ courses, onRemoveCourse }) => {
  const formatTime = (time: string): number => {
    const [hour, period] = time.split(" ");
    let [hours, minutes] = hour.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours;
  };

  const calculateGridRow = (startTime: string, endTime: string) => {
    const startHour = formatTime(startTime);
    const endHour = formatTime(endTime);
    const startGridRow = (startHour - 8) * 2 + 2; // Her saat dilimi için 2 satır ayır
    const rowSpan = (endHour - startHour) * 2; // Her saat dilimi için 2 satır span ver

    return `${startGridRow} / span ${rowSpan}`;
  };

  return (
    <div className="mt-2 bg-white rounded-lg shadow h-auto max-w-full overflow-x-auto">
      <div className="grid grid-cols-[1fr_auto] items-center border-b p-2">
        <div className="flex items-center gap-4">
          <CalendarDaysIcon className="h-6 w-6 text-[#6B7280]" />
          <span className="text-[#212121] font-medium">Weekly Calendar</span>
        </div>
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-0 p-4">
        <div className="flex flex-col gap-0">
          {hours.map((hour) => (
            <span
              key={hour}
              className="text-[#6B7280] font-medium text-sm md:text-base lg:text-lg whitespace-nowrap"
            >
              {hour}
            </span>
          ))}
        </div>
        <div className="overflow-x-auto">
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(5, 1fr)", // 5 gün kolonu
              gridTemplateRows: "auto repeat(12, 1fr)", // Gün başlıkları için auto, saatler için 12 satır
              gap: "0", // Hücreler arasındaki boşlukları kaldır
            }}
          >
            <div style={{ gridColumn: "span 5" }}></div> {/* İlk boş hücre */}
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="text-[#6B7280] font-medium text-sm md:text-base lg:text-lg text-center"
                style={{ gridColumn: "span 1", gridRow: "1" }}
              >
                {day}
              </div>
            ))}
            {hours.map((hour, index) => (
              <React.Fragment key={hour}>
                <div className="text-[#6B7280] font-medium text-sm md:text-base lg:text-lg whitespace-nowrap">
                  {hour}
                </div>
                {daysOfWeek.map((day) => (
                  <div
                    key={`${day}-${index}`}
                    className="" // Hücre sınırları gizlendi
                  ></div>
                ))}
              </React.Fragment>
            ))}
            {courses.map((course) => (
              <div
                key={course.crn}
                className="bg-[#FDC003] text-[#0372CE] font-medium rounded-lg p-2 md:p-4"
                style={{
                  gridColumn: `${daysOfWeek.indexOf(course.day) + 1}`, // Günlere göre sütun
                  gridRow: calculateGridRow(course.startTime, course.endTime), // Saatlere göre satır
                }}
              >
                <p className="text-sm md:text-base p-2 lg:text-lg">{`${course.code}`}</p>
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
        </div>
      </div>
    </div>
  );
};

export default Calendar;
