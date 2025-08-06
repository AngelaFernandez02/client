import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [FormsModule,MatSnackBarModule,MatIconModule, MatIcon,CommonModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  email!:string;
  AuthService=inject(AuthService);
  MatSnackBar = inject(MatSnackBar);
  isSubmitting=false;
  showEmailSent=false;




 forgetPassword() {
  this.isSubmitting = true;

  this.AuthService.forgotPassword(this.email).subscribe({
    next: (response) => {
      if (response.isSuccess) {
        this.MatSnackBar.open(response.message, 'Close', {
          duration: 5000,
        });
        this.showEmailSent = true;
      } else {
        this.MatSnackBar.open(response.message, 'Close', {
          duration: 5000,
        });
      }
    },
    error: (err) => {
      console.error(err);
      this.MatSnackBar.open('Error sending reset email.', 'Close', {
        duration: 5000,
      });
    },
    complete: () => {
      this.isSubmitting = false;
    }
  });
}

}