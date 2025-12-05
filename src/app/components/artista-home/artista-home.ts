// src/app/components/artista-home/artista-home.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-artista-home',
  standalone: true,
  templateUrl: './artista-home.html',
  styleUrl: './artista-home.css',
  imports: [CommonModule, RouterModule],
})
export class ArtistaHome implements OnInit {
  perfilCompleto: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Verificar si el usuario está logueado (opcional)
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    // Leer bandera de perfil completo
    const flag = localStorage.getItem('artistaPerfilCompleto');
    this.perfilCompleto = flag === 'true';
  }

  irDatos(): void {
    this.router.navigate(['/artista/datos']);
  }

  irPortafolio(): void {
    if (!this.perfilCompleto) {
      return;
    }
    this.router.navigate(['/artista/portafolio']);
  }

  irPostulaciones(): void {
    if (!this.perfilCompleto) {
      return;
    }
    this.router.navigate(['/artista/postulaciones']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
