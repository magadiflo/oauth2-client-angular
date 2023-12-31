export const environment = {
  AUTHORIZE_URI: 'http://localhost:9000/oauth2/authorize',
  CLIENT_ID: 'front-end-app',
  REDIRECT_URI: 'http://localhost:4200/authorized',
  SCOPE: 'openid profile',
  RESPONSE_TYPE: 'code',
  RESPONSE_MODE: 'form_post',
  CODE_CHALLENGE_METHOD: 'S256',
  TOKEN_URL: 'http://localhost:9000/oauth2/token',
  GRANT_TYPE: 'authorization_code',
  RESOURCE_URL: 'http://localhost:8080/api/v1/resources',
  LOGOUT_URL: 'http://localhost:9000/logout',
  SECRET_PKCE: 'mi-clave-secreta',
};
