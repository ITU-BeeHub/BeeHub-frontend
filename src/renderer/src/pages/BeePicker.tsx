import { useState } from "react";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CourseSelector from "../components/CourseSelector";
import CourseList from "../components/CourseList";
import Calendar from "../components/Calendar";
import { Button } from "../components/ui/button";
import { Course } from "../../../types/Course";
import { useAuth } from "../context/AuthContext";

const BeePicker: React.FC = (): React.ReactNode => {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  const navigate = useNavigate();

  const handleAddCourse = (course: Course) => {
    setSelectedCourses([...selectedCourses, course]);
  };

  const handleRemoveCourse = (crn: string) => {
    setSelectedCourses(selectedCourses.filter((course) => course.crn !== crn));
  };
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  return (

    <main className="flex-1 flex items-center justify-center p-4 lg:p-4">
      <div className="w-full max-w-full rounded-lg bg-white p-6 shadow">
        <CourseSelector onAddCourse={handleAddCourse} />
        <CourseList
          courses={selectedCourses}
          onRemoveCourse={handleRemoveCourse}
        />
        <Calendar
          courses={selectedCourses}
          onRemoveCourse={handleRemoveCourse}
        />

        <Button className="mt-6 w-full bg-[#FDC003] text-[#0372CE] font-bold hover:bg-[#fdc003d9]">
          Send
        </Button>
      </div>
    </main>
  );
};

export default BeePicker;
