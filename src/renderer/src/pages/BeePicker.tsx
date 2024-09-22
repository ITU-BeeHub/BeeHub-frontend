import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CourseSelector from "../components/CourseSelector";
import CourseList from "../components/CourseList";
import Calendar from "../components/Calendar";
import { Button } from "../components/ui/button";
import { Course, SelectedCourse } from "../../../types/Course";
import { useAuth } from "../context/AuthContext";
import XIcon from "../components/icons/XIcon";

const BeePicker: React.FC = (): React.ReactNode => {
  const [selectedCourses, setSelectedCourses] = useState<SelectedCourse[]>(() => {
    const savedCourses = localStorage.getItem("selectedCourses");
    return savedCourses ? JSON.parse(savedCourses) : [];
  });

  const [reserveCourseToAdd, setReserveCourseToAdd] = useState<Course | null>(null);

  const handleAddCourseAsReserve = (course: Course) => {
    setReserveCourseToAdd(course);
    // Notify the user to select a course from their schedule
    // We dont need this notification as we are using a modal on bottom right corner for now.
    //setNotification("Please select a course from your schedule to assign the reserve course.");
  };

  const [groupIdCounter, setGroupIdCounter] = useState(0);

  const [responseData, setResponseData] = useState<any | null>(() => {
    const savedResponse = localStorage.getItem("responseData");
    return savedResponse ? JSON.parse(savedResponse) : null;
  });

  // New state to store the course name snapshots
  const [courseNameMap, setCourseNameMap] = useState<Record<string, string>>(() => {
    const savedMap = localStorage.getItem("courseNameMap");
    return savedMap ? JSON.parse(savedMap) : {};
  });

  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const [notification, setNotification] = useState<string | null>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (notification) {
      // Clear any existing timeout
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      // Set a new timeout
      notificationTimeoutRef.current = setTimeout(() => {
        setNotification(null);
      }, 7500); // Dismiss after 3 seconds
    }
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, [notification]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  useEffect(() => {
    localStorage.setItem("selectedCourses", JSON.stringify(selectedCourses));
  }, [selectedCourses]);

  useEffect(() => {
    if (responseData) {
      localStorage.setItem("responseData", JSON.stringify(responseData));
    }
  }, [responseData]);

  useEffect(() => {
    localStorage.setItem("courseNameMap", JSON.stringify(courseNameMap));
  }, [courseNameMap]);

  const handleAddCourse = (course: Course) => {
    const newGroupId = groupIdCounter + 1;
    setGroupIdCounter(newGroupId);
    setSelectedCourses([...selectedCourses, { course, groupId: newGroupId }]);
    setCourseNameMap((prevMap) => ({ ...prevMap, [course.crn]: course.dersAdi }));
  };

  const handleRemoveCourse = (crn: string) => {
    setSelectedCourses(
      selectedCourses.filter((selectedCourse) => selectedCourse.course.crn !== crn)
    );
  };

  // Helper function to remove a reserve course by CRN
  const removeReserveCourseByCrn = (
    selectedCourse: SelectedCourse,
    reserveCrn: string
  ): boolean => {
    if (selectedCourse.reserveCourse) {
      if (selectedCourse.reserveCourse.course.crn === reserveCrn) {
        selectedCourse.reserveCourse = undefined;
        return true;
      } else {
        return removeReserveCourseByCrn(selectedCourse.reserveCourse, reserveCrn);
      }
    }
    return false;
  };

  const handleRemoveReserveCourse = (parentCrn: string, reserveCrn: string) => {
    const updatedCourses = [...selectedCourses];
    let reserveFound = false;

    for (let i = 0; i < updatedCourses.length; i++) {
      const selectedCourse = updatedCourses[i];
      if (selectedCourse.course.crn === parentCrn) {
        reserveFound = removeReserveCourseByCrn(selectedCourse, reserveCrn);
        if (reserveFound) break;
      } else if (removeReserveCourseByCrn(selectedCourse, reserveCrn)) {
        reserveFound = true;
        break;
      }
    }

    if (reserveFound) {
      setSelectedCourses(updatedCourses);
    } else {
      setNotification("Reserve course not found.");
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true); // Start loading
    setResponseData(null); // Clear previous response data

    try {
      // Extracting course codes
      const courseCodes = selectedCourses.map((selectedCourse) => selectedCourse.course.crn);

      // Sending the request to the backend
      const response = await fetch("http://localhost:8080/beePicker/pick", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ courseCodes }),
      });

      if (response.status === 401) {
        logout();
        navigate("/login");
      } else if (response.ok) {
        const data = await response.json();
        setResponseData(data); // Set the parsed JSON data for display
        console.log("Picking successful:", data);
      } else {
        const errorData = await response.json();
        setResponseData(errorData); // Set the error data for display
        console.error("Error picking courses:", errorData);
      }
    } catch (error) {
      if (error instanceof Error) {
        setResponseData({ error: error.message });
        console.error("Error submitting course selection:", error);
      } else {
        setResponseData({ error: "An unknown error occurred" });
        console.error("An unknown error occurred:", error);
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const getCourseName = (crn: string) => {
    return courseNameMap[crn] || "Unknown Course"; // Retrieve from snapshot map
  };

  // Helper function to find a course by CRN
  const findCourseByCrn = (selectedCourse: SelectedCourse, crn: string): SelectedCourse | null => {
    if (selectedCourse.course.crn === crn) {
      return selectedCourse;
    } else if (selectedCourse.reserveCourse) {
      return findCourseByCrn(selectedCourse.reserveCourse, crn);
    } else {
      return null;
    }
  };

  const handleSelectParentCourse = (parentCrn: string) => {
    if (reserveCourseToAdd) {
      const updatedCourses = [...selectedCourses];
      let parentFound = false;

      for (let i = 0; i < updatedCourses.length; i++) {
        const selectedCourse = updatedCourses[i];
        const parentCourse = findCourseByCrn(selectedCourse, parentCrn);
        if (parentCourse) {
          if (!parentCourse.reserveCourse) {
            parentCourse.reserveCourse = {
              course: reserveCourseToAdd,
              groupId: selectedCourse.groupId,
            };
            parentFound = true;
            break;
          } else {
            // Notify the user that this course already has a reserve
            setNotification("This course already has a reserve course.");
            parentFound = true;
            break;
          }
        }
      }

      if (parentFound) {
        setSelectedCourses(updatedCourses);
        setReserveCourseToAdd(null);
      } else {
        // Notify the user that the selected course was not found
        setNotification("Selected course not found in your schedule.");
      }
    }
  };

  const renderResponseItem = (crn: string, result: any) => {
    const courseName = getCourseName(crn); // Get from the snapshot map

    return (
      <div key={crn} className="border-b border-gray-300 py-2">
        <h4 className="font-semibold text-blue-600">
          CRN: {crn} - {courseName}
        </h4>
        <p
          className={`text-sm ${
            result.statusCode === 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {result.resultData || "No result data available"}
        </p>
      </div>
    );
  };

  return (
    <main className="flex-1 flex items-center justify-center p-4 lg:p-4">
      <div className="w-full max-w-full rounded-lg bg-white p-6 shadow">
        <CourseSelector
          onAddCourse={handleAddCourse}
          onAddCourseAsReserve={handleAddCourseAsReserve}
        />

        <CourseList
          courses={selectedCourses}
          onRemoveCourse={handleRemoveCourse}
          onRemoveReserveCourse={handleRemoveReserveCourse}
        />

        {reserveCourseToAdd && (
          <div className="fixed bottom-8 right-8 bg-white p-4 rounded-lg shadow-lg max-w-sm w-full z-50 border border-gray-300">
            <h2 className="text-lg font-semibold text-[#0372CE] mb-2">Assign Reserve Course</h2>
            <p className="text-sm text-gray-700">
              Please select a course from your schedule to assign the reserve course "
              <span className="font-bold">{reserveCourseToAdd.dersAdi}</span>" to.
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                className="bg-[#FDC003] text-[#0372CE] px-4 py-2 font-bold rounded hover:bg-[#fdc003d9]"
                onClick={() => setReserveCourseToAdd(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}


        <Calendar
          courses={selectedCourses}
          onRemoveCourse={handleRemoveCourse}
          onRemoveReserveCourse={handleRemoveReserveCourse}
          onSelectParentCourse={handleSelectParentCourse}
          selectingParentCourse={!!reserveCourseToAdd}
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
              {Object.keys(responseData).map((crn) =>
                renderResponseItem(crn, responseData[crn])
              )}
            </div>
          </div>
        )}
        {notification && (
          <div className="fixed top-4 right-4 bg-[#FDC003] text-[#0372CE] p-4 rounded shadow-lg">
            <div className="flex items-center">
              <span>{notification}</span>
              <button className="ml-4" onClick={() => setNotification(null)}>
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default BeePicker;
