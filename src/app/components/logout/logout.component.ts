import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TokenService } from '@services/token.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  private _tokenService = inject(TokenService);
  private _router = inject(Router);

  ngOnInit(): void {
    this._tokenService.clear();
    this._router.navigate(['/']);
  }

}
