import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  onSubmit() {
    if (this.form.valid) {
      const { confirmPassword, ...data } = this.form.value;
      if (this.form.value.password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      this.authService.signup(data).subscribe({
        next: () => {
          alert('Registration successful');
          this.router.navigate(['/login']);
        },
        error: (err) => alert(err.error.message || 'Signup failed'),
      });
    }
  }
}
