import { Routes } from '@angular/router';

/* PÚBLICO */
import { Landing } from './components/landing/landing';
import { Login } from './components/login/login';
import { Register } from './components/register/register';

/* ARTISTA */
import { ArtistaHome } from './components/artista-home/artista-home';
import { ArtistaDatos } from './components/artista-datos/artista-datos';
import { ArtistaPanel } from './components/artista-panel/artista-panel';
import { ArtistaPortafolio } from './components/artista-portafolio/artista-portafolio';
import { ArtistaPostulaciones } from './components/artista-postulaciones/artista-postulaciones';

/* RESTAURANTE */
import { RestauranteHome } from './components/restaurante-home/restaurante-home';
import { RestauranteDatos } from './components/restaurante-datos/restaurante-datos';
import { RestaurantePanel } from './components/restaurante-panel/restaurante-panel';
import { RestauranteEventos } from './components/restaurante-eventos/restaurante-eventos';
import { RestauranteAnuncios } from './components/restaurante-anuncios/restaurante-anuncios';
import { RestaurantePostulaciones } from './components/restaurante-postulaciones/restaurante-postulaciones';
import { RestauranteMensajes } from './components/restaurante-mensajes/restaurante-mensajes';
import { RestauranteResenas } from './components/restaurante-resenas/restaurante-resenas';
import { RestauranteEventoForm } from './components/restaurante-evento-form/restaurante-evento-form';
import { RestauranteAnuncioForm } from './components/restaurante-anuncio-form/restaurante-anuncio-form';

export const routes: Routes = [
  /* ---------- RUTAS PÚBLICAS ---------- */
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: Landing },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  /* ---------- PANEL DEL ARTISTA ---------- */
  {
    path: 'artista',
    component: ArtistaHome, // layout + sidebar + router-outlet
    children: [
      { path: 'datos', component: ArtistaDatos },
      { path: 'perfil', component: ArtistaPanel },
      { path: 'portafolio', component: ArtistaPortafolio },
      { path: 'postulaciones', component: ArtistaPostulaciones },
      { path: '', redirectTo: 'datos', pathMatch: 'full' },
    ],
  },

  /* ---------- PANEL DEL RESTAURANTE ---------- */
  {
    path: 'restaurante',
    component: RestauranteHome, // layout con sidebar + router-outlet
    children: [
      { path: 'datos', component: RestauranteDatos },
      { path: 'perfil', component: RestaurantePanel },

      // EVENTOS
      { path: 'eventos', component: RestauranteEventos },
      { path: 'eventos/crear', component: RestauranteEventoForm },
      { path: 'eventos/editar/:id', component: RestauranteEventoForm },

      // ANUNCIOS
      { path: 'anuncios', component: RestauranteAnuncios },
      { path: 'anuncios/crear', component: RestauranteAnuncioForm },
      { path: 'anuncios/editar/:id', component: RestauranteAnuncioForm },

      // OTRAS SECCIONES
      { path: 'postulaciones', component: RestaurantePostulaciones },
      { path: 'mensajes', component: RestauranteMensajes },
      { path: 'resenas', component: RestauranteResenas },

      { path: '', redirectTo: 'datos', pathMatch: 'full' },
    ],
  },

  /* ---------- CUALQUIER RUTA DESCONOCIDA ---------- */
  { path: '**', redirectTo: 'landing' },
];
