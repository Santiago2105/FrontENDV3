import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { DTOUser } from '../../model/dto-user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  username: string = '';
  password: string = '';
  authorities: string = 'ROLE_RESTAURANTE'; // valor por defecto

  successMsg: string = '';
  errorMsg: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit(): void {
    this.successMsg = '';
    this.errorMsg = '';

    const user: DTOUser = {
      username: this.username,
      password: this.password,
      authorities: this.authorities, // "ROLE_RESTAURANTE" o "ROLE_ARTISTA"
    };

    this.userService.registrar(user).subscribe({
      next: () => {
        this.successMsg = 'Registro exitoso. Ahora puedes iniciar sesión.';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err);

        // Si el backend devuelve 409 (conflicto), asumimos nombre repetido
        if (err.status === 409) {
          this.errorMsg = 'El nombre de usuario ya existe. Elige otro.';
        } else {
          this.errorMsg = 'No se pudo registrar el usuario.';
        }
      },
    });
  }
}
