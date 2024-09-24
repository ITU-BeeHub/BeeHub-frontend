import React, { useState } from "react";
import { Course } from "../../../../types/BeeSyncTypes";
import { Button } from "../ui/button";
import FileVersionModal from "./FileVersionModal";

interface FileExplorerProps {
  courses: Course[];
}

const FileExplorer: React.FC<FileExplorerProps> = ({ courses }) => {
  const [selectedFileVersions, setSelectedFileVersions] = useState<{
    courseName: string;
    fileName: string;
    versions: any[];
  } | null>(null);

  const handleViewVersions = (courseName: string, fileName: string, versions: any[]) => {
    setSelectedFileVersions({ courseName, fileName, versions });
  };

  const closeModal = () => {
    setSelectedFileVersions(null);
  };

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <div key={course.id}>
          <h3 className="text-lg font-medium text-gray-800 mb-2">{course.name}</h3>
          <div className="ml-4 space-y-2">
            {course.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between border p-2 rounded-md"
              >
                <span>{file.name}</span>
                <Button
                  className="bg-[#FDC003] text-[#0372CE]"
                  onClick={() => handleViewVersions(course.name, file.name, file.versions)}
                >
                  View Versions
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
      {selectedFileVersions && (
        <FileVersionModal
        courseName={selectedFileVersions.courseName}
        fileName={selectedFileVersions.fileName}
        versions={selectedFileVersions.versions}
        closeModal={closeModal}
      />
      )}
    </div>
  );
};

export default FileExplorer;
