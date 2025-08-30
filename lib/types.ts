export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  schoolNumber: string;
  classId: string;
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  totalStudents: number;
  createdAt: Date;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'plus' | 'half' | 'minus' | 'absent' | 'excused';
  note?: string;
}

export interface LessonPlan {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  fileContent: string;
  uploadDate: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  hasImage?: boolean;
  imageData?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  name: string;
  title: string;
  branch: string;
  profileImage?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
  };
}