// src/app/components/restaurante-mensajes/restaurante-mensajes.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Restaurante } from '../../model/restaurante.model';
import { Evento } from '../../model/evento.model';
import { Anuncio } from '../../model/anuncio.model';
import { Mensaje } from '../../model/mensaje.model';

import { RestauranteService } from '../../services/restaurante.service';
import { EventoService } from '../../services/evento.service';
import { AnuncioService } from '../../services/anuncio.service';
import { MensajeService } from '../../services/mensaje.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-restaurante-mensajes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurante-mensajes.html',
  styleUrl: './restaurante-mensajes.css',
})
export class RestauranteMensajes implements OnInit {
  restaurante: Restaurante | null = null;
  eventos: Evento[] = [];
  anuncios: Anuncio[] = [];
  mensajes: Mensaje[] = [];

  loading = true;
  error = '';
  mensajeInfo = '';

  constructor(
    private restauranteService: RestauranteService,
    private eventoService: EventoService,
    private anuncioService: AnuncioService,
    private mensajeService: MensajeService
  ) {}

  ngOnInit(): void {
    this.cargarMensajes();
  }

  private cargarMensajes(): void {
    this.loading = true;
    this.error = '';
    this.mensajeInfo = '';
    this.eventos = [];
    this.anuncios = [];
    this.mensajes = [];

    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      this.error = 'No se encontró el usuario. Inicia sesión nuevamente.';
      this.loading = false;
      return;
    }

    const usuarioId = Number(storedUserId);

    // 1) Restaurante del usuario
    this.restauranteService.findByUsuario(usuarioId).subscribe({
      next: (rest) => {
        if (!rest || !rest.id) {
          this.mensajeInfo =
            'Aún no has registrado el perfil de tu restaurante.';
          this.loading = false;
          return;
        }

        this.restaurante = rest;

        // 2) Eventos del restaurante
        this.eventoService.getByRestaurante(rest.id).subscribe({
          next: (eventos) => {
            this.eventos = eventos || [];

            if (this.eventos.length === 0) {
              this.mensajeInfo = 'Aún no tienes eventos registrados.';
              this.loading = false;
              return;
            }

            // 3) Anuncios por evento
            const anunciosRequests = this.eventos
              .filter((e) => !!e.id)
              .map((e) => this.anuncioService.getByEvento(e.id!));

            forkJoin(anunciosRequests).subscribe({
              next: (anunciosPorEvento) => {
                this.anuncios = anunciosPorEvento.flat();

                if (this.anuncios.length === 0) {
                  this.mensajeInfo =
                    'No hay anuncios publicados para tus eventos.';
                  this.loading = false;
                  return;
                }

                // 4) Mensajes por anuncio
                const mensajesRequests = this.anuncios
                  .filter((a) => !!a.id)
                  .map((a) => this.mensajeService.getByAnuncio(a.id!));

                forkJoin(mensajesRequests).subscribe({
                  next: (msgsPorAnuncio) => {
                    this.mensajes = msgsPorAnuncio.flat();

                    if (this.mensajes.length === 0) {
                      this.mensajeInfo =
                        'Aún no has recibido mensajes de artistas.';
                    }
                    this.loading = false;
                  },
                  error: (err) => {
                    console.error('Error al obtener mensajes', err);
                    this.error = 'No se pudieron cargar los mensajes.';
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
