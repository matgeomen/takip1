# SınıfPlanım - Öğretmen Asistanı Uygulaması

Modern, responsive ve kullanıcı dostu bir öğretmen asistanı uygulaması.

## Özellikler

- **Ana Sayfa (Dashboard)**: İstatistik kartları, hızlı erişim butonları ve haftalık ders programı
- **Sınıflarım**: Sınıf ve öğrenci yönetimi, toplu öğrenci ekleme
- **Günlük Takip**: Öğrenci devam durumu takibi ve not ekleme
- **Raporlar**: Sınıf ve bireysel öğrenci raporları, PDF indirme
- **Planlarım**: Ders planı yükleme ve yönetimi
- **Notlarım**: Renkli notlar, sesle yazma, fotoğraf ekleme
- **Ayarlar**: Profil yönetimi, tema ve bildirim ayarları

## Teknolojiler

- Next.js 13 (App Router)
- TypeScript
- Tailwind CSS
- ShadCN UI
- Firebase Firestore
- LocalStorage (bazı veriler için)
- Lucide React (ikonlar)

## Kurulum

1. Firebase projenizi oluşturun
2. `firebase.config.ts` dosyasındaki config bilgilerini güncelleyin
3. Firestore'da aşağıdaki collection'ları oluşturun:
   - `classes`
   - `students` 
   - `attendance`

## Geliştirme

```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## Notlar

- Profil ayarları, uygulama ayarları, ders planları ve notlar localStorage'da saklanır
- Sınıf, öğrenci ve devam bilgileri Firebase Firestore'da saklanır
- Responsive tasarım ile mobil cihazlarda mükemmel çalışır
- Modern ve profesyonel UI/UX