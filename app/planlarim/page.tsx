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
import { Badge } from '@/components/ui/badge';
import { 
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
  Plus,
  Calendar
} from 'lucide-react';
import { LocalStorageService } from '@/lib/local-storage';
import { LessonPlan } from '@/lib/types';

export default function LessonPlansPage() {
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const savedPlans = LocalStorageService.getLessonPlans();
    setPlans(savedPlans);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTitle(file.name.split('.')[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        
        const newPlan: LessonPlan = {
          id: Date.now().toString(),
          title,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileContent,
          uploadDate: new Date()
        };

        LocalStorageService.saveLessonPlan(newPlan);
        setPlans(LocalStorageService.getLessonPlans());
        setDialogOpen(false);
        setSelectedFile(null);
        setTitle('');
      };
      
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Bu ders planını silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    LocalStorageService.deleteLessonPlan(id);
    setPlans(LocalStorageService.getLessonPlans());
  };

  const handleDownload = (plan: LessonPlan) => {
    try {
      const link = document.createElement('a');
      link.href = plan.fileContent;
      link.download = plan.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleView = (plan: LessonPlan) => {
    if (plan.fileType.includes('pdf')) {
      window.open(plan.fileContent, '_blank');
    } else {
      alert('Bu dosya türü için görüntüleme desteklenmiyor.');
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    return '📎';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planlarım</h1>
          <p className="text-gray-600">Ders planlarınızı yükleyin ve yönetin</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Plan Yükle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Ders Planı Yükle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Plan Başlığı</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ör. 5. Sınıf Matematik Yıllık Planı"
                />
              </div>
              
              <div>
                <Label htmlFor="file">Dosya Seçin</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileSelect}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Desteklenen formatlar: PDF, Word, Excel
                </p>
              </div>

              {selectedFile && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">
                    <strong>Seçilen dosya:</strong> {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    Boyut: {Math.round(selectedFile.size / 1024)} KB
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  İptal
                </Button>
                <Button 
                  onClick={handleUpload}
                  disabled={!selectedFile || !title}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Yükle
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <span className="mr-2 text-2xl">{getFileTypeIcon(plan.fileType)}</span>
                {plan.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">{plan.fileName}</Badge>
                  <span className="text-sm text-gray-500">
                    {plan.uploadDate.toLocaleDateString('tr-TR')}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleView(plan)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Görüntüle
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDownload(plan)}
                  >
                    <Download className="mr-1 h-3 w-3" />
                    İndir
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(plan.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {plans.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz plan yüklenmemiş</h3>
            <p className="text-gray-500 text-center mb-4">
              İlk ders planınızı yükleyerek başlayın
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              İlk Planı Yükle
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}