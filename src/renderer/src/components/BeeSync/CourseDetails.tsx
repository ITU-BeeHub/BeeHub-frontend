// CourseDetails.tsx
import React, { useState } from "react";
import { Course } from "../../../../types/BeeSyncTypes";
import { Button } from "../ui/button";
import FileVersionModal from "./FileVersionModal";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

interface CourseDetailsProps {
  course: Course;
  onBack: () => void;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ course, onBack }) => {
  const [selectedFile, setSelectedFile] = useState<any | null>(null);

  const handleFileClick = (file: any) => {
    setSelectedFile(file);
  };

  const closeModal = () => {
    setSelectedFile(null);
  };

  return (
    <div>
      <Button
        className="mb-4 flex items-center text-[#0372CE]"
        variant="link"
        onClick={onBack}
      >
        <ChevronLeftIcon className="h-5 w-5 mr-1" />
        Back to Courses
      </Button>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{course.name}</h2>
      <div className="space-y-2">
        {course.files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between border p-2 rounded-md cursor-pointer"
            onClick={() => handleFileClick(file)}
          >
            <span>{file.name}</span>
            <span className="text-sm text-gray-500">
              {file.versions.length} Versions
            </span>
          </div>
        ))}
      </div>
      {selectedFile && (
        <FileVersionModal
          courseName={course.name}
          fileName={selectedFile.name}
          versions={selectedFile.versions}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default CourseDetails;
