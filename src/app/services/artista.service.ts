import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artista } from '../model/artista.model';
import { environment } from '../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ArtistaService {
  private apiUrl = environment.apiUrl; // http://localhost:8080/upc

  constructor(private http: HttpClient) {}

  createArtista(artista: Artista): Observable<Artista> {
    return this.http.post<Artista>(`${this.apiUrl}/artistas`, {
      nombreArtistico: artista.nombreArtistico,
      generoPrincipal: artista.generoPrincipal,
      bio: artista.bio,
      ciudad: artista.ciudad,
      usuarioId: artista.usuarioId,
    });
  }

  updateArtista(id: number, artista: Artista): Observable<Artista> {
    return this.http.put<Artista>(`${this.apiUrl}/artistas/${id}`, {
      nombreArtistico: artista.nombreArtistico,
      generoPrincipal: artista.generoPrincipal,
      bio: artista.bio,
      ciudad: artista.ciudad,
      usuarioId: artista.usuarioId,
    });
  }

  // ✅ Adaptado al backend actual: usamos GET /artistas y filtramos por usuarioId
  getByUsuarioId(usuarioId: number): Observable<Artista | null> {
    return this.http.get<Artista[]>(`${this.apiUrl}/artistas`).pipe(
      map((lista: Artista[]) => {
        const encontrado = lista.find((a) => a.usuarioId === usuarioId);
        return encontrado ?? null;
      })
    );
  }

  listArtistas(): Observable<Artista[]> {
    return this.http.get<Artista[]>(`${this.apiUrl}/artistas`);
  }
}
