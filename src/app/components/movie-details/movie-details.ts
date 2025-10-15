import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetails implements OnInit {
  movie: any = null;
  loading = true;
  private route = inject(ActivatedRoute);
  private moviesService = inject(MoviesService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.moviesService.getMovieById(id).subscribe({
        next: (res: any) => {
          this.movie = res.movie || res; // depends on backend structure
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading movie', err);
          this.loading = false;
        },
      });
    }
  }
}
