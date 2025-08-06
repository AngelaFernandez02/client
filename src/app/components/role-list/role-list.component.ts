import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Role } from '../../interfaces/role';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, NgFor],
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent {
@Input() roles: Role[] | null = [];
  @Output() deleteRole = new EventEmitter<string>();

  delete(id: string) {
    this.deleteRole.emit(id);
  }

  trackById(index: number, role: Role) {
    return role.id;
  }
}
