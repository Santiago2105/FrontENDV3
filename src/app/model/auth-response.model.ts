export interface AuthResponse {
  jwtToken: string;
  id: number;
  authorities: string; // ejemplo: "ROLE_ADMIN;ROLE_RESTAURANTE"
}
