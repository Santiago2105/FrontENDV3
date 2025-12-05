// src/app/services/postulacion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Postulacion } from '../model/postulacion.model';

@Injectable({
  providedIn: 'root',
})
export class PostulacionService {
  private baseUrl = 'http://localhost:8080/upc/postulaciones';

  constructor(private http: HttpClient) {}

  listAll(): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(this.baseUrl);
  }

  getById(id: number): Observable<Postulacion> {
    return this.http.get<Postulacion>(`${this.baseUrl}/${id}`);
  }

  create(postulacion: Postulacion): Observable<Postulacion> {
    return this.http.post<Postulacion>(this.baseUrl, postulacion);
  }

  update(id: number, postulacion: Postulacion): Observable<Postulacion> {
    return this.http.put<Postulacion>(`${this.baseUrl}/${id}`, postulacion);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Consultas

  getByAnuncio(anuncioId: number): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(`${this.baseUrl}/anuncio/${anuncioId}`);
  }
}
