import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { AUTHORIZE_REQUEST } from '../common/authorized.enum';

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
