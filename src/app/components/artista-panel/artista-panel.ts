import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ArtistaService } from '../../services/artista.service';
import { Artista } from '../../model/artista.model';

@Component({
  selector: 'app-artista-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artista-panel.html',
  styleUrl: './artista-panel.css',
})
export class ArtistaPanel implements OnInit {
  nombreArtistico: string = '';
  generoPrincipal: string = '';
  ciudad: string = '';
  bio: string = '';

  mensaje: string = '';
  error: string = '';

  usuarioId!: number;
  artistaId?: number; // 👈 para saber si es update o create

  constructor(
    private artistaService: ArtistaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    if (storedId) {
      this.usuarioId = Number(storedId);
    } else {
      this.error = 'No se encontró el usuario. Inicia sesión nuevamente.';
    }

    const storedPerfil = localStorage.getItem('artistaPerfil');
    if (storedPerfil) {
      try {
        const perfil: Artista = JSON.parse(storedPerfil) as Artista;
        this.nombreArtistico = perfil.nombreArtistico || '';
        this.generoPrincipal = perfil.generoPrincipal || '';
        this.ciudad = perfil.ciudad || '';
        this.bio = perfil.bio || '';
        this.artistaId = perfil.id; // 👈 importante
      } catch (e) {
        console.error('Error parseando artistaPerfil en panel', e);
      }
    }
  }

  guardarPerfil(): void {
    this.mensaje = '';
    this.error = '';

    if (!this.usuarioId) {
      this.error = 'No se encontró el usuario. Inicia sesión nuevamente.';
      return;
    }

    const artista: Artista = {
      id: this.artistaId,
      nombreArtistico: this.nombreArtistico,
      generoPrincipal: this.generoPrincipal,
      ciudad: this.ciudad,
      bio: this.bio,
      usuarioId: this.usuarioId,
    };

    // 👇 Si ya hay id, actualizamos; si no, creamos
    const request$ = this.artistaId
      ? this.artistaService.updateArtista(this.artistaId, artista)
      : this.artistaService.createArtista(artista);

    request$.subscribe({
      next: (resp) => {
        this.mensaje = 'Perfil de artista guardado correctamente.';

        // Guardar lo que devuelve el backend
        const artistaGuardado: Artista = resp;
        localStorage.setItem('artistaPerfil', JSON.stringify(artistaGuardado));
        localStorage.setItem('artistaPerfilCompleto', 'true');

        // 🔥 Recargar componente sin refrescar toda la app
        setTimeout(() => {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/artista']);
          });
        }, 300);
      },
      error: (err) => {
        console.error('Error al guardar artista:', err);
        this.error = 'No se pudo guardar el perfil de artista.';
      }
    });

  }
}
