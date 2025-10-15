import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { AboutUs } from "../about-us/about-us";
import { Movies } from "../movies/movies";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AboutUs, Movies],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent{
  // movies: any[] = [];
  // filteredMovies: any[] = [];
  // searchControl = new FormControl('');
  // isDark = true;

  // private moviesService = inject(MoviesService);
  // private router = inject(Router);

  // ngOnInit() {
  //   const saved = localStorage.getItem('theme');
  //   this.isDark = saved ? saved === 'dark' : true;
  //   this.applyTheme();

  //   this.loadMovies();

  //   this.searchControl.valueChanges.subscribe((term) => {
  //     this.filterMovies(term ?? '');
  //   });
  // }

  // loadMovies() {
  //   this.moviesService.getAll().subscribe({
  //     next: (res) => {
  //       this.movies = res.movies;
  //       this.filteredMovies = [...this.movies];
  //     },
  //     error: (err) => console.error(err),
  //   });
  // }

  // filterMovies(term: string) {
  //   if (!term) {
  //     this.filteredMovies = [...this.movies];
  //   } else {
  //     const lower = term.toLowerCase();
  //     this.filteredMovies = this.movies.filter(
  //       (m) =>
  //         m.title.toLowerCase().includes(lower) ||
  //         (m.genre && m.genre.some((g: string) => g.toLowerCase().includes(lower)))
  //     );
  //   }
  // }

  // addToWatchlist(movie: any, event: Event) {
  //   event.stopPropagation();
  //   this.moviesService.addToWatchlist(movie._id).subscribe({
  //     next: () => (movie.inWatchlist = true),
  //     error: (err) => console.error('Watchlist error:', err),
  //   });
  // }

  // goToMovie(movie: any) {
  //   this.router.navigate(['/movie', movie._id]);
  // }

  // toggleTheme() {
  //   this.isDark = !this.isDark;
  //   localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
  //   this.applyTheme();
  // }

  // applyTheme() {
  //   document.body.classList.toggle('bg-dark', this.isDark);
  //   document.body.classList.toggle('text-light', this.isDark);
  //   document.body.classList.toggle('bg-light', !this.isDark);
  //   document.body.classList.toggle('text-dark', !this.isDark);
  // }
}
