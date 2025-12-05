// src/app/services/mensaje.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mensaje } from '../model/mensaje.model';

@Injectable({
  providedIn: 'root',
})
export class MensajeService {
  private baseUrl = 'http://localhost:8080/upc/mensajes';

  constructor(private http: HttpClient) {}

  listAll(): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(this.baseUrl);
  }

  getById(id: number): Observable<Mensaje> {
    return this.http.get<Mensaje>(`${this.baseUrl}/${id}`);
  }

  create(mensaje: Mensaje): Observable<Mensaje> {
    return this.http.post<Mensaje>(this.baseUrl, mensaje);
  }

  update(id: number, mensaje: Mensaje): Observable<Mensaje> {
    return this.http.put<Mensaje>(`${this.baseUrl}/${id}`, mensaje);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Consultas

  getByAnuncio(anuncioId: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.baseUrl}/anuncio/${anuncioId}`);
  }
}
