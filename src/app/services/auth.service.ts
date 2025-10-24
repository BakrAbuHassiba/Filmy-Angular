import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'https://filmy-dusky.vercel.app/api/auth'; // ✅ backend base

  // ✅ match backend route name -> /signup
  signup(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, data);
  }

  // ✅ match backend route name -> /signin
  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, data).pipe(
      tap((res: any) => {
        if (res.tkn) {
          localStorage.setItem('token', res.tkn);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
