// src/app/services/portafolio.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Portafolio } from '../model/portafolio.model';

@Injectable({
  providedIn: 'root',
})
export class PortafolioService {
  private apiUrl = environment.apiUrl; // ej: http://localhost:8080/upc

  constructor(private http: HttpClient) {}

  // Lista por artista
  listByArtista(artistaId: number): Observable<Portafolio[]> {
    return this.http.get<Portafolio[]>(
      `${this.apiUrl}/portafolios/artista/${artistaId}`
    );
  }

  // Crear
  create(item: Portafolio): Observable<Portafolio> {
    const payload = {
      titulo: item.titulo,
      tipo: item.tipo,
      url: item.url,
      artistaId: item.artistaId,
      // fechaCreacion la puede setear el backend
    };

    return this.http.post<Portafolio>(`${this.apiUrl}/portafolios`, payload);
  }

  // Actualizar (usa el PUT del controller que recibe el DTO completo)
  update(item: Portafolio): Observable<Portafolio> {
    if (!item.id) {
      throw new Error('No se puede actualizar un portafolio sin id');
    }

    const payload = {
      titulo: item.titulo,
      tipo: item.tipo,
      url: item.url,
      artistaId: item.artistaId,
      // fechaCreacion si la quisieras mandar, pero el backend la puede manejar solo
    };

    return this.http.put<Portafolio>(
      `${this.apiUrl}/portafolios/${item.id}`,
      payload
    );
  }

  // Eliminar
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/portafolios/${id}`);
  }
}
