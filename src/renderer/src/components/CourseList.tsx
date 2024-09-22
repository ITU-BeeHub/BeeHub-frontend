import React from "react";
import { Button } from "../components/ui/button";
import XIcon from "../components/icons/XIcon";
import { Course, SelectedCourse } from "../../../types/Course";

interface CourseListProps {
  courses: SelectedCourse[];
  onRemoveCourse: (crn: string) => void;
}


const CourseList: React.FC<CourseListProps> = ({ courses, onRemoveCourse }) => {

  return (
    <div className="mt-6 border rounded-lg">
      {courses.map((selectedCourse) => (
        <div key={selectedCourse.course.crn} className="border-b">
          <div className="grid grid-cols-[1fr_auto] items-center p-4">
            <div>
              <p className="text-[#212121] font-medium">{selectedCourse.course.dersAdi}</p>
              <p className="text-[#6B7280] text-sm">
                {selectedCourse.course.dersKodu} - {selectedCourse.course.crn}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#6B7280] hover:bg-transparent hover:text-[#212121]"
              onClick={() => onRemoveCourse(selectedCourse.course.crn)}
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
          {selectedCourse.reserveCourse && (
            <div className="ml-6 border-l pl-4">
              <div className="grid grid-cols-[1fr_auto] items-center p-4">
                <div>
                  <p className="text-[#212121] font-medium">Reserve: {selectedCourse.reserveCourse.dersAdi}</p>
                  <p className="text-[#6B7280] text-sm">
                    {selectedCourse.reserveCourse.dersKodu} - {selectedCourse.reserveCourse.crn}
                  </p>
                </div>
              </div>
            </div>
          )}
  </div>
))}

    </div>
  );
};

export default CourseList;
