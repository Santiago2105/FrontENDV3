import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../model/evento.model';

@Injectable({
  providedIn: 'root',
})
export class EventoService {
  private baseUrl = 'http://localhost:8080/upc/eventos';

  constructor(private http: HttpClient) {}

  listAll(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseUrl);
  }

  getById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/${id}`);
  }

  create(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.baseUrl, evento);
  }

  update(id: number, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseUrl}/${id}`, evento);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // 🔹 eventos por restaurante (usa /upc/eventos/restaurante/{id})
  getByRestaurante(restauranteId: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/restaurante/${restauranteId}`);
  }


}
