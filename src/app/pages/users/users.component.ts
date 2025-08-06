import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AsyncPipe,CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  AuthService = inject(AuthService)
  user$=this.AuthService.getAll();


}
