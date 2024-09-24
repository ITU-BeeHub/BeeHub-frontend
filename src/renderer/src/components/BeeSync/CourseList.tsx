import React from "react";
import { Course } from "../../../../types/BeeSyncTypes";
import { Checkbox } from "../ui/checkbox";

interface CourseListProps {
  courses: Course[];
  selectedCourses: Course[];
  onCourseSelect: (course: Course) => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, selectedCourses, onCourseSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <div
          key={course.id}
          className="border rounded-md p-4 flex items-center justify-between"
        >
          <div>
            <h3 className="text-lg font-medium text-gray-800">{course.name}</h3>
          </div>
          <Checkbox
            checked={selectedCourses.some((c) => c.id === course.id)}
            onCheckedChange={() => onCourseSelect(course)}
          />
        </div>
      ))}
    </div>
  );
};

export default CourseList;
