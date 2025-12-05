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
getByUsuarioId(usuarioId: number): Observable<Artista> {
  // Usamos la ruta optimizada que creamos en el Backend
  // Nota: El backend puede devolver 404 o null si no existe, hay que manejarlo en el componente
  return this.http.get<Artista>(`${this.apiUrl}/public/artistas/usuario/${usuarioId}`);
}

  listArtistas(): Observable<Artista[]> {
    return this.http.get<Artista[]>(`${this.apiUrl}/artistas`);
  }
}
