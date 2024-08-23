import React from "react";
import { Button } from "../components/ui/button";
import XIcon from "../components/icons/XIcon";
import { Course } from "../../../types/Course";

interface CourseListProps {
  courses: Course[];
  onRemoveCourse: (crn: string) => void; // CRN'e göre kaldırmak için crn tipi string olarak ayarlandı
}

const CourseList: React.FC<CourseListProps> = ({ courses, onRemoveCourse }) => {

  return (
    <div className="mt-6 border rounded-lg">
      {courses.map((course) => (
        <div
          key={course.CRN} // id yerine crn kullanılabilir
          className="grid grid-cols-[1fr_auto] items-center border-b p-4"
        >
          <div>
            <p className="text-[#212121] font-medium">{course.CourseTitle}</p>
            <p className="text-[#6B7280] text-sm">
              {course.CourseCode} - {course.CRN}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#6B7280] hover:bg-transparent hover:text-[#212121]"
            onClick={() => onRemoveCourse(course.CRN)} // crn ile ders kaldırma
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default CourseList;
