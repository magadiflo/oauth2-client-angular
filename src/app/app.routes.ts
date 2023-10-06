import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { AuthorizedComponent } from './components/authorized/authorized.component';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, },
  { path: 'authorized', component: AuthorizedComponent, }, //<-- Importante esta ruta, es la que definimos en los environments a donde redireccionará el código de autorización
  { path: '**', redirectTo: '', pathMatch: 'full', },
];
