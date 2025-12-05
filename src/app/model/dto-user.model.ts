export interface DTOUser {
  username: string;
  password: string;
  authorities: string; // "ROLE_RESTAURANTE", "ROLE_ARTISTA", "ROLE_ADMIN", etc.
}
