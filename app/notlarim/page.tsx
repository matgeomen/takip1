'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  StickyNote,
  Plus,
  Edit,
  Trash2,
  Camera,
  Mic,
  Image as ImageIcon,
  Palette
} from 'lucide-react';
import { LocalStorageService } from '@/lib/local-storage';
import { Note } from '@/lib/types';

const noteColors = [
  { name: 'Sarı', value: 'bg-yellow-100 border-yellow-200', class: 'bg-yellow-100' },
  { name: 'Mavi', value: 'bg-blue-100 border-blue-200', class: 'bg-blue-100' },
  { name: 'Yeşil', value: 'bg-green-100 border-green-200', class: 'bg-green-100' },
  { name: 'Pembe', value: 'bg-pink-100 border-pink-200', class: 'bg-pink-100' },
  { name: 'Mor', value: 'bg-purple-100 border-purple-200', class: 'bg-purple-100' },
  { name: 'Turuncu', value: 'bg-orange-100 border-orange-200', class: 'bg-orange-100' }
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(noteColors[0].value);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const savedNotes = LocalStorageService.getNotes();
    setNotes(savedNotes);
  }, []);

  const handleSaveNote = () => {
    if (!title.trim()) return;

    const noteData: Note = {
      id: editingNote?.id || Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      color: selectedColor,
      createdAt: editingNote?.createdAt || new Date(),
      updatedAt: new Date()
    };

    LocalStorageService.saveNote(noteData);
    setNotes(LocalStorageService.getNotes());
    resetForm();
  };

  const handleDeleteNote = (id: string) => {
    if (!confirm('Bu notu silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    LocalStorageService.deleteNote(id);
    setNotes(LocalStorageService.getNotes());
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setSelectedColor(note.color);
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setSelectedColor(noteColors[0].value);
    setDialogOpen(false);
  };

  const handleVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tarayıcınız ses tanıma özelliğini desteklemiyor.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'tr-TR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setContent(prev => prev + ' ' + transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      alert('Ses tanıma sırasında bir hata oluştu.');
    };

    recognition.start();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // In a real app, you'd handle image storage here
        alert('Fotoğraf ekleme özelliği geliştirilme aşamasında...');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notlarım</h1>
          <p className="text-gray-600">Kişisel notlarınızı oluşturun ve organize edin</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Not
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingNote ? 'Notu Düzenle' : 'Yeni Not Oluştur'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="note-title">Not Başlığı</Label>
                <Input
                  id="note-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Not başlığı..."
                />
              </div>

              <div>
                <Label htmlFor="note-content">İçerik</Label>
                <Textarea
                  id="note-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Notunuzu yazın..."
                  className="min-h-[120px]"
                />
              </div>

              <div>
                <Label>Not Rengi</Label>
                <div className="flex space-x-2 mt-2">
                  {noteColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-8 h-8 rounded-full border-2 ${color.class} ${
                        selectedColor === color.value ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceRecording}
                  disabled={isRecording}
                  className="flex-1"
                >
                  <Mic className={`mr-1 h-3 w-3 ${isRecording ? 'text-red-500' : ''}`} />
                  {isRecording ? 'Dinleniyor...' : 'Sesle Yaz'}
                </Button>
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="flex-1"
                >
                  <Camera className="mr-1 h-3 w-3" />
                  Fotoğraf
                </Button>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  İptal
                </Button>
                <Button onClick={handleSaveNote} disabled={!title.trim()}>
                  {editingNote ? 'Güncelle' : 'Kaydet'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {notes.map((note) => (
          <Card key={note.id} className={`hover:shadow-lg transition-shadow duration-200 ${note.color} border-2`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditNote(note)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteNote(note.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 line-clamp-4 mb-3">
                {note.content}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{note.createdAt.toLocaleDateString('tr-TR')}</span>
                {note.hasImage && (
                  <Badge variant="secondary" className="text-xs">
                    <ImageIcon className="mr-1 h-3 w-3" />
                    Fotoğraf
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <StickyNote className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz not eklenmemiş</h3>
            <p className="text-gray-500 text-center mb-4">
              İlk notunuzu oluşturarak başlayın
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              İlk Notu Oluştur
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}