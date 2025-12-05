// src/app/components/restaurante-panel/restaurante-panel.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestauranteService } from '../../services/restaurante.service';
import { Restaurante } from '../../model/restaurante.model';

@Component({
  selector: 'app-restaurante-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restaurante-panel.html',
  styleUrl: './restaurante-panel.css',
})
export class RestaurantePanel implements OnInit {
  restauranteId?: number;

  nombre = '';
  direccion = '';
  ciudad = '';
  aforoMesas: number | null = null;

  mensaje = '';
  error = '';
  loading = false;

  constructor(private restauranteService: RestauranteService) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  private cargarPerfil(): void {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      this.error = 'No se encontró el usuario. Inicia sesión nuevamente.';
      return;
    }

    const usuarioId = Number(storedUserId);
    this.loading = true;

    this.restauranteService.findByUsuario(usuarioId).subscribe({
      next: (rest) => {
        if (rest) {
          this.restauranteId = rest.id;
          this.nombre = rest.nombre;
          this.direccion = rest.direccion;
          this.ciudad = rest.ciudad;
          this.aforoMesas = rest.aforoMesas;

          localStorage.setItem('restaurantePerfil', JSON.stringify(rest));
          localStorage.setItem('restaurantePerfilCompleto', 'true');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar perfil de restaurante', err);
        this.error = 'No se pudo cargar el perfil del restaurante.';
        this.loading = false;
      },
    });
  }

  guardarPerfil(): void {
    this.mensaje = '';
    this.error = '';

    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      this.error = 'No se encontró el usuario. Inicia sesión nuevamente.';
      return;
    }

    if (!this.nombre || !this.direccion || !this.ciudad) {
      this.error = 'Por favor completa todos los campos obligatorios.';
      return;
    }

    if (this.aforoMesas != null && this.aforoMesas < 0) {
      this.error = 'El aforo de mesas no puede ser negativo.';
      return;
    }

    const usuarioId = Number(storedUserId);

    const body: Restaurante = {
      id: this.restauranteId,
      nombre: this.nombre,
      direccion: this.direccion,
      ciudad: this.ciudad,
      aforoMesas: this.aforoMesas ?? 0,
      usuarioId,
    };

    this.loading = true;

    const request$ = this.restauranteId
      ? this.restauranteService.update(body)
      : this.restauranteService.create(body);

    request$.subscribe({
      next: (res) => {
        this.restauranteId = res.id;
        this.mensaje = 'Perfil de restaurante guardado correctamente.';

        localStorage.setItem('restaurantePerfil', JSON.stringify(res));
        localStorage.setItem('restaurantePerfilCompleto', 'true');

        this.loading = false;
      },
      error: (err) => {
        console.error('Error al guardar perfil de restaurante', err);
        this.error = 'Ocurrió un error al guardar el perfil de restaurante.';
        this.loading = false;
      },
    });
  }
}
