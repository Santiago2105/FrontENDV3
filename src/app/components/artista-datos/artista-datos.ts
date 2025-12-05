import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ArtistaService } from '../../services/artista.service';
import { Artista } from '../../model/artista.model';

@Component({
  selector: 'app-artista-datos',
  standalone: true,
  templateUrl: './artista-datos.html',
  styleUrl: './artista-datos.css',
  imports: [CommonModule],
})
export class ArtistaDatos implements OnInit {
  artista: Artista | null = null;
  mensaje: string = '';
  error: string = '';

  constructor(
    private artistaService: ArtistaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1️⃣ Intentar leer del localStorage
    const stored = localStorage.getItem('artistaPerfil');
    if (stored) {
      try {
        this.artista = JSON.parse(stored) as Artista;
        return;
      } catch (e) {
        console.error('Error parseando artistaPerfil de localStorage', e);
      }
    }

    // 2️⃣ Plan B: traer desde el backend
    const storedId = localStorage.getItem('userId');
    if (!storedId) {
      this.error = 'No se encontró el usuario. Inicia sesión nuevamente.';
      return;
    }

    const usuarioId = Number(storedId);

    this.artistaService.getByUsuarioId(usuarioId).subscribe({
      next: (artista) => {
        console.log('Respuesta getByUsuarioId en Mis datos:', artista);
        if (artista) {
          this.artista = artista;

          // Guardamos en localStorage para futuros ingresos
          localStorage.setItem('artistaPerfil', JSON.stringify(this.artista));
          localStorage.setItem('artistaPerfilCompleto', 'true');
        } else {
          this.mensaje = 'Aún no has creado tu perfil de artista.';
        }
      },
      error: (err) => {
        console.error('Error al obtener artista:', err);
        this.error = 'No se pudo obtener la información del artista.';
      },
    });
  }

  editarPerfil(): void {
    this.router.navigate(['/artista/perfil']);
  }
}
