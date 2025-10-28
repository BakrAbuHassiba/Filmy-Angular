import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private favoritesSubject = new BehaviorSubject<any[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  private watchlistSubject = new BehaviorSubject<any[]>([]);
  watchlist$ = this.watchlistSubject.asObservable();

  constructor() {
    this.loadUserData();
  }

  private getUserId(): string | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)._id : null;
  }

  private getStorageKey(type: 'favorites' | 'watchlist') {
    const userId = this.getUserId();
    return userId ? `${type}_${userId}` : type;
  }

  private loadUserData() {
    const favoritesKey = this.getStorageKey('favorites');
    const watchlistKey = this.getStorageKey('watchlist');

    const fav = favoritesKey ? localStorage.getItem(favoritesKey) : null;
    const watch = watchlistKey ? localStorage.getItem(watchlistKey) : null;

    this.favoritesSubject.next(fav ? JSON.parse(fav) : []);
    this.watchlistSubject.next(watch ? JSON.parse(watch) : []);
  }

  // Call this on login
  reloadUserData() {
    this.loadUserData();
  }

  // Call this on logout
  logout() {
    this.favoritesSubject.next([]);
    this.watchlistSubject.next([]);
  }

  getFavoritesFromStorage() {
    const key = this.getStorageKey('favorites');
    const f = localStorage.getItem(key);
    return f ? JSON.parse(f) : [];
  }

  getWatchlistFromStorage() {
    const key = this.getStorageKey('watchlist');
    const w = localStorage.getItem(key);
    return w ? JSON.parse(w) : [];
  }

  updateFavorites(favorites: any[]) {
    const key = this.getStorageKey('favorites');
    localStorage.setItem(key, JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }

  updateWatchlist(watchlist: any[]) {
    const key = this.getStorageKey('watchlist');
    localStorage.setItem(key, JSON.stringify(watchlist));
    this.watchlistSubject.next(watchlist);
  }
}
