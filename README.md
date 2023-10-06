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

