import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pages-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pages-account.component.html',
  styleUrl: './pages-account.component.css'
})
export class PagesAccountComponent {

  AuthService = inject(AuthService)
  accountDetail$ = this.AuthService.getDetail();
}
