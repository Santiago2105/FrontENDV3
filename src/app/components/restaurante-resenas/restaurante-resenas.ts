// src/app/components/restaurante-resenas/restaurante-resenas.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Resenia } from '../../model/resenia.model';
import { Restaurante } from '../../model/restaurante.model';
import { Evento } from '../../model/evento.model';

import { ReseniaService } from '../../services/resenia.service';
import { RestauranteService } from '../../services/restaurante.service';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'app-restaurante-resenas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurante-resenas.html',
  styleUrl: './restaurante-resenas.css',
})
export class RestauranteResenas implements OnInit {
  resenias: Resenia[] = [];

  loading = true;
  error = '';
  mensaje = '';

  restaurante!: Restaurante;

  constructor(
    private reseniaService: ReseniaService,
    private restauranteService: RestauranteService,
    private eventoService: EventoService
  ) {}

  ngOnInit(): void {
    this.cargarResenias();
  }

  private cargarResenias(): void {
    this.loading = true;
    this.error = '';
    this.mensaje = '';
    this.resenias = [];

    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      this.error = 'No se encontró el usuario. Inicia sesión nuevamente.';
      this.loading = false;
      return;
    }

    const usuarioId = Number(storedUserId);

    // 1️⃣ Obtener el restaurante asociado al usuario
    this.restauranteService.findByUsuario(usuarioId).subscribe({
      next: (rest) => {
        if (!rest || !rest.id) {
          this.mensaje =
            'Aún no has registrado el perfil de tu restaurante.';
          this.loading = false;
          return;
        }

        this.restaurante = rest;

        // 2️⃣ Obtener los eventos del restaurante
        this.eventoService.getByRestaurante(rest.id).subscribe({
          next: (eventos: Evento[]) => {
            if (!eventos || eventos.length === 0) {
              this.mensaje =
                'Aún no has realizado eventos, por lo que no tienes reseñas.';
              this.loading = false;
              return;
            }

            // 3️⃣ Para cada evento, obtener sus reseñas
            let pendientes = eventos.length;

            eventos.forEach((ev) => {
              this.reseniaService.getByEvento(ev.id!).subscribe({
                next: (rs) => {
                  if (rs && rs.length > 0) {
                    this.resenias.push(...rs);
                  }

                  pendientes--;
                  if (pendientes === 0) {
                    if (this.resenias.length === 0) {
                      this.mensaje =
                        'No se han registrado reseñas para tus eventos.';
                    }

                    // Ordenar por fecha (más recientes primero)
                    this.resenias.sort(
                      (a, b) =>
                        new Date(b.fechaResenia).getTime() -
                        new Date(a.fechaResenia).getTime()
                    );

                    this.loading = false;
                  }
                },
                error: () => {
                  pendientes--;
                  if (pendientes === 0) {
                    this.loading = false;
                  }
                },
              });
            });
          },
          error: () => {
            this.error = 'No se pudieron cargar los eventos del restaurante.';
            this.loading = false;
          },
        });
      },
      error: () => {
        this.error =
          'No se pudo obtener el restaurante asociado al usuario.';
        this.loading = false;
      },
    });
  }
}
