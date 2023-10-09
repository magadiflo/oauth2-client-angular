import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { TokenService } from '../services/token.service';

export const resourceInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getAccessToken();
  let modifiedReq = req;

  if (token !== null && req.url.includes('resources')) {
    modifiedReq = req.clone({
      headers: req.headers.set(`Authorization`, `Bearer ${token}`),
    });
  }
  return next(modifiedReq);
};
