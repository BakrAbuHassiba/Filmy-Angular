import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { UserService } from '../../services/user.service';

interface Movie {
  _id: string;
  title: string;
  genre?: string | string[];
  image?: string;
  releaseYear?: number;
  duration?: number;
  rating?: number;
  description?: string;
  isWatchlist?: boolean;
}

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details.html',
  styleUrls: ['./movie-details.css'],
})
export class MovieDetails implements OnInit {
  movie: Movie | null = null;
  loading = true;

  private route = inject(ActivatedRoute);
  private moviesService = inject(MoviesService);
  private userService = inject(UserService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.moviesService.getMovieById(id).subscribe({
        next: (res: any) => {
          this.movie = res.movie || res;

          // Check if movie is already in watchlist
          const watchlistData = localStorage.getItem('watchlist');
          const watchlist: Movie[] = watchlistData ? JSON.parse(watchlistData) : [];
          if (this.movie && watchlist.find(m => m._id === this.movie!._id)) {
            this.movie.isWatchlist = true;
          }

          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading movie', err);
          this.loading = false;
        },
      });
    }
  }

  toggleWatchlist() {
    if (!this.movie) return;

    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!user || !token) {
      alert('Login required');
      return;
    }

    const watchData = localStorage.getItem('watchlist');
    let watchlist: Movie[] = watchData ? JSON.parse(watchData) : [];

    const exists = watchlist.find(m => m._id === this.movie!._id);

    if (exists) {
      watchlist = watchlist.filter(m => m._id !== this.movie!._id);
      this.movie.isWatchlist = false;
      alert(`Removed "${this.movie.title}" from your watchlist`);
    } else {
      watchlist.push(this.movie);
      this.movie.isWatchlist = true;
      alert(`Added "${this.movie.title}" to your watchlist`);
    }

    // Update localStorage and UserService
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    this.userService.updateWatchlist(watchlist);
  }
}
