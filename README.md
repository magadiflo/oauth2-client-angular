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

## Ejecutando aplicación: 1° Paso - Recibir Código de Autorización

Antes de todo, debemos tener levantado el `Autorization Server`, luego proceder a dar el `Login`:

![2.start-flow-oauth2](./src/assets/2.start-flow-oauth2.png)

Como mencionamos en un apartado anterior al utilizar el `window.location.href` somos redireccionamos a la página del servidor de autorización. Podemos iniciar sesión con nuestra cuenta de `Google` o con algún usuario que tengamos registrado en el servidor de autorización. Para esta ocasión usaremos el usuario `user` registrado en el servidor de autorización:

![3-login-con-user](./src/assets/3-login-con-user.png)

Como finalización del **PRIMER PASO** del flujo de tipo de concesión de **Código de Autorización**, luego de iniciar sesión exitosamente en el servidor de autorización, éste nos redirecciona al `redirect_uri` que le definimos en la llamada inicial, en este caso a nuestra aplicación cliente de angular enviándonos el código de autorización que en términos de OAuth 2 este código es la prueba de que el usuario ha interactuado directamente con el `Authorization Server` acreditando su autorización:

![4.authorization-code](./src/assets/4.authorization-code.png)

---

# CAPÍTULO 8: Obteniendo Access Token en Cliente Angular

---

## EndPoint para obtener Token

Si revisamos las uris que el `servidor de autorización` nos proporciona veremos lo siguiente:

````json
/* http://localhost:9000/.well-known/oauth-authorization-server*/
{
    "issuer": "http://localhost:9000",
    "authorization_endpoint": "http://localhost:9000/oauth2/authorize",
    "device_authorization_endpoint": "http://localhost:9000/oauth2/device_authorization",
    "token_endpoint": "http://localhost:9000/oauth2/token",
    "token_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "client_secret_jwt",
        "private_key_jwt"
    ],
    "jwks_uri": "http://localhost:9000/oauth2/jwks",
    "response_types_supported": [
        "code"
    ],
    "grant_types_supported": [
        "authorization_code",
        "client_credentials",
        "refresh_token",
        "urn:ietf:params:oauth:grant-type:device_code"
    ],
    "revocation_endpoint": "http://localhost:9000/oauth2/revoke",
    "revocation_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "client_secret_jwt",
        "private_key_jwt"
    ],
    "introspection_endpoint": "http://localhost:9000/oauth2/introspect",
    "introspection_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post",
        "client_secret_jwt",
        "private_key_jwt"
    ],
    "code_challenge_methods_supported": [
        "S256"
    ]
}
````

De todas estas uris, el que ahora mismo nos interesa es el que nos proporciona el `Access Token`. Este endpoint es el `/oauth2/token` y lo colocaremos en el `environment` de desarrollo, mientras que en el de producción solo definiremos la variable `TOKEN_URL` con una cadena vacía '' como valor. Así mismo,
debemos agregar la variable `GRANT_TYPE` correspondiente al tipo de concesión de código de autorización:

````typescript
export const environment = {
  /* other properties */
  TOKEN_URL: 'http://localhost:9000/oauth2/token',
  GRANT_TYPE: 'authorization_code',
};
````

Ahora, en nuestra clase de servicio `AuthService` necesitamos usar el `HttpClient` para realizar las peticiones a los endpoints del backend. Para que Angular nos permita usar el `HttpClient` necesitamos agregar la función `provideHttpClient()` en el archivo `app.config.ts`:

````typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    provideHttpClient(), //<--- Nos permitirá trabajar con el HttpClient
  ]
};
````

## Nuevos enum e interfaces

Tenemos que definir nuevas variables de enumeración que serán usadas en la solicitud para la obtención del token:

```typescript
export const enum AUTHORIZE_REQUEST {
  /* other enums */
  GRANT_TYPE = 'grant_type',
  CODE_VERIFIER = 'code_verifier',
  CODE = 'code',
}
```
También definimos la interfaz `Token` que representa el objeto que nos retornará el backend:

````typescript
export interface Token {
  access_token:  string;
  refresh_token: string;
  scope:         string;
  id_token:      string;
  token_type:    string;
  expires_in:    number;
}
````

## Método del servicio para solicitar token

En nuestra clase de servicio creamos el método `getToken(code)` que a partir del código de autorización que le pasemos, deberá realizar una solicitud al backend para traer la información de los tokens:

````typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _http = inject(HttpClient);
  private _token_url = environment.TOKEN_URL;

  /* other code */

  public getToken(code: string): Observable<Token> {
    const clientCredentialsBase64 = btoa(`${environment.CLIENT_ID}:secret-key`);
    const headers = this.getHeaders(clientCredentialsBase64);
    const params = this.getParamsToken(code);
    return this._http.post<Token>(this._token_url, params, { headers });
  }

  getParamsToken(code: string): HttpParams {
    return new HttpParams()
      .set(AUTHORIZE_REQUEST.GRANT_TYPE, environment.GRANT_TYPE)
      .set(AUTHORIZE_REQUEST.CLIENT_ID, environment.CLIENT_ID)
      .set(AUTHORIZE_REQUEST.REDIRECT_URI, environment.REDIRECT_URI)
      .set(AUTHORIZE_REQUEST.CODE_VERIFIER, environment.CODE_VERIFIER)
      .set(AUTHORIZE_REQUEST.CODE, code);
  }

  private getHeaders(credentialsEncodedBase64: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentialsEncodedBase64}`,
    });
  }

}
````
## Inicia solicitud de Token

Luego de obtener el `Authorization Code`, de inmediato solicitamos un `Access Token` con ese código:

````typescript
@Component({
  selector: 'app-authorized',
  standalone: true,
  templateUrl: './authorized.component.html',
  styleUrls: ['./authorized.component.scss']
})
export class AuthorizedComponent implements OnInit {

  public code?: string;
  private _activatedRoute = inject(ActivatedRoute);
  private _authService = inject(AuthService);

  ngOnInit(): void {
    this._activatedRoute.queryParams
      .pipe(
        tap(({ code }) => this.code = code),
        switchMap(({ code }) => this._authService.getToken(code))
      )
      .subscribe(token => console.log(token));
  }
}
````

## Ejecutando: Obteniendo un Access Token al hacer login

Nos vamos a loguear con nuestra cuenta de google para poder obtener un `Access Token` y verificar de esa manera que todo lo realizdo en este capítulo está funcionando. 

¡Ojo!, es necesario que el `Authorization Server` esté levantado:

![obteniendo access token](./src/assets/5.access_token.png)

Listo, como observamos, estamos obteniendo un `access token` o para ser precisos varios tokens como prueba de que el flujo del tipo de concesión de código de autorización se efectuó correctamente.
