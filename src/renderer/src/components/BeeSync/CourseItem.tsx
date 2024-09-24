// CourseItem.tsx
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { Course, CourseGroup } from "../../../../types/BeeSyncTypes";

interface CourseItemProps {
  course?: Course;
  group?: CourseGroup;
  onCourseClick?: (course: Course) => void;
  onGroupClick?: (group: CourseGroup) => void;
  updateGroups: (groups: CourseGroup[]) => void;
  updateCourses: (courses: Course[]) => void;
  courses: Course[];
  groups: CourseGroup[]; // Added groups prop
}

const CourseItem: React.FC<CourseItemProps> = ({
  course,
  group,
  onCourseClick,
  onGroupClick,
  updateGroups,
  updateCourses,
  courses,
  groups, // Destructure groups
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "COURSE",
    item: { course },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "COURSE",
    drop: (item: { course: Course }) => {
      if (course && item.course.id !== course.id) {
        // Create a new group
        const newGroup: CourseGroup = {
          id: `group-${Date.now()}`,
          name: "New Group",
          courses: [course, item.course],
        };
        // Update groups with the new group
        updateGroups([...groups, newGroup]);

        // Remove courses from courses list
        updateCourses(courses.filter((c) => c.id !== course.id && c.id !== item.course.id));
      }
    },
    canDrop: (item) => !!course && item.course.id !== course.id,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  if (group) {
    return (
      <div
        className="relative border rounded-md p-4 cursor-pointer bg-white shadow"
        onClick={() => onGroupClick && onGroupClick(group)}
      >
        <div className="text-center">
          <div className="font-bold text-[#0372CE]">{group.name}</div>
          <div>{group.courses.length} Courses</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={(node) => drag(drop(node))} className="relative">
      <div
        className={`border rounded-md p-4 cursor-pointer bg-white shadow ${
          isDragging ? "opacity-50" : ""
        }`}
        onClick={() => onCourseClick && course && onCourseClick(course)}
      >
        <div className="text-center">
          <div className="font-bold text-[#0372CE]">{course?.name}</div>
          {course?.unreadFiles && course?.unreadFiles > 0 && (
            <div className="absolute top-0 right-0 mt-2 mr-2">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {course.unreadFiles}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseItem;
