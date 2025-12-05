export interface Resenia {
  id?: number;

  puntuacion: string;          // recuerdas que es con letras A/B/C/etc.
  comentario: string;
  fechaResenia: string;        // LocalDate -> string

  eventoId: number;
  artistaId: number;
  restauranteId: number;
}
