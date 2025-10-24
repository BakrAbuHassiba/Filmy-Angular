import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  private http = inject(HttpClient);
  private apiUrl = 'https://filmy-dusky.vercel.app/api';

  getAllMovies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/movies`);
  }
  getMovieById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/movies/${id}`);
  }

    addToFavorite(userId: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No authentication token found.');
    }

    return this.http.post(
      `${this.apiUrl}/users/${userId}/favorites/${movieId}`,
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

// addToWatchlist(userId: string, movieId: string) {
//   const token = localStorage.getItem('token');

//   return this.http.post(
//     `https://filmy-dusky.vercel.app/api/users/${userId}/watchlist/${movieId}`,
//     {},
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,  // ✅ Important!
//       }
//     }
//   );
// }

}
