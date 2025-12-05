import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ArtistaService } from '../../services/artista.service';
import { Artista } from '../../model/artista.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username: string = '';
  password: string = '';
  errorMsg: string = '';

  constructor(
    private authService: AuthService,
    private artistaService: ArtistaService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMsg = '';

    this.authService
      .login({ username: this.username, password: this.password })
      .subscribe({
        // 👇 AHORA SÍ RECIBIMOS LA RESPUESTA DEL BACKEND
        next: (res: any) => {
          // ================================
          // 1. OBTENER Y GUARDAR ROL / USER
          // ================================
          // ajusta según tu respuesta real de login
          const usuario = res.usuario || res.user || res;   // fallback genérico
          const userId = usuario.id || usuario.userId;
          const authorities = usuario.authorities || res.authorities;

          // puede venir como string o array
          let rol = '';
          if (Array.isArray(authorities)) {
            // ej: [{ authority: 'ROLE_RESTAURANTE' }]
            const first = authorities[0];
            rol = (first?.authority || first || '').toString();
          } else if (authorities) {
            // ej: 'ROLE_RESTAURANTE'
            rol = authorities.toString();
          }

          // guardamos en localStorage por si lo necesitas luego
          if (userId) {
            localStorage.setItem('userId', String(userId));
          }
          if (rol) {
            localStorage.setItem('rol', rol);
          }

          const usuarioId = userId ? Number(userId) : null;
          const rolUpper = (rol || '').toUpperCase();

          // ============================
          // 2. FLUJO PARA RESTAURANTE
          // ============================
          if (rolUpper.includes('RESTAUR')) {
            // aquí puedes luego validar perfil de restaurante si quieres
            this.router.navigate(['/restaurante/datos']);   // 👈 home del restaurante
            return;
          }

          // =======================
          // 3. FLUJO PARA ARTISTA
          // =======================
          if (!usuarioId) {
            this.router.navigate(['/artista/perfil']);
            return;
          }

          this.artistaService.getByUsuarioId(usuarioId).subscribe({
            next: (data) => {
              let perfil: Artista | null = null;

              if (Array.isArray(data) && data.length > 0) {
                perfil = data[0] as Artista;
              } else if (data && !Array.isArray(data)) {
                perfil = data as Artista;
              }

              if (perfil) {
                localStorage.setItem('artistaPerfilCompleto', 'true');
                localStorage.setItem('artistaPerfil', JSON.stringify(perfil));
                this.router.navigate(['/artista']);          // panel artista
              } else {
                localStorage.setItem('artistaPerfilCompleto', 'false');
                localStorage.removeItem('artistaPerfil');
                this.router.navigate(['/artista/perfil']);   // completar perfil
              }
            },
            error: () => {
              this.router.navigate(['/artista/perfil']);
            },
          });
        },
        error: () => {
          this.errorMsg = 'Usuario o contraseña incorrectos';
        },
      });
  }
}
