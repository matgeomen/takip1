'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Save,
  Plus,
  Minus,
  X,
  UserX,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { FirebaseService } from '@/lib/firebase-service';
import { Class, Student, AttendanceRecord } from '@/lib/types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

type AttendanceStatus = 'plus' | 'half' | 'minus' | 'absent' | 'excused';

const statusConfig = {
  plus: { icon: Plus, color: 'bg-green-500 hover:bg-green-600', label: 'Artı', badge: 'bg-green-100 text-green-800' },
  half: { icon: Minus, color: 'bg-yellow-500 hover:bg-yellow-600', label: 'Yarım', badge: 'bg-yellow-100 text-yellow-800' },
  minus: { icon: X, color: 'bg-red-500 hover:bg-red-600', label: 'Eksi', badge: 'bg-red-100 text-red-800' },
  absent: { icon: UserX, color: 'bg-gray-500 hover:bg-gray-600', label: 'Yok', badge: 'bg-gray-100 text-gray-800' },
  excused: { icon: Clock, color: 'bg-blue-500 hover:bg-blue-600', label: 'İzinli', badge: 'bg-blue-100 text-blue-800' }
};

export default function DailyTrackingPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [attendance, setAttendance] = useState<{[studentId: string]: {status: AttendanceStatus, note: string}}>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsAndAttendance();
    }
  }, [selectedClass, selectedDate]);

  const fetchClasses = async () => {
    try {
      const classesData = await FirebaseService.getClasses();
      setClasses(classesData);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsAndAttendance = async () => {
    if (!selectedClass) return;
    
    try {
      const studentsData = await FirebaseService.getStudentsByClassId(selectedClass);
      setStudents(studentsData);

      const attendanceData = await FirebaseService.getAttendanceByDateAndClass(selectedDate, selectedClass);
      
      const attendanceMap: {[studentId: string]: {status: AttendanceStatus, note: string}} = {};
      attendanceData.forEach(record => {
        attendanceMap[record.studentId] = {
          status: record.status,
          note: record.note || ''
        };
      });
      
      setAttendance(attendanceMap);
    } catch (error) {
      console.error('Error fetching students and attendance:', error);
    }
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note
      }
    }));
  };

  const handleBulkStatus = (status: AttendanceStatus) => {
    const updatedAttendance: {[studentId: string]: {status: AttendanceStatus, note: string}} = {};
    students.forEach(student => {
      updatedAttendance[student.id] = {
        status,
        note: attendance[student.id]?.note || ''
      };
    });
    setAttendance(updatedAttendance);
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass) return;
    
    setSaving(true);
    try {
      const promises = Object.entries(attendance).map(([studentId, data]) => {
        const attendanceRecord: Omit<AttendanceRecord, 'id'> = {
          studentId,
          classId: selectedClass,
          date: selectedDate,
          status: data.status,
          note: data.note
        };
        return FirebaseService.saveAttendance(attendanceRecord);
      });
      
      await Promise.all(promises);
      alert('Devam kayıtları başarıyla kaydedildi!');
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Kayıt sırasında bir hata oluştu!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Günlük Takip</h1>
        <p className="text-gray-600">Öğrenci devam durumlarını takip edin</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-blue-600" />
            Sınıf ve Tarih Seçimi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="class-select">Sınıf Seçin</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Bir sınıf seçin" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name} - {classItem.grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date-select">Tarih Seçin</Label>
              <Input
                id="date-select"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          {selectedClass && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-600 mr-2">Toplu İşlem:</span>
              {Object.entries(statusConfig).map(([status, config]) => {
                const IconComponent = config.icon;
                return (
                  <Button
                    key={status}
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatus(status as AttendanceStatus)}
                    className="flex items-center"
                  >
                    <IconComponent className="mr-1 h-3 w-3" />
                    Tümü {config.label}
                  </Button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Students Table */}
      {selectedClass && students.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Öğrenci Listesi - {format(new Date(selectedDate), 'dd MMMM yyyy', { locale: tr })}
              </CardTitle>
              <Button 
                onClick={handleSaveAttendance}
                disabled={saving}
                className="flex items-center"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Öğrenci</TableHead>
                  <TableHead>Okul No</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Not</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const studentAttendance = attendance[student.id] || { status: 'plus', note: '' };
                  const currentStatus = statusConfig[studentAttendance.status];
                  
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell>{student.schoolNumber}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {Object.entries(statusConfig).map(([status, config]) => {
                            const IconComponent = config.icon;
                            const isSelected = studentAttendance.status === status;
                            
                            return (
                              <Button
                                key={status}
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleStatusChange(student.id, status as AttendanceStatus)}
                                className={`w-8 h-8 p-0 ${isSelected ? config.color : ''}`}
                                title={config.label}
                              >
                                <IconComponent className="h-4 w-4" />
                              </Button>
                            );
                          })}
                        </div>
                        <Badge className={`mt-1 ${currentStatus.badge}`}>
                          {currentStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Textarea
                          placeholder="Öğrenci notu..."
                          value={studentAttendance.note}
                          onChange={(e) => handleNoteChange(student.id, e.target.value)}
                          className="min-h-[60px] resize-none"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedClass && students.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Bu sınıfta öğrenci bulunmuyor</h3>
            <p className="text-gray-500 text-center">
              Önce sınıfınıza öğrenci ekleyin
            </p>
          </CardContent>
        </Card>
      )}

      {!selectedClass && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sınıf seçin</h3>
            <p className="text-gray-500 text-center">
              Devam takibi yapmak için yukarıdan bir sınıf seçin
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}