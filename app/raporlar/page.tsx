'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  BarChart3,
  Download,
  FileText,
  Calendar,
  TrendingUp,
  Users
} from 'lucide-react';
import { FirebaseService } from '@/lib/firebase-service';
import { Class, Student } from '@/lib/types';

export default function ReportsPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reportType, setReportType] = useState<'individual' | 'class'>('class');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

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

  const fetchStudents = async () => {
    if (!selectedClass) return;
    
    try {
      const studentsData = await FirebaseService.getStudentsByClassId(selectedClass);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const generateClassReport = () => {
    // Mock data for demonstration
    const reportData = students.map(student => ({
      name: `${student.firstName} ${student.lastName}`,
      schoolNumber: student.schoolNumber,
      plusCount: Math.floor(Math.random() * 20) + 5,
      halfCount: Math.floor(Math.random() * 10) + 2,
      minusCount: Math.floor(Math.random() * 5) + 1,
      absentCount: Math.floor(Math.random() * 3),
      excusedCount: Math.floor(Math.random() * 2)
    }));

    return reportData;
  };

  const generateIndividualReport = () => {
    if (!selectedStudent) return null;
    
    const student = students.find(s => s.id === selectedStudent);
    if (!student) return null;

    // Mock data for demonstration
    return {
      student,
      records: [
        { date: '2024-01-15', status: 'plus', note: 'Derste aktif katılım' },
        { date: '2024-01-16', status: 'half', note: 'Geç kaldı' },
        { date: '2024-01-17', status: 'plus', note: 'Mükemmel performans' },
        { date: '2024-01-18', status: 'minus', note: 'Ödev eksik' },
        { date: '2024-01-19', status: 'excused', note: 'Hastalık izni' }
      ]
    };
  };

  const exportToPDF = (type: 'class' | 'individual') => {
    // This would integrate with a PDF library like jsPDF
    alert(`${type === 'class' ? 'Sınıf' : 'Bireysel'} raporu PDF olarak indiriliyor...`);
  };

  const classReportData = generateClassReport();
  const individualReportData = generateIndividualReport();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Raporlar</h1>
        <p className="text-gray-600">Sınıf ve öğrenci raporlarını görüntüleyin ve indirin</p>
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
            Rapor Ayarları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Rapor Türü</Label>
              <Select value={reportType} onValueChange={(value: 'individual' | 'class') => setReportType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class">Sınıf Raporu</SelectItem>
                  <SelectItem value="individual">Bireysel Rapor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Sınıf</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Sınıf seçin" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {reportType === 'individual' && (
              <div>
                <Label>Öğrenci</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Öğrenci seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.firstName} {student.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Başlangıç</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label>Bitiş</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Class Report */}
      {reportType === 'class' && selectedClass && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-green-600" />
                Sınıf Genel Raporu
              </CardTitle>
              <Button onClick={() => exportToPDF('class')}>
                <Download className="mr-2 h-4 w-4" />
                PDF İndir
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Öğrenci</TableHead>
                  <TableHead>Okul No</TableHead>
                  <TableHead className="text-center">Artı</TableHead>
                  <TableHead className="text-center">Yarım</TableHead>
                  <TableHead className="text-center">Eksi</TableHead>
                  <TableHead className="text-center">Yok</TableHead>
                  <TableHead className="text-center">İzinli</TableHead>
                  <TableHead className="text-center">Toplam Puan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classReportData.map((data, index) => {
                  const totalScore = data.plusCount * 2 + data.halfCount * 1 - data.minusCount * 1;
                  
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{data.name}</TableCell>
                      <TableCell>{data.schoolNumber}</TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-green-100 text-green-800">{data.plusCount}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">{data.halfCount}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-red-100 text-red-800">{data.minusCount}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-gray-100 text-gray-800">{data.absentCount}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-blue-100 text-blue-800">{data.excusedCount}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          className={
                            totalScore >= 20 ? 'bg-green-100 text-green-800' :
                            totalScore >= 10 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {totalScore}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Individual Report */}
      {reportType === 'individual' && selectedStudent && individualReportData && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-purple-600" />
                Bireysel Öğrenci Raporu
              </CardTitle>
              <Button onClick={() => exportToPDF('individual')}>
                <Download className="mr-2 h-4 w-4" />
                PDF İndir
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">
                  {individualReportData.student.firstName} {individualReportData.student.lastName}
                </h3>
                <p className="text-gray-600">Okul No: {individualReportData.student.schoolNumber}</p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Not</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {individualReportData.records.map((record, index) => {
                    const config = statusConfig[record.status];
                    
                    return (
                      <TableRow key={index}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>
                          <Badge className={config.badge}>
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.note}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!selectedClass && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Rapor oluşturmak için sınıf seçin</h3>
            <p className="text-gray-500 text-center">
              Yukarıdaki filtrelerden sınıf ve tarih aralığı seçerek raporları görüntüleyebilirsiniz
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}