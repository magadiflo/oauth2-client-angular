import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js';

import { ACCESS_TOKEN, REFRESH_TOKEN, CODE_VERIFIER } from '../common/interfaces';
import { environment } from '../../environments/environment';

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

  setVerifier(codeVerifier: string): void {
    if (localStorage.getItem(CODE_VERIFIER)) {
      this.deleteVerifier();
    }
    const encrypted = CryptoJS.AES.encrypt(codeVerifier, environment.SECRET_PKCE);
    localStorage.setItem(CODE_VERIFIER, encrypted.toString());
  }

  getVerfier(): string {
    const encrypted = localStorage.getItem(CODE_VERIFIER)!;
    const decrypted = CryptoJS.AES.decrypt(encrypted, environment.SECRET_PKCE).toString(CryptoJS.enc.Utf8);
    return decrypted;
  }

  deleteVerifier(): void {
    localStorage.removeItem(CODE_VERIFIER);
  }

}
