export interface Evento {
  id?: number;

  fechaEvento: string;      // LocalDate -> string "yyyy-MM-dd"
  cachet: string;
  realizado: boolean;
  fechaCreacion?: string;   // LocalDate -> string

  restauranteId: number;    // 🔹 SOLO restaurante
}
