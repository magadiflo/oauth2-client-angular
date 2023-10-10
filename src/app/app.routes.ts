import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { AuthorizedComponent } from './components/authorized/authorized.component';
import { UserComponent } from './components/user/user.component';
import { AdminComponent } from './components/admin/admin.component';
import { LogoutComponent } from './components/logout/logout.component';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, },
  { path: 'authorized', component: AuthorizedComponent, }, //<-- Importante esta ruta, es la que definimos en los environments a donde redireccionará el código de autorización
  { path: 'user', component: UserComponent, },
  { path: 'admin', component: AdminComponent, },
  { path: 'logout', component: LogoutComponent, },
  { path: '**', redirectTo: '', pathMatch: 'full', },
];
