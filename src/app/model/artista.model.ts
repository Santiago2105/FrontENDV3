export interface Artista {
  id?: number;
  nombreArtistico: string;
  generoPrincipal: string;
  bio: string;
  ciudad: string;
  usuarioId?: number; // id del usuario dueño del perfil
}
