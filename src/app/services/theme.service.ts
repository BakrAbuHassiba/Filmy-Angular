import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDarkSubject = new BehaviorSubject<boolean>(true);
  isDark$ = this.isDarkSubject.asObservable();

  toggleTheme() {
    const newTheme = !this.isDarkSubject.value;
    this.isDarkSubject.next(newTheme);
    this.applyTheme(newTheme);
  }

  applyTheme(isDark: boolean) {
    document.body.classList.toggle('bg-dark', isDark);
    document.body.classList.toggle('text-light', isDark);
    document.body.classList.toggle('bg-light', !isDark);
    document.body.classList.toggle('text-dark', !isDark);
  }

  setInitialTheme() {
    const saved = localStorage.getItem('theme');
    const isDark = saved ? saved === 'dark' : true;
    this.isDarkSubject.next(isDark);
    this.applyTheme(isDark);
  }
}
