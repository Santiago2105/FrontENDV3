export interface Postulacion {
  id?: number;

  mensaje: string;
  aceptada: boolean;
  fechaPostulacion: string;   // LocalDate -> string

  anuncioId: number;
  artistaId: number;
}
