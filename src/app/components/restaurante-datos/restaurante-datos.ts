// src/app/components/restaurante-datos/restaurante-datos.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Restaurante } from '../../model/restaurante.model';
import { RestauranteService } from '../../services/restaurante.service';

@Component({
  selector: 'app-restaurante-datos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './restaurante-datos.html',
  styleUrl: './restaurante-datos.css',
})
export class RestauranteDatos implements OnInit {
  restaurante: Restaurante | null = null;
  error: string = '';

  constructor(private restauranteService: RestauranteService) {}

  ngOnInit(): void {
    this.error = '';

    // Leer desde localStorage
    const storedPerfil = localStorage.getItem('restaurantePerfil');
    if (storedPerfil) {
      try {
        this.restaurante = JSON.parse(storedPerfil) as Restaurante;
        return;
      } catch {
        localStorage.removeItem('restaurantePerfil');
      }
    }

    // Buscar por usuarioId
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      this.error = 'No se encontró el usuario. Inicia sesión nuevamente.';
      return;
    }

    const usuarioId = Number(storedUserId);

    this.restauranteService.findByUsuario(usuarioId).subscribe({
      next: (perfil) => {
        if (perfil) {
          this.restaurante = perfil;
          localStorage.setItem('restaurantePerfil', JSON.stringify(perfil));
          localStorage.setItem('restaurantePerfilCompleto', 'true');
        } else {
          localStorage.removeItem('restaurantePerfilCompleto');
        }
      },
      error: () => {
        this.error = 'No se pudo obtener el perfil del restaurante.';
      },
    });
  }
}
