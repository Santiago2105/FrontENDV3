// src/app/components/artista-portafolio/artista-portafolio.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PortafolioService } from '../../services/portafolio.service';
import { Portafolio } from '../../model/portafolio.model';

@Component({
  selector: 'app-artista-portafolio',
  standalone: true,
  templateUrl: './artista-portafolio.html',
  styleUrl: './artista-portafolio.css',
  imports: [CommonModule, FormsModule],
})
export class ArtistaPortafolio implements OnInit {
  portafolios: Portafolio[] = [];

  // campos del formulario
  nuevoTitulo: string = '';
  nuevoTipo: string = '';
  nuevoUrl: string = '';

  mensaje: string = '';
  error: string = '';
  loading: boolean = false;

  artistaId?: number;
  editandoId: number | null = null;

  constructor(
    private portafolioService: PortafolioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedPerfil = localStorage.getItem('artistaPerfil');
    if (!storedPerfil) {
      this.error =
        'Primero completa tu perfil de artista antes de gestionar tu portafolio.';
      return;
    }

    try {
      const perfil = JSON.parse(storedPerfil);
      this.artistaId = perfil.id;

      if (!this.artistaId) {
        this.error =
          'No se encontró el ID del artista. Vuelve a guardar tu perfil.';
        return;
      }

      this.cargarPortafolios();
    } catch (e) {
      console.error('Error parseando artistaPerfil', e);
      this.error = 'Error al leer los datos del artista.';
    }
  }

  cargarPortafolios(): void {
    if (!this.artistaId) return;

    this.loading = true;
    this.portafolioService.listByArtista(this.artistaId).subscribe({
      next: (data) => {
        this.portafolios = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar portafolios', err);
        this.error = 'No se pudo cargar el portafolio.';
        this.loading = false;
      },
    });
  }

  guardarPortafolio(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.artistaId) {
      this.error = 'No se encontró el artista. Vuelve a iniciar sesión.';
      return;
    }

    if (!this.nuevoTitulo || !this.nuevoTipo || !this.nuevoUrl) {
      this.error = 'Título, tipo y URL son obligatorios.';
      return;
    }

    const item: Portafolio = {
      id: this.editandoId ?? undefined,
      titulo: this.nuevoTitulo,
      tipo: this.nuevoTipo,
      url: this.nuevoUrl,
      artistaId: this.artistaId,
    };

    const request$ = this.editandoId
      ? this.portafolioService.update(item)
      : this.portafolioService.create(item);

    request$.subscribe({
      next: (resp) => {
        this.mensaje = this.editandoId
          ? 'Portafolio actualizado correctamente.'
          : 'Portafolio creado correctamente.';

        if (this.editandoId) {
          this.portafolios = this.portafolios.map((p) =>
            p.id === resp.id ? resp : p
          );
        } else {
          this.portafolios.push(resp);
        }

        this.resetFormulario();
      },
      error: (err) => {
        console.error('Error al guardar portafolio', err);
        this.error = 'No se pudo guardar el portafolio.';
      },
    });
  }

  editar(item: Portafolio): void {
    this.mensaje = '';
    this.error = '';

    this.editandoId = item.id ?? null;
    this.nuevoTitulo = item.titulo;
    this.nuevoTipo = item.tipo;
    this.nuevoUrl = item.url;
  }

  eliminar(id: number): void {
    const confirmar = confirm(
      '¿Seguro que deseas eliminar este elemento del portafolio?'
    );
    if (!confirmar) return;

    this.portafolioService.delete(id).subscribe({
      next: () => {
        this.portafolios = this.portafolios.filter((p) => p.id !== id);
        this.mensaje = 'Elemento eliminado correctamente.';
      },
      error: (err) => {
        console.error('Error al eliminar portafolio', err);
        this.error = 'No se pudo eliminar el elemento.';
      },
    });
  }

  resetFormulario(): void {
    this.editandoId = null;
    this.nuevoTitulo = '';
    this.nuevoTipo = '';
    this.nuevoUrl = '';
  }

  irAPerfil(): void {
    this.router.navigate(['/artista/perfil']);
  }
}
