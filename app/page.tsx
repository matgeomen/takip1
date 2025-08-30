'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  GraduationCap, 
  Calendar,
  ClipboardCheck,
  BarChart3,
  Clock,
  TrendingUp,
  FileText,
  StickyNote
} from 'lucide-react';
import { FirebaseService } from '@/lib/firebase-service';
import { LocalStorageService } from '@/lib/local-storage';
import { Class } from '@/lib/types';
import Link from 'next/link';

export default function Dashboard() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [todayAttendance, setTodayAttendance] = useState(0);
  const [loading, setLoading] = useState(true);

  const userProfile = LocalStorageService.getUserProfile();
  const currentTime = new Date().toLocaleTimeString('tr-TR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  const currentDate = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const classesData = await FirebaseService.getClasses();
      setClasses(classesData);
      
      // Calculate total students
      let total = 0;
      for (const classItem of classesData) {
        const students = await FirebaseService.getStudentsByClassId(classItem.id);
        total += students.length;
      }
      setTotalStudents(total);
      
      // Mock today's attendance count
      setTodayAttendance(Math.floor(total * 0.85));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const weeklySchedule = [
    { day: 'Pazartesi', time: '08:00-12:00', subject: '5-A Matematik' },
    { day: 'Salı', time: '09:00-13:00', subject: '6-B Matematik' },
    { day: 'Çarşamba', time: '08:00-11:00', subject: '5-A Matematik' },
    { day: 'Perşembe', time: '10:00-14:00', subject: '7-C Matematik' },
    { day: 'Cuma', time: '08:00-12:00', subject: '6-B Matematik' },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Hoşgeldiniz, {userProfile?.name || 'Öğretmenim'}
        </h1>
        <p className="text-blue-100 mb-4">{currentDate} - {currentTime}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/gunluk-takip">
            <Button variant="secondary" className="w-full sm:w-auto">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Bugünkü Takibi Yap
            </Button>
          </Link>
          <Link href="/raporlar">
            <Button variant="outline" className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20">
              <BarChart3 className="mr-2 h-4 w-4" />
              Raporları Görüntüle
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Toplam Sınıf
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{classes.length}</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Aktif sınıflar
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Toplam Öğrenci
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalStudents}</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Kayıtlı öğrenciler
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Bugünkü Katılım
            </CardTitle>
            <ClipboardCheck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{todayAttendance}</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              %{totalStudents > 0 ? Math.round((todayAttendance / totalStudents) * 100) : 0} katılım oranı
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-blue-600" />
            Haftalık Ders Programı
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {weeklySchedule.map((lesson, index) => (
              <div 
                key={index}
                className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="font-semibold text-gray-900 mb-1">{lesson.day}</div>
                <div className="text-sm text-gray-600 mb-2 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {lesson.time}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {lesson.subject}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Son Sınıf Aktiviteleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classes.slice(0, 3).map((classItem) => (
                <div key={classItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{classItem.name}</p>
                    <p className="text-sm text-gray-500">{classItem.grade} - {classItem.totalStudents} öğrenci</p>
                  </div>
                  <Link href={`/siniflarim`}>
                    <Button variant="ghost" size="sm">
                      Görüntüle
                    </Button>
                  </Link>
                </div>
              ))}
              {classes.length === 0 && (
                <p className="text-gray-500 text-center py-4">Henüz sınıf eklenmemiş</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/siniflarim">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                  <Users className="h-5 w-5 mb-1" />
                  <span className="text-xs">Sınıf Yönetimi</span>
                </Button>
              </Link>
              <Link href="/gunluk-takip">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                  <ClipboardCheck className="h-5 w-5 mb-1" />
                  <span className="text-xs">Devam Takibi</span>
                </Button>
              </Link>
              <Link href="/planlarim">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                  <FileText className="h-5 w-5 mb-1" />
                  <span className="text-xs">Ders Planları</span>
                </Button>
              </Link>
              <Link href="/notlarim">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                  <StickyNote className="h-5 w-5 mb-1" />
                  <span className="text-xs">Notlarım</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}