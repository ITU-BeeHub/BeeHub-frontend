import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseSelector from "../components/CourseSelector";
import CourseList from "../components/CourseList";
import Calendar from "../components/Calendar";
import { Button } from "../components/ui/button";
import { Course } from "../../../types/Course";
import { useAuth } from "../context/AuthContext";

const BeePicker: React.FC = (): React.ReactNode => {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>(() => {
    const savedCourses = localStorage.getItem('selectedCourses');
    return savedCourses ? JSON.parse(savedCourses) : [];
  });

  const [responseData, setResponseData] = useState<any | null>(() => {
    const savedResponse = localStorage.getItem('responseData');
    return savedResponse ? JSON.parse(savedResponse) : null;
  });

  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  useEffect(() => {
    localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
  }, [selectedCourses]);

  useEffect(() => {
    if (responseData) {
      localStorage.setItem('responseData', JSON.stringify(responseData));
    }
  }, [responseData]);

  const handleAddCourse = (course: Course) => {
    setSelectedCourses([...selectedCourses, course]);
  };

  const handleRemoveCourse = (crn: string) => {
    setSelectedCourses(selectedCourses.filter((course) => course.crn !== crn));
  };

  const handleSubmit = async () => {
    setIsLoading(true); // Start loading
    setResponseData(null); // Clear previous response data

    try {
      // Extracting course codes
      const courseCodes = selectedCourses.map(course => course.crn);

      // Sending the request to the backend
      const response = await fetch('http://localhost:8080/beePicker/pick', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ courseCodes }),
      });

      if (response.status === 401) {
        logout();
        navigate('/login');
      } else if (response.ok) {
        const data = await response.json();
        setResponseData(data); // Set the parsed JSON data for display
        console.log('Picking successful:', data);
      } else {
        const errorData = await response.json();
        setResponseData(errorData); // Set the error data for display
        console.error('Error picking courses:', errorData);
      }
    } catch (error) {
      if (error instanceof Error) {
        setResponseData({ error: error.message });
        console.error('Error submitting course selection:', error);
      } else {
        setResponseData({ error: 'An unknown error occurred' });
        console.error('An unknown error occurred:', error);
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const getCourseName = (crn: string) => {
    const course = selectedCourses.find(course => course.crn === crn);
    return course ? course["dersAdi"] : "Unknown Course";
  };

  const renderResponseItem = (crn: string, result: any) => (
    <div key={crn} className="border-b border-gray-300 py-2">
      <h4 className="font-semibold text-blue-600">CRN: {crn} - {getCourseName(crn)}</h4>
      <p className={`text-sm ${result.statusCode === 0 ? 'text-green-600' : 'text-red-600'}`}>
        {result.resultData || 'No result data available'}
      </p>
    </div>
  );

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
        <Button
          className="mt-6 w-full bg-[#FDC003] text-[#0372CE] font-bold hover:bg-[#fdc003d9] flex justify-center items-center"
          onClick={handleSubmit}
          disabled={isLoading} // Disable the button when loading
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
          ) : (
            "Submit Course Selection"
          )}
        </Button>
        {responseData && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700">Course Selection Results:</h3>
            <div className="mt-4 space-y-4">
              {Object.keys(responseData).map(crn => renderResponseItem(crn, responseData[crn]))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default BeePicker;
