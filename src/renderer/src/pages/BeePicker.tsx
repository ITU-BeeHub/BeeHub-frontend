import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CourseSelector from "../components/CourseSelector";
import CourseList from "../components/CourseList";
import Calendar from "../components/Calendar";
import { Button } from "../components/ui/button";
import { Course, SelectedCourse, CourseRequest } from "../../../types/Course";
import { useAuth } from "../context/AuthContext";
import XIcon from "../components/icons/XIcon";

interface ResponseItem {
  crn: string;
  action?: string; // "add" veya "drop"
  statusCode: number;
  resultCode: string;
  resultData: string;
  [key: string]: any;
}


const BeePicker: React.FC = (): React.ReactNode => {
  // Initialize selectedCourses with proper type checking
  const [selectedCourses, setSelectedCourses] = useState<SelectedCourse[]>(() => {
    try {
      const savedCourses = localStorage.getItem("selectedCourses");
      if (savedCourses) {
        const parsed = JSON.parse(savedCourses);
        // Validate that the parsed data contains the required properties
        if (Array.isArray(parsed) && parsed.every(course =>
          course &&
          course.course &&
          typeof course.course === 'object' &&
          'dersAdi' in course.course &&
          'gunAdiEN' in course.course
        )) {
          return parsed;
        }
      }
      return [];
    } catch (error) {
      console.error("Error parsing saved courses:", error);
      return [];
    }
  });

  // Add error boundary state
  const [hasError, setHasError] = useState(false);

  // Reset error state when navigating to the page
  useEffect(() => {
    setHasError(false);
  }, []);

  const [reserveCourseToAdd, setReserveCourseToAdd] = useState<Course | null>(null);

  const handleAddCourseAsReserve = (course: Course) => {
    setReserveCourseToAdd(course);

    // Add the reserve course to the courseNameMap
    setCourseNameMap((prevMap) => ({
      ...prevMap,
      [course.crn]: course.dersAdi,
    }));

    // Notify the user to select a course from their schedule
    // We dont need this notification as we are using a modal on bottom right corner for now.
    //setNotification("Please select a course from your schedule to assign the reserve course.");
  };

  // Load groupIdCounter from localStorage if it exists, otherwise initialize it to 0
  const [groupIdCounter, setGroupIdCounter] = useState<number>(() => {
    const savedCounter = localStorage.getItem("groupIdCounter");
    return savedCounter ? JSON.parse(savedCounter) : 0;
  });

  const [responseData, setResponseData] = useState<ResponseItem[]>(() => {
    const savedResponse = localStorage.getItem("responseData");
    return savedResponse ? JSON.parse(savedResponse) : [];
  });

  // State for courses to drop (SCRN)
  const [dropCRNs, setDropCRNs] = useState<string[]>(() => {
    const saved = localStorage.getItem("dropCRNs");
    return saved ? JSON.parse(saved) : [];
  });
  const [dropCRNInput, setDropCRNInput] = useState<string>("");

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
      // Clear local data on logout
      localStorage.removeItem("selectedCourses");
      localStorage.removeItem("responseData");
      localStorage.removeItem("courseNameMap");
      localStorage.removeItem("groupIdCounter");
      localStorage.removeItem("dropCRNs");
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
    if (responseData && responseData.length > 0) {
      localStorage.setItem("responseData", JSON.stringify(responseData));
    }
  }, [responseData]);

  useEffect(() => {
    localStorage.setItem("courseNameMap", JSON.stringify(courseNameMap));
  }, [courseNameMap]);

  // Save dropCRNs to localStorage
  useEffect(() => {
    localStorage.setItem("dropCRNs", JSON.stringify(dropCRNs));
  }, [dropCRNs]);

  // Save groupIdCounter to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("groupIdCounter", JSON.stringify(groupIdCounter));
  }, [groupIdCounter]);

  // Modify handleAddCourse to include validation
  const handleAddCourse = (course: Course) => {
    if (!course || !course.dersAdi || !course.gunAdiEN) {
      console.error("Invalid course data:", course);
      setNotification("Invalid course data received");
      return;
    }

    const newGroupId = (groupIdCounter + 1) % 32; // Maximum 32 random colors (to prevent integer overflow)
    setGroupIdCounter(newGroupId);
    setSelectedCourses([...selectedCourses, { course, groupId: newGroupId }]);
    setCourseNameMap((prevMap) => ({ ...prevMap, [course.crn]: course.dersAdi }));
  };

  // Add error handling for handleRemoveCourse
  const handleRemoveCourse = (crn: string) => {
    if (!crn) {
      console.error("Invalid CRN for removal");
      return;
    }
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

  // Modify handleRemoveReserveCourse with validation
  const handleRemoveReserveCourse = (parentCrn: string, reserveCrn: string) => {
    if (!parentCrn || !reserveCrn) {
      console.error("Invalid CRNs for reserve removal");
      return;
    }

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

  // Drop CRN handlers
  const handleAddDropCRN = () => {
    const crn = dropCRNInput.trim();
    if (crn && !dropCRNs.includes(crn)) {
      setDropCRNs([...dropCRNs, crn]);
      setDropCRNInput("");
    }
  };

  const handleRemoveDropCRN = (crn: string) => {
    setDropCRNs(dropCRNs.filter(c => c !== crn));
  };

  const handleDropCRNKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddDropCRN();
    }
  };

  const serializeSelectedCourse = (selectedCourse: SelectedCourse): CourseRequest => {
    const result: CourseRequest = {
      crn: selectedCourse.course.crn,
    };

    if (selectedCourse.reserveCourse) {
      result.reserves = [serializeSelectedCourse(selectedCourse.reserveCourse)];
    }

    return result;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setResponseData([]);

    try {
      // Build request payload - reserve-aware courses and SCRN list
      const courseRequests = selectedCourses.map(serializeSelectedCourse);
      const payload = {
        courses: courseRequests,
        SCRN: dropCRNs,
      };

      console.log("Sending request payload:", payload);

      const response = await fetch("http://localhost:8080/beePicker/pick", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        logout();
        navigate("/login");
        setIsLoading(false);
        return;
      } else if (!response.ok) {
        const errorData = await response.json();
        setNotification(`Error: ${errorData.error || 'Unknown error occurred'}`);
        console.error("Error picking courses:", errorData);
        setIsLoading(false);
        return;
      }

      const responseData = await response.json();
      console.log("Received response from backend:", responseData);

      if (typeof responseData === 'object' && responseData !== null) {
        const responseItems: ResponseItem[] = [];

        Object.keys(responseData).forEach(key => {
          const courseResult = responseData[key];
          if (courseResult && typeof courseResult === 'object') {
            // Extract actual CRN (remove "_drop" suffix if present)
            const actualCrn = key.endsWith('_drop') ? key.replace('_drop', '') : key;
            const action = courseResult.action || (key.endsWith('_drop') ? 'drop' : 'add');
            
            const responseItem: ResponseItem = {
              crn: actualCrn,
              action: action,
              statusCode: courseResult.statusCode || 0,
              resultCode: courseResult.resultCode || '',
              resultData: courseResult.resultData || 'No result data available',
              ...courseResult
            };
            responseItems.push(responseItem);
          }
        });

        console.log("Processed response items:", responseItems);
        setResponseData(responseItems);
      } else {
        console.error("Unexpected response format:", responseData);
      }
    } catch (error) {
      console.error("Error submitting course selection:", error);
      setNotification("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
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

  // Add validation in handleSelectParentCourse
  const handleSelectParentCourse = (parentCrn: string) => {
    if (!parentCrn || !reserveCourseToAdd) {
      console.error("Invalid parent CRN or reserve course");
      return;
    }

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

  // Add error handling for the component
  if (hasError) {
    return (
      <div className="p-4 text-red-600">
        Something went wrong. Please try refreshing the page.
      </div>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center p-4 lg:p-4">
      <div className="w-full max-w-full rounded-lg bg-white p-6 shadow">
        {/* Wrap components with error checking */}
        {selectedCourses && Array.isArray(selectedCourses) ? (
          <>
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

            {/* Drop Courses Section */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Courses to Drop
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                Enter the CRNs of the courses you want to drop.
                These will be sent in the request under SCRN.
              </p>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={dropCRNInput}
                  onChange={(e) => setDropCRNInput(e.target.value)}
                  onKeyPress={handleDropCRNKeyPress}
                  placeholder="Enter CRN"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0372CE] focus:border-transparent"
                />
                <Button
                  onClick={handleAddDropCRN}
                  className="bg-red-500 text-white hover:bg-red-600 px-4"
                  disabled={!dropCRNInput.trim()}
                >
                  Add
                </Button>
              </div>

              {dropCRNs.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {dropCRNs.map((crn) => (
                    <span
                      key={crn}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                    >
                      {crn}
                      <button
                        onClick={() => handleRemoveDropCRN(crn)}
                        className="hover:text-red-900"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Calendar
              courses={selectedCourses}
              onRemoveCourse={handleRemoveCourse}
              onRemoveReserveCourse={handleRemoveReserveCourse}
              onSelectParentCourse={handleSelectParentCourse}
              selectingParentCourse={!!reserveCourseToAdd}
            />
          </>
        ) : (
          <div>Loading courses...</div>
        )}

        <Button
          className="mt-6 w-full bg-[#FDC003] text-[#0372CE] font-bold hover:bg-[#fdc003d9] flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={isLoading || (selectedCourses.length === 0 && dropCRNs.length === 0)}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
          ) : (
            selectedCourses.length === 0 && dropCRNs.length === 0
              ? "Add a course to add or drop"
              : `Submit (${selectedCourses.length} add, ${dropCRNs.length} drop)`
          )}
        </Button>

        {responseData && responseData.length > 0 && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Results</h3>
            <div className="mt-4 space-y-4">
              {responseData.map((response: ResponseItem, index: number) => (
                <div 
                  key={`${response.crn}-${response.action || 'add'}-${index}`} 
                  className={`border-l-4 p-4 rounded-lg ${
                    response.statusCode === 0
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-blue-600">
                      CRN: {response.crn}
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      response.action === 'drop' 
                        ? 'bg-orange-100 text-orange-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {response.action === 'drop' ? 'DROP' : 'ADD'}
                    </span>
                  </div>
                  {getCourseName(response.crn) !== "Unknown Course" && (
                    <p className="text-sm text-gray-600 mb-2">{getCourseName(response.crn)}</p>
                  )}
                  <div className="flex items-center mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      response.statusCode === 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {response.statusCode === 0 ? "✓ Success" : "✗ Failed"}
                    </span>
                    {response.resultCode && (
                      <span className="ml-2 text-xs text-gray-500">
                        Code: {response.resultCode}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">
                    {response.resultData || "No result data available"}
                  </p>
                </div>
              ))}
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
