import { UserProfile, AppSettings, LessonPlan, Note } from './types';

const STORAGE_KEYS = {
  USER_PROFILE: 'sinifplanim_user_profile',
  APP_SETTINGS: 'sinifplanim_app_settings',
  LESSON_PLANS: 'sinifplanim_lesson_plans',
  NOTES: 'sinifplanim_notes'
};

export class LocalStorageService {
  // User Profile
  static getUserProfile(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  }

  static saveUserProfile(profile: UserProfile): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  }

  // App Settings
  static getAppSettings(): AppSettings {
    if (typeof window === 'undefined') {
      return {
        theme: 'light',
        notifications: { email: true, push: true }
      };
    }
    const data = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
    return data ? JSON.parse(data) : {
      theme: 'light',
      notifications: { email: true, push: true }
    };
  }

  static saveAppSettings(settings: AppSettings): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
  }

  // Lesson Plans
  static getLessonPlans(): LessonPlan[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.LESSON_PLANS);
    return data ? JSON.parse(data) : [];
  }

  static saveLessonPlan(plan: LessonPlan): void {
    if (typeof window === 'undefined') return;
    const plans = this.getLessonPlans();
    plans.push(plan);
    localStorage.setItem(STORAGE_KEYS.LESSON_PLANS, JSON.stringify(plans));
  }

  static deleteLessonPlan(id: string): void {
    if (typeof window === 'undefined') return;
    const plans = this.getLessonPlans().filter(plan => plan.id !== id);
    localStorage.setItem(STORAGE_KEYS.LESSON_PLANS, JSON.stringify(plans));
  }

  // Notes
  static getNotes(): Note[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    return data ? JSON.parse(data) : [];
  }

  static saveNote(note: Note): void {
    if (typeof window === 'undefined') return;
    const notes = this.getNotes();
    const existingIndex = notes.findIndex(n => n.id === note.id);
    
    if (existingIndex >= 0) {
      notes[existingIndex] = note;
    } else {
      notes.push(note);
    }
    
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }

  static deleteNote(id: string): void {
    if (typeof window === 'undefined') return;
    const notes = this.getNotes().filter(note => note.id !== id);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }
}