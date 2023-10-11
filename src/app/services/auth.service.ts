import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';

import { AUTHORIZE_REQUEST } from '../common/authorized.enum';
import { environment } from '../../environments/environment';
import { Token } from '../common/interfaces';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _http = inject(HttpClient);
  private _tokenService = inject(TokenService);
  private _token_url = environment.TOKEN_URL;
  private static readonly CHARACTERS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  startFlowOAuth2AuthorizationCode(): void {
    const codeVerifier = this.generateCodeVerifier();
    this._tokenService.setVerifier(codeVerifier);
    const codeChallenge = this.generateCodeChallenge(codeVerifier);
    window.location.href = `${environment.AUTHORIZE_URI}?${this.getParamsCode(codeChallenge).toString()}`;
  }

  logout(): void {
    window.location.href = environment.LOGOUT_URL;
  }

  getToken(code: string, codeVerifier: string): Observable<Token> {
    const clientCredentialsBase64 = btoa(`${environment.CLIENT_ID}:secret-key`);
    const headers = this.getHeaders(clientCredentialsBase64);
    const params = this.getParamsToken(code, codeVerifier);
    return this._http.post<Token>(this._token_url, params, { headers });
  }

  getParamsCode(codeChallenge: string): HttpParams {
    return new HttpParams()
      .set(AUTHORIZE_REQUEST.CLIENT_ID, environment.CLIENT_ID)
      .set(AUTHORIZE_REQUEST.REDIRECT_URI, environment.REDIRECT_URI)
      .set(AUTHORIZE_REQUEST.SCOPE, environment.SCOPE)
      .set(AUTHORIZE_REQUEST.RESPONSE_TYPE, environment.RESPONSE_TYPE)
      .set(AUTHORIZE_REQUEST.RESPONSE_MODE, environment.RESPONSE_MODE)
      .set(AUTHORIZE_REQUEST.CODE_CHALLENGE_METHOD, environment.CODE_CHALLENGE_METHOD)
      .set(AUTHORIZE_REQUEST.CODE_CHALLENGE, codeChallenge);
  }

  getParamsToken(code: string, codeVerifier: string): HttpParams {
    return new HttpParams()
      .set(AUTHORIZE_REQUEST.GRANT_TYPE, environment.GRANT_TYPE)
      .set(AUTHORIZE_REQUEST.CLIENT_ID, environment.CLIENT_ID)
      .set(AUTHORIZE_REQUEST.REDIRECT_URI, environment.REDIRECT_URI)
      .set(AUTHORIZE_REQUEST.CODE_VERIFIER, codeVerifier)
      .set(AUTHORIZE_REQUEST.CODE, code);
  }

  private getHeaders(credentialsEncodedBase64: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentialsEncodedBase64}`,
    });
  }

  generateCodeVerifier(): string {
    let result = '';
    const charLength = AuthService.CHARACTERS.length;
    for (let i = 0; i < 44; i++) {
      result += AuthService.CHARACTERS.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
  }

  generateCodeChallenge(codeVerifier: string): string {
    const codeVerifierHash = CryptoJS.SHA256(codeVerifier).toString(CryptoJS.enc.Base64);
    const codeChallenge = codeVerifierHash
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    return codeChallenge;
  }

}
