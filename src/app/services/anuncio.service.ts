// src/app/services/anuncio.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Anuncio } from '../model/anuncio.model';

@Injectable({
  providedIn: 'root',
})
export class AnuncioService {
  private baseUrl = 'http://localhost:8080/upc/anuncios';

  constructor(private http: HttpClient) {}

  listAll(): Observable<Anuncio[]> {
    return this.http.get<Anuncio[]>(this.baseUrl);
  }

  getById(id: number): Observable<Anuncio> {
    return this.http.get<Anuncio>(`${this.baseUrl}/${id}`);
  }

  create(anuncio: Anuncio): Observable<Anuncio> {
    return this.http.post<Anuncio>(this.baseUrl, anuncio);
  }

  update(id: number, anuncio: Anuncio): Observable<Anuncio> {
    return this.http.put<Anuncio>(`${this.baseUrl}/${id}`, anuncio);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ✅ Ruta que SÍ existe en el backend:
  // GET /upc/anuncios/evento/{id}
  getByEvento(eventoId: number): Observable<Anuncio[]> {
    return this.http.get<Anuncio[]>(`${this.baseUrl}/evento/${eventoId}`);
  }

  // (opcionales, solo si los usas)
  getByActivo(activo: boolean): Observable<Anuncio[]> {
    return this.http.get<Anuncio[]>(`${this.baseUrl}/activo/${activo}`);
  }

  getByGenero(genero: string): Observable<Anuncio[]> {
    return this.http.get<Anuncio[]>(`${this.baseUrl}/genero/${genero}`);
  }
}
