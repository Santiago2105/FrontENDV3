export interface Notificacion {
  id?: number;

  mensaje: string;
  tipoNotificacion: string;
  leido: boolean;

  fechaNotificacion: string;  // LocalDate -> string

  usuarioId: number;
}
