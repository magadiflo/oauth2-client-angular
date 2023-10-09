import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs';

import { AuthService } from '../../services/auth.service';

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

  ngOnInit(): void {
    this._activatedRoute.queryParams
      .pipe(
        tap(({ code }) => this.code = code),
        switchMap(({ code }) => this._authService.getToken(code))
      )
      .subscribe(token => console.log(token));
  }

}
