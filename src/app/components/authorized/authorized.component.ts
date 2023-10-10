import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';

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
  private _tokenService = inject(TokenService);
  private _router = inject(Router);

  ngOnInit(): void {
    this._activatedRoute.queryParams
      .pipe(
        tap(({ code }) => this.code = code),
        switchMap(({ code }) => this._authService.getToken(code))
      )
      .subscribe(token => {
        console.log(token);
        this._tokenService.setTokens(token.access_token, token.refresh_token);
        this._router.navigate(['/']);
      });
  }

}
