# [Spring Boot 3 - OAuth2.0 Authorization Server y Resource Server - Angular](https://www.youtube.com/playlist?list=PL4bT56Uw3S4zqmhhzJdsA_8aNhttF3mWa)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.1.

---

# CAPÍTULO 7: Recibiendo Código de Autorización en Cliente Angular

Recordar que el **capítulo 6** y anteriores están en el repositorio del [authorization-server](https://github.com/magadiflo/authorization-server.git).

---

En este capítulo creamos el proyecto de Angular y finalizamos con el `Primer paso` del flujo del tipo de concesión `Authorization Code` de `OAuth 2`.

## Definiendo los environments

Ayudándonos de la `CLI de Angular` crearemos el directorio y archivos donde definiremos las variables de entorno a usar en el proyecto:

````
ng g environments
````
El comando anterior **genera y configura los archivos de entorno para nuestro proyecto**. 

Además de crear los archivos `environment.development.ts` y `environment.ts`, también los configura en el archivo `angular.json`:

```json
"development": {
  ...
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.development.ts"
    }
  ]
}
```
> **¡IMPORTANTE!**, es necesario bajar y levantar nuevamente el proyecto para que los cambios del `angular.json` hagan efecto.

Procedemos a definir las variables de entorno en el archivo `environment.development.ts` ya que estamos en el entorno de desarrollo:

```typescript
export const environment = {
  AUTHORIZE_URI: 'http://localhost:9000/oauth2/authorize',
  CLIENT_ID: 'front-end-app',
  REDIRECT_URI: 'http://localhost:4200/authorized',
  SCOPE: 'openid profile',
  RESPONSE_TYPE: 'code',
  RESPONSE_MODE: 'form_post',
  CODE_CHALLENGE_METHOD: 'S256',
  CODE_CHALLENGE: 'b2MtJ9pAteYoCGd8aSAolE-CxGbG4MEINELrtkLUQXs',
  CODE_VERIFIER: 'Q1YURYhqGHYUThV7auOYZijKzVhnIvEbTWJmWbeMAkn',
};
```
Ahora, en el archivo de producción `environment.ts` solo definimos las variables, cuando ya se pase a producción estas variables serán definidas:

```typescript
export const environment = {
  AUTHORIZE_URI: '',
  CLIENT_ID: '',
  REDIRECT_URI: '',
  SCOPE: '',
  RESPONSE_TYPE: '',
  RESPONSE_MODE: '',
  CODE_CHALLENGE_METHOD: '',
  CODE_CHALLENGE: '',
  CODE_VERIFIER: '',
};
```
Si observamos la imagen inferior veremos que las variables son las mismas que usamos en la página de [oauthdebugger/debug](https://oauthdebugger.com/debug) con la diferencia del valor del `redirect_uri`, en nuestro caso lo cambiamos para que redireccione a nuestra aplicación cliente de Angular.

![oauthdebugger.com](./src/assets/1.oauthdebugger.png)

En resumen, las variables que estamos definiendo en el `environment` corresponden a las variables que formarán el enlace para poder iniciar el flujo de autenticación con OAuth 2 con el tipo de concesión `Authorization Code`.

## Servicio

Crearemos la clase de servicio donde armaremos el enlace para iniciar el flujo de autenticación en OAuth 2 con el tipo de concesión de `Código de Autorización`. 

Primero crearemos un archivo que contendrá los siguientes detalles que se usarán en la consulta:

````typescript
export const enum AUTHORIZE_REQUEST {
  CLIENT_ID = 'client_id',
  REDIRECT_URI = 'redirect_uri',
  SCOPE = 'scope',
  RESPONSE_TYPE = 'response_type',
  RESPONSE_MODE = 'response_mode',
  CODE_CHALLENGE_METHOD = 'code_challenge_method',
  CODE_CHALLENGE = 'code_challenge',
}
````

Finalmente, creamos nuestra clase de servicio `AuthService` donde crearemos el enlace para iniciar el flujo de autenticacion con nuestro servidor de autorización similar al enlace que nos crea la página `oauthdebugger.com`:

````typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private get _params(): HttpParams {
    return new HttpParams()
      .set(AUTHORIZE_REQUEST.CLIENT_ID, environment.CLIENT_ID)
      .set(AUTHORIZE_REQUEST.REDIRECT_URI, environment.REDIRECT_URI)
      .set(AUTHORIZE_REQUEST.SCOPE, environment.SCOPE)
      .set(AUTHORIZE_REQUEST.RESPONSE_TYPE, environment.RESPONSE_TYPE)
      .set(AUTHORIZE_REQUEST.RESPONSE_MODE, environment.RESPONSE_MODE)
      .set(AUTHORIZE_REQUEST.CODE_CHALLENGE_METHOD, environment.CODE_CHALLENGE_METHOD)
      .set(AUTHORIZE_REQUEST.CODE_CHALLENGE, environment.CODE_CHALLENGE);
  }

  startFlowOAuth2AuthorizationCode(): void {
    window.location.href = `${environment.AUTHORIZE_URI}?${this._params.toString()}`;
  }

}
````

**NOTA**

> Estamos utilizando la propiedad `href` del objeto `window.location` de javascript para poder cambiar la URL de la página web actual en la que se encuentra el navegador web. En nuestro caso, estaremos cambiando a la dirección del servidor de autorización para iniciar el proceso de autenticación.
>
> No podemos utilizar `HttpClient`, ya que `HttpClient` se utiliza para realizar solicitudes HTTP y obtener datos de una API externa, pero **no puede usarse para redirigir el navegador del usuario a una URL externa.**

## Componentes

Crearemos 3 componentes: **authorized, home y menu**.

El componente `AuthorizedComponent` recibirá el `Authorization Code` devuelto por el servidor de autorización como parte del **primer paso del flujo de autenticación**, así que nos toca recibir dicho código mediante un **query param**:

```typescript
@Component({
  selector: 'app-authorized',
  standalone: true,
  templateUrl: './authorized.component.html',
  styleUrls: ['./authorized.component.scss']
})
export class AuthorizedComponent implements OnInit {

  public code?: string;
  private _activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this._activatedRoute.queryParams
      .subscribe(({ code }) => this.code = code);
  }

}
```

Para ver el código que nos retorna el servidor imprimimos la variable `code` en la plantilla html:

```html
<h3>Authorization Code</h3>
<pre>
  <code>{{ code }}</code>
</pre>
```

El otro componente importante es el `MenuComponent`, aquí creamos el método `onLogin()` desde donde llamamos al servicio `AuthService` e iniciamos el flujo de autenticación de OAuth 2:

```typescript
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  private _authService = inject(AuthService);

  onLogin(): void {
    this._authService.startFlowOAuth2AuthorizationCode();
  }

}
```

A continuación se muestra solo la parte del html donde se inicia el flujo:

```html
<form class="d-flex" role="search">
  <button class="btn btn-outline-success" (click)="onLogin()" type="button">Login</button>
  <button class="btn btn-outline-danger" type="button">Logout</button>
</form>
```

## Routes

Definimos las rutas que usaremos en el proyecto:

```typescript
export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, },
  { path: 'authorized', component: AuthorizedComponent, },
  { path: '**', redirectTo: '', pathMatch: 'full', },
];
```


Esta ruta `path: 'authorized'` es muy importante, pues **es la que definimos en los environments** como `redirect_uri`. Es a donde precisamente el servidor de autorización reenviará el `Código de Autorización` como parte de la finalización del **PRIMER PASO** del tipo de concesión de código de autorización.

## AppComponent

En el `AppComponent` importamos los componentes necesarios que usaremos en su html:

```typescript
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
}
```

El html quedaría de esta manera:

```html
<app-menu />
<main class="container">
  <router-outlet />
</main>
```
