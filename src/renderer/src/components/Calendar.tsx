import React, { useState } from "react";
import CalendarDaysIcon from "./icons/CalendarDaysIcon";
import { Button } from "./ui/button";
import XIcon from "../components/icons/XIcon";
import CourseDetailsModal from "./CourseDetailsModal"; // Modal bileşenini ekle
import { Course, SelectedCourse } from "../../../types/Course";

interface CalendarProps {
  courses: SelectedCourse[];
  onRemoveCourse: (crn: string) => void;
  onSelectParentCourse?: (parentCrn: string) => void;
  selectingParentCourse: boolean;
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
  isReserve: boolean;
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

const Calendar: React.FC<CalendarProps> = ({
  courses,
  onRemoveCourse,
  onSelectParentCourse,
  selectingParentCourse,
}) => {
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

    const startRow = Math.round((startHour - 8) * 2) + 4;
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

  const transformCourseData = (course: Course, isReserve: boolean = false): TransformedCourse[] => {
    const days = course.gunAdiEN.split(" ");
    const times = course.baslangicSaati.split(" ");

    const transformedCourses: TransformedCourse[] = [];

    days.forEach((day: string, index: number) => {
      const timeRange = times[index].split("/");

      const startTime = `${timeRange[0].slice(0, 2)}:${timeRange[0].slice(2)}`;
      const endTime = `${timeRange[1].slice(0, 2)}:${timeRange[1].slice(2)}`;

      transformedCourses.push({
        id: course.crn,
        name: course["dersAdi"],
        code: course["dersKodu"],
        crn: course.crn,
        day: translateDay(day),
        startTime,
        endTime,
        building: course.binaKodu.substring(0, 3),
        room: course.mekanAdi,
        instructor: course.adSoyad,
        capacity: course.kontenjan,
        enrolled: course.rezervasyon,
        isReserve,
      });
    });

    return transformedCourses;
  };

  const transformedCourses = courses.flatMap((selectedCourse) => {
    const mainCourses = transformCourseData(selectedCourse.course);
    const reserveCourses = selectedCourse.reserveCourse
      ? transformCourseData(selectedCourse.reserveCourse, true)
      : [];
    return [...mainCourses, ...reserveCourses];
  });

  return (
    <div className="mt-2 bg-white rounded-lg shadow h-auto w-full overflow-x-auto p-4">
      <div className="flex items-center pb-2 mb-4">
        <CalendarDaysIcon className="h-6 w-6 text-[#6B7280] mr-4" />
        <span className="text-[#212121] font-medium">Weekly Calendar</span>
      </div>
      <div className="flex flex-row">
        <div className="w-16 h-[32rem] grid mr-1">
          <div className="relative place-self-stretch">
            <div className="absolute left-0 right-0 bottom-0 top-0 grid grid-flow-row grid-rows-[repeat(12,_2fr)]">
              <div className="box-border"></div>
              {hours.map((hour) => (
                <div key={hour} className="box-border flex justify-end items-center border-dashed">
                  {hour}
                </div>
              ))}
            </div>
          </div>
        </div>
        {daysOfWeek.map((day) => (
          <div key={day} className="flex-1 h-[32rem] grid  border-gray-300">
            <div className="relative place-self-stretch">
              <div className="absolute left-0 right-0 bottom-0 top-0 grid grid-flow-row grid-rows-[repeat(12,_2fr)]">
                <div className="text-center flex-center align-middle">{day}</div>
                {hours.map((_, index) => (
                  <div key={index} className="box-border relative border-t-2 border-dashed order-gray-300"></div>
                ))}
              </div>
              <div className="events mx-2 absolute left-0 right-0 bottom-0 top-0 grid grid-flow-row border-l-2 border-dashed grid-rows-[repeat(24,_1fr)]">
                {transformedCourses
                  .filter((course) => course.day === day)
                  .map((course) => {
                    const gridRow = calculateGridRow(course.startTime, course.endTime);
                    return (
                      <div
                        key={course.crn}
                        className="text-xs rounded-xl box-border break-words p-1 relative flex flex-col justify-center items-center cursor-pointer"
                        style={{
                          gridRow: gridRow,
                          backgroundColor: course.isReserve ? "#C0C0C0" : "#FDC003",
                        }}
                        onClick={() => {
                          if (selectingParentCourse && !course.isReserve && onSelectParentCourse) {
                            onSelectParentCourse(course.crn);
                          } else {
                            openModal(course);
                          }
                        }}
                      >
                        <div className="absolute top-0 right-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="p-0 m-0 text-[#0372CE] hover:bg-transparent hover:text-[#0372CE] h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
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
      <CourseDetailsModal isOpen={isModalOpen} closeModal={closeModal} course={selectedCourse as any} />
    </div>
  );
};


export default Calendar;
