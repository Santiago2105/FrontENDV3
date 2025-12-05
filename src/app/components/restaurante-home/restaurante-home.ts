import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-restaurante-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './restaurante-home.html',
  styleUrl: './restaurante-home.css',
})
export class RestauranteHome {
  constructor(private router: Router) {}

  ir(ruta: string): void {
    this.router.navigate(['/restaurante', ruta]);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
