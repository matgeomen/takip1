'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Settings,
  User,
  Eye,
  Bell,
  Shield,
  Save,
  Camera
} from 'lucide-react';
import { LocalStorageService } from '@/lib/local-storage';
import { UserProfile, AppSettings } from '@/lib/types';

export default function SettingsPage() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    title: '',
    branch: '',
    profileImage: ''
  });
  const [appSettings, setAppSettings] = useState<AppSettings>({
    theme: 'light',
    notifications: { email: true, push: true }
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const savedProfile = LocalStorageService.getUserProfile();
    const savedSettings = LocalStorageService.getAppSettings();
    
    if (savedProfile) {
      setUserProfile(savedProfile);
    }
    setAppSettings(savedSettings);
  }, []);

  const handleSaveProfile = () => {
    LocalStorageService.saveUserProfile(userProfile);
    alert('Profil bilgileri başarıyla kaydedildi!');
  };

  const handleSaveSettings = () => {
    LocalStorageService.saveAppSettings(appSettings);
    alert('Ayarlar başarıyla kaydedildi!');
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('Yeni şifreler eşleşmiyor!');
      return;
    }
    
    if (newPassword.length < 6) {
      alert('Şifre en az 6 karakter olmalıdır!');
      return;
    }

    // In a real app, this would call an authentication service
    alert('Şifre başarıyla değiştirildi!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setUserProfile(prev => ({
          ...prev,
          profileImage: imageData
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
        <p className="text-gray-600">Hesap ve uygulama ayarlarınızı yönetin</p>
      </div>

      {/* Profile Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5 text-blue-600" />
            Profil Yönetimi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userProfile.profileImage} alt={userProfile.name} />
                <AvatarFallback className="text-lg">
                  {userProfile.name ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'Ö'}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="profile-image"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute -bottom-2 -right-2 h-8 w-8"
                onClick={() => document.getElementById('profile-image')?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input
                    id="name"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Adınız ve soyadınız"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Unvan</Label>
                  <Input
                    id="title"
                    value={userProfile.title}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="ör. Öğretmen, Müdür Yardımcısı"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="branch">Branş</Label>
                <Input
                  id="branch"
                  value={userProfile.branch}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, branch: e.target.value }))}
                  placeholder="ör. Matematik, Türkçe, Fen Bilimleri"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile}>
              <Save className="mr-2 h-4 w-4" />
              Profili Kaydet
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="mr-2 h-5 w-5 text-purple-600" />
            Görünüm Ayarları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="theme-toggle">Koyu Tema</Label>
              <p className="text-sm text-gray-600">Karanlık modunu etkinleştir</p>
            </div>
            <Switch
              id="theme-toggle"
              checked={appSettings.theme === 'dark'}
              onCheckedChange={(checked) => 
                setAppSettings(prev => ({ ...prev, theme: checked ? 'dark' : 'light' }))
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings}>
              <Save className="mr-2 h-4 w-4" />
              Görünüm Ayarlarını Kaydet
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-red-600" />
            Güvenlik
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="current-password">Mevcut Şifre</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Mevcut şifreniz"
              />
            </div>
            <div>
              <Label htmlFor="new-password">Yeni Şifre</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Yeni şifreniz"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Yeni Şifre Tekrar</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Yeni şifrenizi tekrar girin"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handlePasswordChange}
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              <Shield className="mr-2 h-4 w-4" />
              Şifreyi Değiştir
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-green-600" />
            Bildirim Ayarları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">E-posta Bildirimleri</Label>
              <p className="text-sm text-gray-600">Önemli güncellemeler için e-posta alın</p>
            </div>
            <Switch
              id="email-notifications"
              checked={appSettings.notifications.email}
              onCheckedChange={(checked) => 
                setAppSettings(prev => ({ 
                  ...prev, 
                  notifications: { ...prev.notifications, email: checked }
                }))
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Anlık Bildirimler</Label>
              <p className="text-sm text-gray-600">Tarayıcı bildirimleri alın</p>
            </div>
            <Switch
              id="push-notifications"
              checked={appSettings.notifications.push}
              onCheckedChange={(checked) => 
                setAppSettings(prev => ({ 
                  ...prev, 
                  notifications: { ...prev.notifications, push: checked }
                }))
              }
            />
          </div>
          
          <Separator />
          
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings}>
              <Save className="mr-2 h-4 w-4" />
              Bildirim Ayarlarını Kaydet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}