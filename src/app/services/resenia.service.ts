// src/app/services/resenia.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resenia } from '../model/resenia.model';

@Injectable({
  providedIn: 'root',
})
export class ReseniaService {
  private baseUrl = 'http://localhost:8080/upc/resenias';

  constructor(private http: HttpClient) {}

  listAll(): Observable<Resenia[]> {
    return this.http.get<Resenia[]>(this.baseUrl);
  }

  getById(id: number): Observable<Resenia> {
    return this.http.get<Resenia>(`${this.baseUrl}/${id}`);
  }

  create(resenia: Resenia): Observable<Resenia> {
    return this.http.post<Resenia>(this.baseUrl, resenia);
  }

  update(id: number, resenia: Resenia): Observable<Resenia> {
    return this.http.put<Resenia>(`${this.baseUrl}/${id}`, resenia);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Consultas

  getByEvento(eventoId: number): Observable<Resenia[]> {
    return this.http.get<Resenia[]>(`${this.baseUrl}/evento/${eventoId}`);
  }
}
