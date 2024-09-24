// CourseGrid.tsx
import React from "react";
import { Course, CourseGroup } from "../../../../types/BeeSyncTypes";
import { useDrag, useDrop } from "react-dnd";
import CourseItem from "./CourseItem";
import update from "immutability-helper";
import { Button } from "../ui/button";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { DropTargetMonitor } from 'react-dnd';

interface CourseGridProps {
  courses: Course[];
  groups: CourseGroup[];
  onCourseClick: (course: Course) => void;
  onGroupClick: (group: CourseGroup) => void;
  updateGroups: (groups: CourseGroup[]) => void;
  updateCourses: (courses: Course[]) => void;
  isGroupView: boolean;
  groupName?: string;
  onBack?: () => void;
}

const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  groups,
  onCourseClick,
  onGroupClick,
  updateGroups,
  updateCourses,
  isGroupView,
  groupName,
  onBack,
}) => {
  // The drop method with explicit typing for monitor
  const [_, drop] = useDrop({
    accept: "COURSE",
    drop: (item: { course: Course }, monitor: DropTargetMonitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) return;

      // Handle drop outside of any course item
      // You can implement functionality here if needed
    },
  });

  return (
    <div ref={drop}>
      {isGroupView && onBack && (
        <Button
          className="mb-4 flex items-center text-[#0372CE]"
          variant="link"
          onClick={onBack}
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          Back to Courses
        </Button>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {groups.map((group) => (
          <CourseItem
            key={group.id}
            group={group}
            onGroupClick={onGroupClick}
            updateGroups={updateGroups}
            updateCourses={updateCourses}
            courses={courses}
            groups={groups} // Add this line
          />
        ))}
        {courses.map((course) => (
          <CourseItem
            key={course.id}
            course={course}
            onCourseClick={onCourseClick}
            updateGroups={updateGroups}
            updateCourses={updateCourses}
            courses={courses}
            groups={groups} // Add this line
          />
        ))}
      </div>
    </div>
  );
};

export default CourseGrid;
