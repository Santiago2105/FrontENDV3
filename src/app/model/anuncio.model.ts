export interface Anuncio {
  id?: number;

  titulo: string;
  descripcion: string;
  generoBuscado: string;
  ubicacion: string;
  presupuesto: string;

  activo: boolean;

  fechaCreacion?: string;  // LocalDate -> string
  fechaEvento: string;     // LocalDate -> string

  eventoId: number;
}
