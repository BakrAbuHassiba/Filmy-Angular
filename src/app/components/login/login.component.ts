import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe({
        next: (res: any) => {
          // ✅ unified naming
          const token = res.token || res.tkn;
          if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('userId', res.user?._id || '');
            localStorage.setItem('user', JSON.stringify(res.user));
          }

          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Login error:', err);
          alert(err?.error?.message || 'Login failed. Please try again.');
        },
      });
    }
  }
}
