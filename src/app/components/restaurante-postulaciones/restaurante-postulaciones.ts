// src/app/components/restaurante-postulaciones/restaurante-postulaciones.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Restaurante } from '../../model/restaurante.model';
import { Evento } from '../../model/evento.model';
import { Anuncio } from '../../model/anuncio.model';
import { Postulacion } from '../../model/postulacion.model';

import { RestauranteService } from '../../services/restaurante.service';
import { EventoService } from '../../services/evento.service';
import { AnuncioService } from '../../services/anuncio.service';
import { PostulacionService } from '../../services/postulacion.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-restaurante-postulaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurante-postulaciones.html',
  styleUrl: './restaurante-postulaciones.css',
})
export class RestaurantePostulaciones implements OnInit {
  restaurante: Restaurante | null = null;
  eventos: Evento[] = [];
  anuncios: Anuncio[] = [];
  postulaciones: Postulacion[] = [];

  loading = true;
  error = '';
  mensaje = '';

  constructor(
    private restauranteService: RestauranteService,
    private eventoService: EventoService,
    private anuncioService: AnuncioService,
    private postulacionService: PostulacionService
  ) {}

  ngOnInit(): void {
    this.cargarPostulaciones();
  }

  private cargarPostulaciones(): void {
    this.loading = true;
    this.error = '';
    this.mensaje = '';
    this.eventos = [];
    this.anuncios = [];
    this.postulaciones = [];

    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      this.error = 'No se encontró el usuario. Inicia sesión nuevamente.';
      this.loading = false;
      return;
    }

    const usuarioId = Number(storedUserId);

    // 1️⃣ Restaurante del usuario
    this.restauranteService.findByUsuario(usuarioId).subscribe({
      next: (rest) => {
        if (!rest || !rest.id) {
          this.mensaje = 'Aún no has registrado el perfil de tu restaurante.';
          this.loading = false;
          return;
        }

        this.restaurante = rest;

        // 2️⃣ Eventos del restaurante -> /eventos/restaurante/{id}
        this.eventoService.getByRestaurante(rest.id).subscribe({
          next: (eventos) => {
            this.eventos = eventos || [];

            if (this.eventos.length === 0) {
              this.mensaje = 'Aún no tienes eventos registrados.';
              this.loading = false;
              return;
            }

            // 3️⃣ Anuncios por evento -> /anuncios/evento/{id}
            const anunciosRequests = this.eventos
              .filter((e) => !!e.id)
              .map((e) => this.anuncioService.getByEvento(e.id!));

            forkJoin(anunciosRequests).subscribe({
              next: (anunciosPorEvento) => {
                this.anuncios = anunciosPorEvento.flat();

                if (this.anuncios.length === 0) {
                  this.mensaje =
                    'No hay anuncios publicados para tus eventos todavía.';
                  this.loading = false;
                  return;
                }

                // 4️⃣ Postulaciones por anuncio -> /postulaciones/anuncio/{id}
                const postulacionesRequests = this.anuncios
                  .filter((a) => !!a.id)
                  .map((a) =>
                    this.postulacionService.getByAnuncio(a.id!)
                  );

                forkJoin(postulacionesRequests).subscribe({
                  next: (postPorAnuncio) => {
                    this.postulaciones = postPorAnuncio.flat();

                    if (this.postulaciones.length === 0) {
                      this.mensaje =
                        'Aún no has recibido postulaciones de artistas.';
                    }
                    this.loading = false;
                  },
                  error: (err) => {
                    console.error('Error al obtener postulaciones', err);
                    this.error =
                      'No se pudieron cargar las postulaciones.';
                    this.loading = false;
                  },
                });
              },
              error: (err) => {
                console.error('Error al obtener anuncios por evento', err);
                this.error = 'No se pudieron cargar los anuncios.';
                this.loading = false;
              },
            });
          },
          error: (err) => {
            console.error('Error al obtener eventos del restaurante', err);
            this.error =
              'No se pudieron cargar los eventos del restaurante.';
            this.loading = false;
          },
        });
      },
      error: (err) => {
        console.error('Error al obtener restaurante por usuario', err);
        this.error = 'No se pudo obtener el restaurante asociado al usuario.';
        this.loading = false;
      },
    });
  }
}
