// src/app/components/restaurante-evento-form/restaurante-evento-form.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Evento } from '../../model/evento.model';
import { Restaurante } from '../../model/restaurante.model';

import { EventoService } from '../../services/evento.service';
import { RestauranteService } from '../../services/restaurante.service';

@Component({
  selector: 'app-restaurante-evento-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restaurante-evento-form.html',
  styleUrl: './restaurante-evento-form.css',
})
export class RestauranteEventoForm implements OnInit {
  evento: Evento = {
    fechaEvento: '',
    cachet: '',
    realizado: false,
    fechaCreacion: undefined,
    restauranteId: 0,
  };

  restaurante: Restaurante | null = null;

  loading = true;
  saving = false;
  error = '';
  mensaje = '';

  modoEdicion = false;
  eventoId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService,
    private restauranteService: RestauranteService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  private inicializarFormulario(): void {
    const storedUserId = localStorage.getItem('userId');

    if (!storedUserId) {
      this.error = 'No se encontró el usuario. Inicia sesión nuevamente.';
      this.loading = false;
      return;
    }

    const usuarioId = Number(storedUserId);

    // 1️⃣ Obtener restaurante asociado al usuario (un solo restaurante)
    this.restauranteService.findByUsuario(usuarioId).subscribe({
      next: (restaurante) => {
        if (!restaurante) {
          this.error =
            'Debes completar el perfil de tu restaurante antes de crear eventos.';
          this.loading = false;
          return;
        }

        this.restaurante = restaurante;

        if (!this.restaurante.id) {
          this.error = 'No se pudo identificar el restaurante.';
          this.loading = false;
          return;
        }

        // Asociar el restauranteId al evento
        this.evento.restauranteId = this.restaurante.id;

        // Ver si estamos en modo edición
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
          this.modoEdicion = true;
          this.eventoId = Number(idParam);
          this.cargarEvento(this.eventoId);
        } else {
          this.modoEdicion = false;
          this.prepararNuevo();
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error al obtener restaurante por usuarioId', err);
        this.error = 'No se pudo obtener el restaurante asociado al usuario.';
        this.loading = false;
      },
    });
  }

  private cargarEvento(id: number): void {
    this.eventoService.getById(id).subscribe({
      next: (ev) => {
        if (!this.restaurante || !this.restaurante.id) {
          this.error = 'No se pudo identificar el restaurante.';
          this.loading = false;
          return;
        }

        this.evento = {
          ...ev,
          // Nos aseguramos que quede ligado al restaurante actual
          restauranteId: this.restaurante.id,
        };

        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar evento', err);
        this.error = 'No se pudo cargar la información del evento.';
        this.loading = false;
      },
    });
  }

  private prepararNuevo(): void {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');

    this.evento.fechaEvento = `${yyyy}-${mm}-${dd}`;
    this.evento.cachet = '';
    this.evento.realizado = false;
    this.evento.fechaCreacion = undefined;
    // artistaId ya no existe en el modelo, así que no se toca nada más
  }

  get tituloForm(): string {
    return this.modoEdicion ? 'Editar evento' : 'Crear evento';
  }

  onSubmit(form: NgForm): void {
    this.error = '';
    this.mensaje = '';

    if (form.invalid) {
      this.error = 'Completa todos los campos obligatorios.';
      return;
    }

    if (!this.evento.restauranteId) {
      this.error =
        'No se ha podido asociar el evento a un restaurante. Revisa tu perfil primero.';
      return;
    }

    // Asegurar que la fecha vaya en formato yyyy-MM-dd (por si acaso)
    if (this.evento.fechaEvento) {
      const d = new Date(this.evento.fechaEvento);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      this.evento.fechaEvento = `${yyyy}-${mm}-${dd}`;
    }

    // Si no viene fechaCreacion, la ponemos hoy
    if (!this.evento.fechaCreacion) {
      const hoy = new Date();
      const yyyy = hoy.getFullYear();
      const mm = String(hoy.getMonth() + 1).padStart(2, '0');
      const dd = String(hoy.getDate()).padStart(2, '0');
      this.evento.fechaCreacion = `${yyyy}-${mm}-${dd}`;
    }

    this.saving = true;

    const request$ =
      this.modoEdicion && this.eventoId
        ? this.eventoService.update(this.eventoId, this.evento)
        : this.eventoService.create(this.evento);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/restaurante/eventos']);
      },
      error: (err) => {
        console.error('Error al guardar evento', err);
        this.error = 'Ocurrió un error al guardar el evento.';
        this.saving = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/restaurante/eventos']);
  }
}
