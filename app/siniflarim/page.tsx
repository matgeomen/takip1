'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  Plus, 
  Users, 
  Edit, 
  Trash2, 
  UserPlus,
  Download,
  Upload
} from 'lucide-react';
import { FirebaseService } from '@/lib/firebase-service';
import { Class, Student } from '@/lib/types';
import { useForm } from 'react-hook-form';

interface ClassFormData {
  name: string;
  grade: string;
}

interface StudentFormData {
  firstName: string;
  lastName: string;
  schoolNumber: string;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<{[classId: string]: Student[]}>({});
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const classForm = useForm<ClassFormData>();
  const studentForm = useForm<StudentFormData>();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const classesData = await FirebaseService.getClasses();
      setClasses(classesData);
      
      // Fetch students for each class
      const studentsData: {[classId: string]: Student[]} = {};
      for (const classItem of classesData) {
        const classStudents = await FirebaseService.getStudentsByClassId(classItem.id);
        studentsData[classItem.id] = classStudents;
      }
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async (data: ClassFormData) => {
    try {
      const newClass: Omit<Class, 'id'> = {
        name: data.name,
        grade: data.grade,
        totalStudents: 0,
        createdAt: new Date()
      };
      
      await FirebaseService.addClass(newClass);
      await fetchClasses();
      setClassDialogOpen(false);
      classForm.reset();
    } catch (error) {
      console.error('Error adding class:', error);
    }
  };

  const handleEditClass = async (data: ClassFormData) => {
    if (!editingClass) return;
    
    try {
      await FirebaseService.updateClass(editingClass.id, {
        name: data.name,
        grade: data.grade
      });
      await fetchClasses();
      setEditingClass(null);
      setClassDialogOpen(false);
      classForm.reset();
    } catch (error) {
      console.error('Error updating class:', error);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    if (!confirm('Bu sınıfı ve tüm öğrencilerini silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      await FirebaseService.deleteClass(classId);
      await fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const handleAddStudent = async (data: StudentFormData) => {
    if (!selectedClass) return;
    
    try {
      const newStudent: Omit<Student, 'id'> = {
        firstName: data.firstName,
        lastName: data.lastName,
        schoolNumber: data.schoolNumber,
        classId: selectedClass
      };
      
      await FirebaseService.addStudent(newStudent);
      await fetchClasses();
      setStudentDialogOpen(false);
      studentForm.reset();
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Bu öğrenciyi silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      await FirebaseService.deleteStudent(studentId);
      await fetchClasses();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'Ad,Soyad,Okul No\nÖrnek,Öğrenci,12345\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ogrenci-sablonu.csv';
    a.click();
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sınıflarım</h1>
          <p className="text-gray-600">Sınıflarınızı ve öğrencilerinizi yönetin</p>
        </div>
        
        <Dialog open={classDialogOpen} onOpenChange={setClassDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingClass(null);
              classForm.reset();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Sınıf
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingClass ? 'Sınıfı Düzenle' : 'Yeni Sınıf Ekle'}
              </DialogTitle>
            </DialogHeader>
            <form 
              onSubmit={classForm.handleSubmit(editingClass ? handleEditClass : handleAddClass)}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="name">Sınıf Adı</Label>
                <Input
                  id="name"
                  {...classForm.register('name', { required: true })}
                  placeholder="ör. 5-A"
                />
              </div>
              <div>
                <Label htmlFor="grade">Sınıf Seviyesi</Label>
                <Input
                  id="grade"
                  {...classForm.register('grade', { required: true })}
                  placeholder="ör. 5. Sınıf"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setClassDialogOpen(false)}>
                  İptal
                </Button>
                <Button type="submit">
                  {editingClass ? 'Güncelle' : 'Ekle'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-600" />
                  {classItem.name}
                </CardTitle>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingClass(classItem);
                      classForm.setValue('name', classItem.name);
                      classForm.setValue('grade', classItem.grade);
                      setClassDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClass(classItem.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">{classItem.grade}</Badge>
                  <span className="text-sm text-gray-600">
                    {students[classItem.id]?.length || 0} öğrenci
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <Dialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedClass(classItem.id)}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Öğrenci Ekle
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Yeni Öğrenci Ekle - {classItem.name}</DialogTitle>
                      </DialogHeader>
                      <form 
                        onSubmit={studentForm.handleSubmit(handleAddStudent)}
                        className="space-y-4"
                      >
                        <div>
                          <Label htmlFor="firstName">Ad</Label>
                          <Input
                            id="firstName"
                            {...studentForm.register('firstName', { required: true })}
                            placeholder="Öğrencinin adı"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Soyad</Label>
                          <Input
                            id="lastName"
                            {...studentForm.register('lastName', { required: true })}
                            placeholder="Öğrencinin soyadı"
                          />
                        </div>
                        <div>
                          <Label htmlFor="schoolNumber">Okul Numarası</Label>
                          <Input
                            id="schoolNumber"
                            {...studentForm.register('schoolNumber', { required: true })}
                            placeholder="12345"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setStudentDialogOpen(false)}>
                            İptal
                          </Button>
                          <Button type="submit">Ekle</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Students Table */}
                {students[classItem.id] && students[classItem.id].length > 0 && (
                  <div className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ad Soyad</TableHead>
                          <TableHead>Okul No</TableHead>
                          <TableHead className="w-[100px]">İşlemler</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students[classItem.id].slice(0, 3).map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>
                              {student.firstName} {student.lastName}
                            </TableCell>
                            <TableCell>{student.schoolNumber}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteStudent(student.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {students[classItem.id].length > 3 && (
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        +{students[classItem.id].length - 3} öğrenci daha...
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bulk Operations */}
      <Card>
        <CardHeader>
          <CardTitle>Toplu İşlemler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Şablon İndir (CSV)
            </Button>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Öğrenci Listesi Yükle
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            CSV formatında öğrenci listesi yükleyerek toplu ekleme yapabilirsiniz.
          </p>
        </CardContent>
      </Card>

      {classes.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz sınıf eklenmemiş</h3>
            <p className="text-gray-500 text-center mb-4">
              İlk sınıfınızı ekleyerek başlayın
            </p>
            <Button onClick={() => setClassDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              İlk Sınıfı Ekle
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}