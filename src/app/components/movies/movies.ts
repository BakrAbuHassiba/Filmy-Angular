import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { UserService } from '../../services/user.service';

export interface Movie {
  _id: string;
  title: string;
  genre?: string | string[];
  isFav?: boolean;
  image?: string;
  rating?: number;
  releaseYear?: number;
  duration?: number;
  isWatchlist?: boolean;
}

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movies.html',
  styleUrls: ['./movies.css'],
})
export class Movies implements OnInit {
  movies: Movie[] = [];
  allMovies: Movie[] = [];
  genre: string | null = null;
  searchTerm: string | null = null;

  toastMessage: string = '';
  toastVisible: boolean = false;

  constructor(
    private moviesService: MoviesService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const g = params.get('genre');
      if (g) {
        this.genre = g;
        this.searchTerm = null;
        this.loadMovies();
      }
    });

    this.route.queryParamMap.subscribe((q) => {
      const s = q.get('search');
      if (s !== null) {
        this.searchTerm = s;
        this.genre = null;
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
        const apiMovies = res.movies ?? (Array.isArray(res) ? res : []);

        // Get user-specific favorites
        const favorites: Movie[] = this.userService.getFavoritesFromStorage();

        this.allMovies = apiMovies.map((m: any) => {
          const movie: Movie = {
            _id: m._id || m.id,
            title: m.title,
            genre: m.genre,
            image: m.image || (m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : ''),
            rating: m.rating ?? m.vote_average,
            releaseYear: m.releaseYear ?? (m.release_date ? new Date(m.release_date).getFullYear() : undefined),
            duration: m.duration ?? m.runtime,
            isFav: favorites.some((f: Movie) => f._id === (m._id || m.id)),
          };
          return movie;
        });

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

        if (this.searchTerm) {
          const sLower = this.searchTerm.toLowerCase();
          filtered = filtered.filter((m) => m.title?.toLowerCase().includes(sLower));
        }

        this.movies = filtered;
      },
      error: (err) => console.error('Error fetching movies:', err),
    });
  }

  toggleFavorite(movie: Movie, event: MouseEvent) {
    event.stopPropagation();

    const user = localStorage.getItem('user');
    if (!user) {
      this.showToast('Login required');
      return;
    }

    let favorites: Movie[] = this.userService.getFavoritesFromStorage();
    const exists = favorites.find((f: Movie) => f._id === movie._id);

    if (exists) {
      favorites = favorites.filter((f: Movie) => f._id !== movie._id);
      movie.isFav = false;
      this.showToast(`Removed "${movie.title}" from favorites`);
    } else {
      favorites.push(movie);
      movie.isFav = true;
      this.showToast(`Added "${movie.title}" to favorites`);
    }

    this.userService.updateFavorites(favorites);
  }

  goToMovie(id: string) {
    this.router.navigate(['/movieDetails', id]);
  }

  showToast(message: string, duration: number = 2000) {
    this.toastMessage = message;
    this.toastVisible = true;
    setTimeout(() => (this.toastVisible = false), duration);
  }
}
