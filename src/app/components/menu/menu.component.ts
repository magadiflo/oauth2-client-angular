import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { TokenService } from '@services/token.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public isLogged: boolean = false;
  public isAdmin: boolean = false;
  private _authService = inject(AuthService);
  private _tokenService = inject(TokenService);

  ngOnInit(): void {
    this.getLogged();
  }

  onLogin(): void {
    this._authService.startFlowOAuth2AuthorizationCode();
  }

  onLogout(): void {
    this._authService.logout();
  }

  getLogged(): void {
    this.isLogged = this._tokenService.isLogged();
    this.isAdmin = this._tokenService.isAdmin();
  }

}
