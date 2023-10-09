import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AUTHORIZE_REQUEST } from '../common/authorized.enum';
import { environment } from '../../environments/environment';
import { Token } from '../common/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _http = inject(HttpClient);
  private _token_url = environment.TOKEN_URL;

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
