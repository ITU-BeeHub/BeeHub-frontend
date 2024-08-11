import { Button } from "../components/ui/button";
import CourseList from "../components/CourseList";
import CourseSelector from "../components/CourseSelector";
import { Course } from "../types/Course";
import { useState } from "react";

const BeePicker: React.FC = () => {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  const handleAddCourse = (course: Course) => {
    setSelectedCourses([...selectedCourses, course]); //...selectedCourses önceki derslerin eklendiğinden emin olur
  };

  const handleRemoveCourse = (id: number) => {
    setSelectedCourses(selectedCourses.filter((course) => course.id !== id));
  };
  return (
    <main className="flex-1 flex items-center justify-center p-4 lg:p-6">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow">
        <CourseSelector onAddCourse={handleAddCourse} />
        <CourseList
          courses={selectedCourses}
          onRemoveCourse={handleRemoveCourse}
        />
        <Button className="mt-6 w-full bg-[#FDC003] text-[#0372CE] font-bold hover:bg-[#fdc003d9]  ">
          Send
        </Button>
      </div>
    </main>
  );
};

export default BeePicker;
