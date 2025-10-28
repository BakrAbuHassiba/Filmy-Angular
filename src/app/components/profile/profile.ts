import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

interface Movie {
  _id: string;
  title: string;
  image?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  user: User | null = null;
  favorites: Movie[] = [];
  watchlist: Movie[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    this.user = userData ? JSON.parse(userData) : null;

    if (this.user) {
      this.favorites = this.userService.getFavoritesFromStorage();
      this.watchlist = this.userService.getWatchlistFromStorage();
    }

    this.userService.favorites$.subscribe(f => this.favorites = f);
    this.userService.watchlist$.subscribe(w => this.watchlist = w);
  }

  removeFavorite(index: number) {
    this.favorites.splice(index, 1);
    this.userService.updateFavorites(this.favorites);
  }

  removeWatchlist(index: number) {
    this.watchlist.splice(index, 1);
    this.userService.updateWatchlist(this.watchlist);
  }
}
