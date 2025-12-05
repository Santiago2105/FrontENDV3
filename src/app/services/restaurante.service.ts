// src/app/services/restaurante.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Restaurante } from '../model/restaurante.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestauranteService {
  // Igual que en ArtistaService
  private apiUrl = environment.apiUrl; // http://localhost:8080/upc

  constructor(private http: HttpClient) {}

  // CRUD básico
  create(restaurante: Restaurante): Observable<Restaurante> {
    return this.http.post<Restaurante>(`${this.apiUrl}/restaurantes`, restaurante);
  }

  update(restaurante: Restaurante): Observable<Restaurante> {
    if (!restaurante.id) {
      throw new Error('El restaurante no tiene id para actualizar');
    }
    return this.http.put<Restaurante>(`${this.apiUrl}/restaurantes/${restaurante.id}`, restaurante);
  }

  getById(id: number): Observable<Restaurante> {
    return this.http.get<Restaurante>(`${this.apiUrl}/restaurantes/${id}`);
  }

  getAll(): Observable<Restaurante[]> {
    return this.http.get<Restaurante[]>(`${this.apiUrl}/restaurantes`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/restaurantes/${id}`);
  }

  // Búsqueda por ciudad (si la usas)
  findByCiudad(ciudad: string): Observable<Restaurante[]> {
    return this.http.get<Restaurante[]>(`${this.apiUrl}/restaurantes/ciudad/${ciudad}`);
  }

  /**
   * ✅ Igual que en ArtistaService.getByUsuarioId, pero para Restaurante.
   * Traemos TODOS los restaurantes y filtramos por usuarioId en el frontend.
   */
  findByUsuario(usuarioId: number): Observable<Restaurante | null> {
    return this.http.get<Restaurante[]>(`${this.apiUrl}/restaurantes`).pipe(
      map((lista: Restaurante[]) => {
        const encontrado = lista.find((r) => r.usuarioId === usuarioId);
        return encontrado ?? null;
      })
    );
  }
}
