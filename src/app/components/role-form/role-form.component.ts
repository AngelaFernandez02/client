import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { RoleCreateRequest } from '../../interfaces/role-create-request';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.css']
})
export class RoleFormComponent {
  @Input() errorMessage: string = '';
  @Input() role!: RoleCreateRequest;

  @Output() addRole: EventEmitter<RoleCreateRequest> = new EventEmitter<RoleCreateRequest>();

  add() {
    if (this.role && this.role.roleName) {
      this.addRole.emit(this.role);
    }
  }
}
