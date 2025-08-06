import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoleServiceService } from '../../services/role.service.service';
import { Observable } from 'rxjs';
import { Role } from '../../interfaces/role';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { validationError } from '../../interfaces/validation-error';
import { RegisterRequest } from '../../interfaces/register-request';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    RouterLink,
    MatSnackBarModule
  ],
  templateUrl: './register.component.component.html',
  styleUrls: ['./register.component.component.css']
})
export class RegisterComponent implements OnInit {
  RoleServiceService = inject(RoleServiceService);
  AuthService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  fb = inject(FormBuilder);
  router = inject(Router);

  roles$!: Observable<Role[]>;
  confirmPasswordHide = true;
  errors: validationError[] = [];

  registerForm!: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        emailAddress: ['', [Validators.required, Validators.email]],
        fullName: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
        roles: [[], [Validators.required]]
      },
      {
        validators: this.passwordMatchValidator
      }
    );

    this.roles$ = this.RoleServiceService.getRoles();
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const registerData: RegisterRequest = {
      emailAddress: this.registerForm.value.emailAddress,
      fullName: this.registerForm.value.fullName,
      password: this.registerForm.value.password,
      roles: this.registerForm.value.roles
    };

    this.AuthService.register(registerData).subscribe({
      next: (response) => {
        this.errors = [];
        this.matSnackBar.open(response.message || 'Registration successful', 'Close', {
          duration: 5000,
          horizontalPosition: 'center'
        });
        this.router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400 && error.error?.errors) {
          this.errors = error.error.errors;
        } else {
          this.matSnackBar.open('An error occurred. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center'
          });
        }
      }
    });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }
}
