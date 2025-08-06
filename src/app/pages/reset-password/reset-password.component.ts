import { Component, inject, OnInit } from '@angular/core';
import { ResetPasswordRequest } from '../../interfaces/reset-password-request';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule, MatSnackBarModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordRequest: ResetPasswordRequest = {
    email: '',
    token: '',
    newPassword: ''
  };
  
  isLoading = false;
  passwordResetSuccess = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    this.resetPasswordRequest.email = params['email'] || '';
    this.resetPasswordRequest.token = decodeURIComponent(params['token'] || '');
    console.log('Token recibido:', this.resetPasswordRequest.token);
  });
}

  onSubmit(): void {
    if (!this.resetPasswordRequest.email || !this.resetPasswordRequest.token || !this.resetPasswordRequest.newPassword) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 5000 });
      return;
    }

    this.isLoading = true;
    
    this.authService.resetPassword(this.resetPasswordRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.passwordResetSuccess = true;
        this.snackBar.open(response.message || 'Password reset successfully!', 'Close', { 
          duration: 5000,
          panelClass: ['success-snackbar'] 
        });
        
        setTimeout(() => this.router.navigate(['/login']), 5000);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        const errorMessage = error.error?.message || 'An error occurred while resetting password.';
        this.snackBar.open(errorMessage, 'Close', { 
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        console.error('Reset password error:', error);
      }
    });
  }
}