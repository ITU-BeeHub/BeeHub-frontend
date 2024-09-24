// BeeSyncTypes.ts
export interface Course {
    id: string;
    name: string;
    unreadFiles: number;
    files: CourseFile[];
  }
  
  export interface CourseFile {
    id: string;
    name: string;
    versions: FileVersion[];
  }
  
  export interface FileVersion {
    id: string;
    version: number;
    content: string;
    date: string;
  }
  
  export interface CourseGroup {
    id: string;
    name: string;
    courses: Course[];
  }
  