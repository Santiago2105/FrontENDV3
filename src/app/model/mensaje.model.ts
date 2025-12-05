export interface Mensaje {
  id?: number;

  texto: string;
  fechaEnvio: string;       // LocalDate -> string

  anuncioId: number;
  usuarioId: number;
}
