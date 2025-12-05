// src/app/components/restaurante-eventos/restaurante-eventos.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Restaurante } from '../../model/restaurante.model';
import { Evento } from '../../model/evento.model';

import { RestauranteService } from '../../services/restaurante.service';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'app-restaurante-eventos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurante-eventos.html',
  styleUrl: './restaurante-eventos.css',
})
export class RestauranteEventos implements OnInit {
  restaurante: Restaurante | null = null;
  eventos: Evento[] = [];

  loading = true;
  error = '';
  mensaje = '';

  constructor(
    private restauranteService: RestauranteService,
    private eventoService: EventoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEventos();
  }

  private cargarEventos(): void {
    this.loading = true;
    this.error = '';
    this.mensaje = '';
    this.eventos = [];

    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      this.error = 'No se encontró el usuario. Inicia sesión nuevamente.';
      this.loading = false;
      return;
    }

    const usuarioId = Number(storedUserId);

    // 1️⃣ Obtener el restaurante asociado al usuario (un solo restaurante)
    this.restauranteService.findByUsuario(usuarioId).subscribe({
      next: (restaurante) => {
        if (!restaurante) {
          this.mensaje = 'Aún no has registrado el perfil de tu restaurante.';
          this.loading = false;
          return;
        }

        this.restaurante = restaurante;

        if (!this.restaurante.id) {
          this.mensaje = 'No se encontró el identificador del restaurante.';
          this.loading = false;
          return;
        }

        // Obtener eventos del restaurante
        this.eventoService.getByRestaurante(this.restaurante.id).subscribe({
          next: (eventos) => {
            this.eventos = eventos || [];
            if (this.eventos.length === 0) {
              this.mensaje = 'Aún no has registrado eventos para tu restaurante.';
            }
            this.loading = false;
          },
          error: (err) => {
            console.error('Error al obtener eventos del restaurante', err);
            this.error = 'No se pudieron cargar los eventos del restaurante.';
            this.loading = false;
          },
        });
      },
      error: (err) => {
        console.error('Error al obtener restaurante por usuarioId', err);
        this.error = 'No se pudo obtener el restaurante asociado al usuario.';
        this.loading = false;
      },
    });
  }

  crearEvento(): void {
    this.router.navigate(['/restaurante/eventos/crear']);
  }

  editarEvento(id?: number): void {
    if (!id) return;
    this.router.navigate(['/restaurante/eventos/editar', id]);
  }

  eliminarEvento(id?: number): void {
    if (!id) return;
    const confirmado = confirm('¿Seguro que deseas eliminar este evento?');
    if (!confirmado) return;

    this.eventoService.delete(id).subscribe({
      next: () => {
        this.eventos = this.eventos.filter((e) => e.id !== id);
        if (this.eventos.length === 0) {
          this.mensaje = 'No tienes eventos registrados actualmente.';
        }
      },
      error: (err) => {
        console.error('Error al eliminar evento', err);
        this.error = 'No se pudo eliminar el evento.';
      },
    });
  }

  recargar(): void {
    this.cargarEventos();
  }
}
