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
    // ✅ 1) Listen for /movies/:genre (URL param)
    this.route.paramMap.subscribe((params) => {
      const g = params.get('genre');
      if (g) {
        this.genre = g;
        this.searchTerm = null; // reset search
        this.loadMovies();
      }
    });

    // ✅ 2) Listen for ?search= (Query param)
    this.route.queryParamMap.subscribe((q) => {
      const s = q.get('search');
      if (s !== null) {
        this.searchTerm = s;
        this.genre = null; // reset genre
        this.loadMovies();
      }
    });

    // ✅ If no param at all (direct /movies)
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

  goToMovie(id: string) {
    this.router.navigate(['/movieDetails', id]);
  }
}
