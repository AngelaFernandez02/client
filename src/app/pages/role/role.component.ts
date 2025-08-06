import { Component, inject } from '@angular/core';
import { RoleFormComponent } from '../../components/role-form/role-form.component';
import { RoleServiceService } from '../../services/role.service.service';
import { RoleCreateRequest } from '../../interfaces/role-create-request';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RoleListComponent } from '../../components/role-list/role-list.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../interfaces/role';
import { UserDetail } from '../../interfaces/user-detail'; // asegúrate que existe

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    RoleFormComponent,
    MatSnackBarModule,
    AsyncPipe,
    RoleListComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    CommonModule
  ],
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent {
  private roleService = inject(RoleServiceService);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  roles$ = this.roleService.getRoles();
  users$ = this.authService.getAll();

  role: RoleCreateRequest = { roleName: '' };
  errorMessage = '';
  selectedUser: string = '';
  selectedRole: string = '';

  createRole(role: RoleCreateRequest) {
    this.errorMessage = '';

    this.roleService.createRole(role).subscribe({
      next: (response: { message: string }) => {
        this.snackBar.open('Role created successfully', 'Ok', { duration: 3000 });
        this.role.roleName = '';
        this.roles$ = this.roleService.getRoles(); // recargar roles
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.status === 400 ? error.error : 'An unexpected error occurred.';
      }
    });
  }

  deleteRole(id: string) {
    this.roleService.delete(id).subscribe({
      next: () => {
        this.roles$ = this.roleService.getRoles();
        this.snackBar.open('Role deleted successfully', 'Close', { duration: 3000 });
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open('Error deleting role', 'Close', { duration: 3000 });
        console.error(error);
      }
    });
  }

  assignRole() {
    this.roleService.assignRole(this.selectedUser, this.selectedRole).subscribe({
      next: () => {
        this.snackBar.open('Role assigned successfully', 'Close', { duration: 3000 });
        this.selectedUser = '';
        this.selectedRole = '';
        this.roles$ = this.roleService.getRoles();
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open('Error assigning role', 'Close', { duration: 3000 });
        console.error(error);
      }
    });
  }

  trackByUserId(index: number, user: UserDetail): string {
    return user.id;
  }

  trackByRoleId(index: number, role: Role): string {
    return role.id;
  }
}
