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

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  }

  isLogged(): boolean {
    return localStorage.getItem(ACCESS_TOKEN) !== null;
  }

  isAdmin(): boolean {
    if (!this.isLogged()) return false;
    const token = this.getAccessToken();
    const payload = token!.split(".")[1];
    const payloadDecoded = atob(payload);
    const values = JSON.parse(payloadDecoded);
    const roles = values.roles;
    return !(roles.indexOf('ROLE_ADMIN') < 0);
  }

}
