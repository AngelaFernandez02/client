import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule,MatSnackBarModule,FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  newPassword!:string;
  currentPassword!:string;
  AuthService=inject(AuthService);
  MatSnackBar = inject(MatSnackBar);
  router = inject(Router);

  changePassword() {
  this.AuthService.changePassword({
    email: this.AuthService.getUserDetail()?.email,
    newPassword: this.newPassword,
    currentPassword: this.currentPassword
  }).subscribe({
    next: (response) => {
      if (response.isSuccess) {
        this.MatSnackBar.open(response.message, "Close", {
          duration: 3000,
        });
        this.AuthService.logout();
        this.router.navigate(['/login']);
      } else {
        this.MatSnackBar.open(response.message, "Close", {
          duration: 3000,
        });
      }
    },
    error: (error: HttpErrorResponse) => {
      this.MatSnackBar.open("An error occurred. Please try again.", "Close", {
        duration: 3000,
      });
      console.error(error);
    }
  });
}

  }


