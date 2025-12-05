// src/app/components/restaurante-anuncios/restaurante-anuncios.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Anuncio } from '../../model/anuncio.model';
import { Restaurante } from '../../model/restaurante.model';
import { Evento } from '../../model/evento.model';

import { AnuncioService } from '../../services/anuncio.service';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'app-restaurante-anuncios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurante-anuncios.html',
  styleUrl: './restaurante-anuncios.css',
})
export class RestauranteAnuncios implements OnInit {
  anuncios: Anuncio[] = [];
  restaurante!: Restaurante;
  loading = true;
  error = '';

  constructor(
    private anuncioService: AnuncioService,
    private eventoService: EventoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedPerfil = localStorage.getItem('restaurantePerfil');

    if (!storedPerfil) {
      this.error = 'Primero completa tu perfil de restaurante.';
      this.loading = false;
      return;
    }

    this.restaurante = JSON.parse(storedPerfil) as Restaurante;

    this.cargarAnuncios();
  }

  private cargarAnuncios(): void {
    this.loading = true;
    this.error = '';

    const restId = this.restaurante.id;
    if (!restId) {
      this.error = 'No se pudo identificar el restaurante.';
      this.loading = false;
      return;
    }

    // 1️⃣ Obtener eventos del restaurante
    this.eventoService.getByRestaurante(restId).subscribe({
      next: (eventos: Evento[]) => {
        const eventoIds = (eventos || [])
          .map((e) => e.id)
          .filter((id): id is number => id != null);

        if (eventoIds.length === 0) {
          this.anuncios = [];
          this.loading = false;
          return;
        }

        // 2️⃣ Obtener todos los anuncios y filtrarlos por esos eventos
        this.anuncioService.listAll().subscribe({
          next: (anuncios: Anuncio[]) => {
            this.anuncios =
              anuncios.filter((a) => eventoIds.includes(a.eventoId)) ?? [];
            this.loading = false;
          },
          error: (err: any) => {
            console.error('Error al cargar anuncios:', err);
            this.error = 'No se pudieron cargar los anuncios.';
            this.loading = false;
          },
        });
      },
      error: (err: any) => {
        console.error('Error al cargar eventos del restaurante:', err);
        this.error = 'No se pudieron obtener los eventos del restaurante.';
        this.loading = false;
      },
    });
  }

  crearAnuncio(): void {
    this.router.navigate(['/restaurante/anuncios/crear']);
  }

  editarAnuncio(id?: number): void {
    if (!id) return;
    this.router.navigate(['/restaurante/anuncios/editar', id]);
  }

  eliminarAnuncio(id?: number): void {
    if (!id) return;
    if (!confirm('¿Deseas eliminar este anuncio?')) return;

    this.anuncioService.delete(id).subscribe({
      next: () => {
        this.anuncios = this.anuncios.filter((a) => a.id !== id);
      },
      error: (err: any) => {
        console.error('Error eliminando anuncio:', err);
        this.error = 'No se pudo eliminar el anuncio.';
      },
    });
  }
}
