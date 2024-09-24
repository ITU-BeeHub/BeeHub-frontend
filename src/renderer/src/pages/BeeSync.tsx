// BeeSync.tsx
import React, { useState, useEffect } from "react";
import CourseGrid from "../components/BeeSync/CourseGrid";
import CourseDetails from "../components/BeeSync/CourseDetails";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Course, CourseGroup } from "../../../types/BeeSyncTypes";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


const BeeSync: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [groups, setGroups] = useState<CourseGroup[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<CourseGroup | null>(null);

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      fetchCourses();
    }
  }, [isLoggedIn, navigate]);

  const fetchCourses = async () => {
    // Expanded mock data
    const mockCourses: Course[] = [
      {
        id: "1",
        name: "Mathematics 101",
        unreadFiles: 2,
        files: [
          {
            id: "file1",
            name: "Lecture Notes Week 1",
            versions: [
              { id: "v1", version: 1, content: "Content v1", date: "2023-09-01" },
            ],
          },
          {
            id: "file2",
            name: "Assignment 1",
            versions: [
              { id: "v1", version: 1, content: "Assignment v1", date: "2023-09-05" },
              { id: "v2", version: 2, content: "Assignment v2", date: "2023-09-10" },
            ],
          },
        ],
      },
      {
        id: "2",
        name: "Physics 201",
        unreadFiles: 1,
        files: [
          {
            id: "file3",
            name: "Lab Manual",
            versions: [
              { id: "v1", version: 1, content: "Lab Manual v1", date: "2023-09-08" },
            ],
          },
        ],
      },
      {
        id: "3",
        name: "Chemistry 301",
        unreadFiles: 0,
        files: [],
      },
      // Add more courses as needed
    ];
    setCourses(mockCourses);
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleGroupClick = (group: CourseGroup) => {
    setSelectedGroup(group);
  };

  const handleBack = () => {
    setSelectedCourse(null);
    setSelectedGroup(null);
  };

  const updateGroups = (newGroups: CourseGroup[]) => {
    setGroups(newGroups);
  };

  const updateCourses = (newCourses: Course[]) => {
    setCourses(newCourses);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <main className="flex-1 flex flex-col items-center justify-start p-4 lg:p-6 bg-[#F5FDFD]">
        <div className="w-full max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">BeeSync</h1>
          {selectedCourse ? (
            <CourseDetails course={selectedCourse} onBack={handleBack} />
          ) : selectedGroup ? (
            <CourseGrid
              courses={selectedGroup.courses}
              groups={groups}
              onCourseClick={handleCourseClick}
              onGroupClick={handleGroupClick}
              updateGroups={updateGroups}
              updateCourses={updateCourses}
              isGroupView={true}
              groupName={selectedGroup.name}
              onBack={handleBack}
            />
          ) : (
            <CourseGrid
              courses={courses}
              groups={groups}
              onCourseClick={handleCourseClick}
              onGroupClick={handleGroupClick}
              updateGroups={updateGroups}
              updateCourses={updateCourses}
              isGroupView={false}
            />
          )}
        </div>
      </main>
    </DndProvider>
  );
};

export default BeeSync;
