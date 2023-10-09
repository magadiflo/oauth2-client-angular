import { Injectable } from '@angular/core';

import { ACCESS_TOKEN, REFRESH_TOKEN } from '../common/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
  }

}
