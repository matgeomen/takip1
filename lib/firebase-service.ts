import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '@/firebase.config';
import { Student, Class, AttendanceRecord } from './types';

export class FirebaseService {
  // Classes
  static async addClass(classData: Omit<Class, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, 'classes'), classData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding class:', error);
      throw error;
    }
  }

  static async getClasses(): Promise<Class[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'classes'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Class));
    } catch (error) {
      console.error('Error getting classes:', error);
      throw error;
    }
  }

  static async updateClass(id: string, classData: Partial<Class>) {
    try {
      const classRef = doc(db, 'classes', id);
      await updateDoc(classRef, classData);
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  }

  static async deleteClass(id: string) {
    try {
      // First delete all students in the class
      await this.deleteStudentsByClassId(id);
      // Then delete the class
      await deleteDoc(doc(db, 'classes', id));
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  }

  // Students
  static async addStudent(studentData: Omit<Student, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, 'students'), studentData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  }

  static async getStudentsByClassId(classId: string): Promise<Student[]> {
    try {
      const q = query(
        collection(db, 'students'), 
        where('classId', '==', classId),
        orderBy('firstName')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Student));
    } catch (error) {
      console.error('Error getting students:', error);
      throw error;
    }
  }

  static async updateStudent(id: string, studentData: Partial<Student>) {
    try {
      const studentRef = doc(db, 'students', id);
      await updateDoc(studentRef, studentData);
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  static async deleteStudent(id: string) {
    try {
      await deleteDoc(doc(db, 'students', id));
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }

  static async deleteStudentsByClassId(classId: string) {
    try {
      const students = await this.getStudentsByClassId(classId);
      const deletePromises = students.map(student => this.deleteStudent(student.id));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting students by class:', error);
      throw error;
    }
  }

  // Attendance
  static async saveAttendance(attendanceData: Omit<AttendanceRecord, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, 'attendance'), attendanceData);
      return docRef.id;
    } catch (error) {
      console.error('Error saving attendance:', error);
      throw error;
    }
  }

  static async getAttendanceByDateAndClass(date: string, classId: string): Promise<AttendanceRecord[]> {
    try {
      const q = query(
        collection(db, 'attendance'),
        where('date', '==', date),
        where('classId', '==', classId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AttendanceRecord));
    } catch (error) {
      console.error('Error getting attendance:', error);
      throw error;
    }
  }

  static async updateAttendance(id: string, attendanceData: Partial<AttendanceRecord>) {
    try {
      const attendanceRef = doc(db, 'attendance', id);
      await updateDoc(attendanceRef, attendanceData);
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  }
}