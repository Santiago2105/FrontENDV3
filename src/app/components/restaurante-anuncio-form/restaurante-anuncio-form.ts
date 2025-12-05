// src/app/components/restaurante-anuncio-form/restaurante-anuncio-form.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Anuncio } from '../../model/anuncio.model';
import { Evento } from '../../model/evento.model';
import { Restaurante } from '../../model/restaurante.model';

import { AnuncioService } from '../../services/anuncio.service';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'app-restaurante-anuncio-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restaurante-anuncio-form.html',
  styleUrl: './restaurante-anuncio-form.css',
})
export class RestauranteAnuncioForm implements OnInit {
  anuncio: Anuncio = {
    titulo: '',
    descripcion: '',
    generoBuscado: '',
    ubicacion: '',
    presupuesto: '',
    activo: true,
    fechaCreacion: undefined,
    fechaEvento: '',
    eventoId: 0,
  };

  eventos: Evento[] = [];
  restaurante!: Restaurante;

  loading = true;
  saving = false;
  error = '';
  mensaje = '';

  modoEdicion = false;
  anuncioId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private anuncioService: AnuncioService,
    private eventoService: EventoService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  get tituloForm(): string {
    return this.modoEdicion ? 'Editar anuncio' : 'Crear anuncio';
  }

  private inicializarFormulario(): void {
    const storedPerfil = localStorage.getItem('restaurantePerfil');

    if (!storedPerfil) {
      this.error = 'Primero completa tu perfil de restaurante.';
      this.loading = false;
      return;
    }

    this.restaurante = JSON.parse(storedPerfil) as Restaurante;

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.modoEdicion = true;
      this.anuncioId = Number(idParam);
    } else {
      this.modoEdicion = false;
    }

    // 1️⃣ Cargar eventos del restaurante
    const restId = this.restaurante.id;
    if (!restId) {
      this.error = 'No se pudo identificar el restaurante.';
      this.loading = false;
      return;
    }

    this.eventoService.getByRestaurante(restId).subscribe({
      next: (evs: Evento[]) => {
        this.eventos = evs || [];

        if (!this.modoEdicion) {
          // Nuevo anuncio ⇒ valores por defecto
          this.prepararNuevo();
          this.loading = false;
        } else if (this.anuncioId) {
          // Edición ⇒ cargar anuncio
          this.cargarAnuncio(this.anuncioId);
        } else {
          this.loading = false;
        }
      },
      error: (err: any) => {
        console.error('Error al cargar eventos del restaurante', err);
        this.error = 'No se pudieron cargar los eventos del restaurante.';
        this.loading = false;
      },
    });
  }

  private prepararNuevo(): void {
    // fechaEvento por defecto = hoy
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');

    this.anuncio.fechaEvento = `${yyyy}-${mm}-${dd}`;
    this.anuncio.activo = true;

    if (this.eventos.length > 0 && this.eventos[0].id != null) {
      this.anuncio.eventoId = this.eventos[0].id!;
    }
  }

  private cargarAnuncio(id: number): void {
    this.anuncioService.getById(id).subscribe({
      next: (a: Anuncio) => {
        this.anuncio = { ...a };
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar anuncio', err);
        this.error = 'No se pudo cargar el anuncio.';
        this.loading = false;
      },
    });
  }

  onSubmit(form: NgForm): void {
    this.error = '';
    this.mensaje = '';

    if (form.invalid) {
      this.error = 'Completa todos los campos obligatorios.';
      return;
    }

    if (!this.anuncio.eventoId || this.anuncio.eventoId === 0) {
      this.error = 'Selecciona un evento asociado para el anuncio.';
      return;
    }

    this.saving = true;

    if (this.modoEdicion && this.anuncioId) {
      this.actualizarAnuncio();
    } else {
      this.crearAnuncio();
    }
  }

  private crearAnuncio(): void {
    this.anuncioService.create(this.anuncio).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/restaurante/anuncios']);
      },
      error: (err: any) => {
        console.error('Error creando anuncio', err);
        this.saving = false;
        this.error = 'No se pudo crear el anuncio.';
      },
    });
  }

  private actualizarAnuncio(): void {
    if (!this.anuncioId) return;

    this.anuncioService.update(this.anuncioId, this.anuncio).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/restaurante/anuncios']);
      },
      error: (err: any) => {
        console.error('Error actualizando anuncio', err);
        this.saving = false;
        this.error = 'No se pudo actualizar el anuncio.';
      },
    });
  }


  cancelar(): void {
    this.router.navigate(['/restaurante/anuncios']);
  }
}
