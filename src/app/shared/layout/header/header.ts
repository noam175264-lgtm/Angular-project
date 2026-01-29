import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { selectIsLoggedIn } from '../../../auth/store/selectors';
import { LOGOUT } from '../../../auth/store/action';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private store = inject(Store);
  private router = inject(Router);
  isLoggedIn$ = this.store.select(selectIsLoggedIn);

  logout(): void {
    this.store.dispatch(LOGOUT());
    sessionStorage.removeItem('token');
    localStorage.removeItem('name');
    this.router.navigate(['/login']);
  }

  getName(): string {
    return localStorage.getItem('name') || 'Guest';
  }
}