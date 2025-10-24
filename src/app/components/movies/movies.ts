import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movies.html',
  styleUrl: './movies.css',
})
export class Movies implements OnInit {
  movies: any[] = [];
  allMovies: any[] = [];
  genre: string | null = null;

  searchTerm: string | null = null;

  constructor(
    private moviesService: MoviesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const g = params.get('genre');
      if (g) {
        this.genre = g;
        this.searchTerm = null; // reset search
        this.loadMovies();
      }
    });

    this.route.queryParamMap.subscribe((q) => {
      const s = q.get('search');
      if (s !== null) {
        this.searchTerm = s;
        this.genre = null; // reset genre
        this.loadMovies();
      }
    });

    if (!this.genre && !this.searchTerm) {
      this.loadMovies();
    }
  }

  loadMovies(): void {
    this.moviesService.getAllMovies().subscribe({
      next: (res: any) => {
        this.allMovies = res.movies ?? (Array.isArray(res) ? res : []);

        // ✅ Filter by genre first (if exists)
        let filtered = this.allMovies;
        if (this.genre) {
          const gLower = this.genre.toLowerCase();
          filtered = filtered.filter((m) => {
            if (!m.genre) return false;
            if (Array.isArray(m.genre)) {
              return m.genre.some((gg: string) => gg.toLowerCase() === gLower);
            }
            return m.genre.toString().toLowerCase() === gLower;
          });
        }

        // ✅ Then filter by search term (if exists)
        if (this.searchTerm) {
          const sLower = this.searchTerm.toLowerCase();
          filtered = filtered.filter((m) => m.title?.toLowerCase().includes(sLower));
        }

        this.movies = filtered;
      },
      error: (err) => console.error('Error fetching movies:', err),
    });
  }


    toggleFavorite(movie: any, event: MouseEvent): void {
    event.stopPropagation();

    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!user || !token) {
      alert('You must be logged in to add favorites');
      return;
    }

    const userId = JSON.parse(user)._id;

    this.moviesService.addToFavorite(userId, movie._id).subscribe({
      next: (res: any) => {
        movie.isFav = !movie.isFav;
        alert('Added to favorites');
        console.log('Favorite added:', res);
      },
      error: (err) => {
        console.error('Error adding to favorites:', err);
        alert('Failed to add to favorites');
      },
    });
  }

// addToWatchlist(movieId: string) {
//   const userId = localStorage.getItem('userId');
//   const token = localStorage.getItem('token');

//   if (!userId || !token) {
//     alert("Please login first!");
//     return;
//   }

//   this.moviesService.addToWatchlist(userId, movieId).subscribe({
//     next: (res) => alert("✅ Added to watchlist!"),
//     error: (err) => alert("❌ Failed to add to watchlist"),
//   });
// }


  goToMovie(id: string) {
    this.router.navigate(['/movieDetails', id]);
  }
}
