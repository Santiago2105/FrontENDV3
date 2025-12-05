// src/app/services/notificacion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notificacion } from '../model/notificacion.model';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  private baseUrl = 'http://localhost:8080/upc/notificaciones';

  constructor(private http: HttpClient) {}

  listAll(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.baseUrl);
  }

  getById(id: number): Observable<Notificacion> {
    return this.http.get<Notificacion>(`${this.baseUrl}/${id}`);
  }

  create(notificacion: Notificacion): Observable<Notificacion> {
    return this.http.post<Notificacion>(this.baseUrl, notificacion);
  }

  update(id: number, notificacion: Notificacion): Observable<Notificacion> {
    return this.http.put<Notificacion>(`${this.baseUrl}/${id}`, notificacion);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Consultas

  getByUsuario(usuarioId: number): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.baseUrl}/usuario/${usuarioId}`);
  }
}
