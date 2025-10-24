import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  searchTerm: string = '';
  menuOpen = false;
  dropdownOpen = false;
    isDark = true;


  constructor(private router: Router) {}


  get isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  goToGenre(genre: string) {
    this.router.navigate(['/movies', genre]);
  }

  onSearchChange() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/movies'], {
        queryParams: { search: this.searchTerm },
      });
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      this.dropdownOpen = false;
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeMenu() {
    this.menuOpen = false;
    this.dropdownOpen = false;
  }
}
